/**
 * Commission Service — orchestrates Commission ledger writes.
 *
 * Public API:
 *   • getActiveTiers()                                       → { tiers, enabled, source }
 *   • accrueCommissionsForOrder(order, { triggeredBy, session })
 *   • confirmCommissionsForOrder(orderId, { session })
 *   • reverseCommissionsForOrder(orderId, { triggeredBy, reasonNote, session })
 *   • recomputeOrderSummary(orderId, { session })            (internal-ish)
 *
 * Design:
 *   • All writes are best-effort wrapped so a ledger failure never silently
 *     corrupts the broader order flow — callers receive the result and
 *     decide how to react. By default we re-throw inside transactional
 *     callers and only swallow when the caller passes { safe: true }.
 *   • Idempotency: the Commission collection has a partial unique index
 *     on (orderId, sellerId) for open accruals, so duplicate calls
 *     for the same order produce a duplicate-key error that we treat
 *     as a no-op (the existing entry is already correct).
 *   • Ledger is the source of truth. Order.commissionSummary is a cache
 *     recomputed by recomputeOrderSummary after every write.
 */
"use strict";

const mongoose = require("mongoose");
const Commission = require("../models/Commission");
const Order      = require("../models/Order");
const Setting    = require("../models/Setting");
const { DEFAULT_COMMISSION_TIERS } = require("../constants/commissionTiers");
const {
  computeOrderCommissions,
  validateTiers,
} = require("../utils/commission");

// ─────────────────────────────────────────────────────────────────────────
// Tier resolution
// ─────────────────────────────────────────────────────────────────────────

/**
 * Read the active tier configuration from Setting, with a hardcoded fallback.
 * Returns the same shape regardless of source so callers can rely on it.
 *
 * source = "db" | "fallback" | "invalid-db-fallback"
 *   • db                 → Setting.commissionTiers was present and valid
 *   • fallback           → Setting empty / missing; using DEFAULT_COMMISSION_TIERS
 *   • invalid-db-fallback→ Setting had tiers but they were malformed; using defaults
 */
const getActiveTiers = async () => {
  const setting = await Setting.findOne().lean();
  const enabled = setting ? setting.commissionEnabled !== false : true;

  if (setting && Array.isArray(setting.commissionTiers) && setting.commissionTiers.length > 0) {
    const tiers = setting.commissionTiers.map((t) => ({
      minAmount:  Number(t.minAmount),
      maxAmount:  t.maxAmount === null || t.maxAmount === undefined ? null : Number(t.maxAmount),
      commission: Number(t.commission),
    }));
    const v = validateTiers(tiers);
    if (v.valid) return { tiers, enabled, source: "db" };
    console.warn("[Commission] DB tier config is invalid, falling back to defaults:", v.error);
    return { tiers: [...DEFAULT_COMMISSION_TIERS], enabled, source: "invalid-db-fallback" };
  }

  return { tiers: [...DEFAULT_COMMISSION_TIERS], enabled, source: "fallback" };
};

// ─────────────────────────────────────────────────────────────────────────
// Order summary recompute (denormalized cache)
// ─────────────────────────────────────────────────────────────────────────

const _toObjectIdOrNull = (id) => {
  if (!id) return null;
  if (id instanceof mongoose.Types.ObjectId) return id;
  try { return new mongoose.Types.ObjectId(String(id)); } catch (_) { return null; }
};

/**
 * Recompute Order.commissionSummary from the ledger.
 * Aggregates net commission (accruals + backfills − reversals) and picks
 * an overall status:
 *   • "none"      → no entries
 *   • "pending"   → all open entries are pending
 *   • "confirmed" → all open entries are confirmed
 *   • "partial"   → mix of pending and confirmed
 *   • "reversed"  → every entry was reversed (net = 0)
 */
const recomputeOrderSummary = async (orderId, { session } = {}) => {
  const oid = _toObjectIdOrNull(orderId);
  if (!oid) return null;

  const query = Commission.find({ orderId: oid });
  if (session) query.session(session);
  const entries = await query.lean();

  if (entries.length === 0) {
    const summary = { totalCommission: 0, status: "none", computedAt: new Date() };
    await Order.updateOne({ _id: oid }, { $set: { commissionSummary: summary } }, session ? { session } : {});
    return summary;
  }

  let total = 0;
  let pendingCount   = 0;
  let confirmedCount = 0;
  let reversedCount  = 0;
  let activeCount    = 0;

  for (const e of entries) {
    if (e.type === "reversal") {
      if (e.status !== "reversed") total -= Number(e.commissionAmount || 0);
      continue;
    }
    if (e.status === "pending")    { total += Number(e.commissionAmount || 0); pendingCount++;   activeCount++; }
    if (e.status === "confirmed")  { total += Number(e.commissionAmount || 0); confirmedCount++; activeCount++; }
    if (e.status === "reversed")   { reversedCount++; }
  }

  let status = "none";
  if (activeCount === 0 && reversedCount > 0) status = "reversed";
  else if (pendingCount > 0 && confirmedCount === 0) status = "pending";
  else if (confirmedCount > 0 && pendingCount === 0) status = "confirmed";
  else if (pendingCount > 0 && confirmedCount > 0)   status = "partial";

  const summary = {
    totalCommission: Math.max(0, Math.round(total)),
    status,
    computedAt: new Date(),
  };
  await Order.updateOne({ _id: oid }, { $set: { commissionSummary: summary } }, session ? { session } : {});
  return summary;
};

// ─────────────────────────────────────────────────────────────────────────
// Accrual
// ─────────────────────────────────────────────────────────────────────────

/**
 * Create one accrual row per seller for the given order.
 *
 * @param {Object} order  - Mongoose doc OR plain object with .items, ._id, .orderId, .discount, .giftCardDiscount
 * @param {Object} opts
 *   - triggeredBy: required, one of "place_order" | "payment_verified"
 *   - session:     optional Mongo session (for transactions)
 *   - safe:        when true, swallow errors and return { ok: false }
 *
 * Returns { ok, entries: [...], skipped: false } or { ok: false, error }.
 *
 * Idempotency: duplicate accrual attempts for the same (orderId, sellerId)
 * are silently ignored — Mongo's partial unique index rejects them and we
 * treat the existing row as authoritative.
 */
const accrueCommissionsForOrder = async (order, { triggeredBy, session, safe = false } = {}) => {
  if (!order) return _maybeThrow(safe, new Error("accrue: order is required"));
  if (!triggeredBy) return _maybeThrow(safe, new Error("accrue: triggeredBy is required"));

  try {
    const { tiers, enabled } = await getActiveTiers();
    if (!enabled) return { ok: true, skipped: true, reason: "commission_disabled", entries: [] };

    const orderId     = order._id;
    const orderNumber = order.orderId || String(order._id);
    const oid         = _toObjectIdOrNull(orderId);
    if (!oid) return _maybeThrow(safe, new Error("accrue: invalid order id"));

    const breakdown = computeOrderCommissions(
      {
        items:            order.items,
        discount:         order.discount,
        giftCardDiscount: order.giftCardDiscount,
      },
      tiers
    );

    if (breakdown.length === 0) {
      await recomputeOrderSummary(oid, { session });
      return { ok: true, skipped: true, reason: "no_eligible_items", entries: [] };
    }

    const created = [];
    for (const row of breakdown) {
      const sellerOid = _toObjectIdOrNull(row.sellerId);
      if (!sellerOid) continue;
      if (row.commissionAmount <= 0) continue;

      // Explicit idempotency check — defense in depth. The partial unique
      // index also guards against this, but indexes may not be live yet on
      // a freshly-created collection. Belt-and-braces approach: check first,
      // then rely on the index as a backstop via the duplicate-key catch.
      const existsQuery = Commission.findOne({
        orderId: oid,
        sellerId: sellerOid,
        type:   { $in: ["accrual", "backfill"] },
        status: { $in: ["pending", "confirmed"] },
      }).select("_id");
      if (session) existsQuery.session(session);
      const already = await existsQuery.lean();
      if (already) continue;

      const doc = {
        orderId:             oid,
        orderNumber,
        sellerId:            sellerOid,
        sellerSubtotal:      row.sellerSubtotal,
        sellerDiscountShare: row.sellerDiscountShare,
        sellerGiftCardShare: row.sellerGiftCardShare,
        taxableAmount:       row.taxableAmount,
        commissionAmount:    row.commissionAmount,
        tierLabel:           row.tierLabel,
        tierSnapshot:        row.tierSnapshot,
        type:                "accrual",
        status:              "pending",
        triggeredBy,
      };

      try {
        const opts = session ? { session } : {};
        const [inserted] = await Commission.create([doc], opts);
        created.push(inserted);
      } catch (err) {
        // Duplicate-key on the partial unique index → already accrued, ignore.
        if (err && (err.code === 11000 || err.code === 11001)) continue;
        throw err;
      }
    }

    await recomputeOrderSummary(oid, { session });
    return { ok: true, skipped: false, entries: created };
  } catch (err) {
    console.error("[Commission] accrue failed:", err.message);
    return _maybeThrow(safe, err);
  }
};

// ─────────────────────────────────────────────────────────────────────────
// Backfill (one-time migration for orders placed before commission existed)
// ─────────────────────────────────────────────────────────────────────────

/**
 * Create one backfill row per seller for a historical order. Behaves like
 * accrueCommissionsForOrder but stamps the entries with type="backfill",
 * triggeredBy="backfill", and picks the status from the caller (typically
 * "confirmed" for Delivered orders, "pending" for in-flight ones).
 *
 * NEVER overwrites or mutates existing entries — if there is already an
 * open ledger row for (orderId, sellerId), the seller is silently skipped.
 *
 * @param {Object} order        - Order doc / plain object (must include items, _id, orderId, discount, giftCardDiscount)
 * @param {Object} opts
 *   - statusForEntries: "pending" | "confirmed" (default: "pending")
 *   - tiers:            optional override; defaults to getActiveTiers() result
 *   - dryRun:           when true, compute but write nothing
 *   - session:          optional Mongo session
 *   - safe:             when true, swallow errors and return { ok: false }
 */
const backfillCommissionsForOrder = async (
  order,
  {
    statusForEntries = "pending",
    tiers: tiersOverride = null,
    dryRun = false,
    session,
    safe = false,
  } = {}
) => {
  if (!order) return _maybeThrow(safe, new Error("backfill: order is required"));
  if (!["pending", "confirmed"].includes(statusForEntries)) {
    return _maybeThrow(safe, new Error("backfill: invalid statusForEntries"));
  }

  try {
    let tiers;
    let enabled = true;
    if (Array.isArray(tiersOverride) && tiersOverride.length > 0) {
      const v = validateTiers(tiersOverride);
      if (!v.valid) return _maybeThrow(safe, new Error(`backfill: invalid tiers override: ${v.error}`));
      tiers = tiersOverride;
    } else {
      const active = await getActiveTiers();
      tiers   = active.tiers;
      enabled = active.enabled;
    }

    if (!enabled && !tiersOverride) {
      return { ok: true, skipped: true, reason: "commission_disabled", entries: [], plan: [] };
    }

    const orderId     = order._id;
    const orderNumber = order.orderId || String(order._id);
    const oid         = _toObjectIdOrNull(orderId);
    if (!oid) return _maybeThrow(safe, new Error("backfill: invalid order id"));

    const breakdown = computeOrderCommissions(
      {
        items:            order.items,
        discount:         order.discount,
        giftCardDiscount: order.giftCardDiscount,
      },
      tiers
    );

    if (breakdown.length === 0) {
      if (!dryRun) await recomputeOrderSummary(oid, { session });
      return { ok: true, skipped: true, reason: "no_eligible_items", entries: [], plan: [] };
    }

    const plan    = [];
    const created = [];

    for (const row of breakdown) {
      const sellerOid = _toObjectIdOrNull(row.sellerId);
      if (!sellerOid) continue;
      if (row.commissionAmount <= 0) continue;

      const existsQuery = Commission.findOne({
        orderId: oid,
        sellerId: sellerOid,
        type:   { $in: ["accrual", "backfill"] },
        status: { $in: ["pending", "confirmed"] },
      }).select("_id");
      if (session) existsQuery.session(session);
      const already = await existsQuery.lean();
      if (already) {
        plan.push({ sellerId: row.sellerId, commissionAmount: row.commissionAmount, skipped: true, reason: "exists" });
        continue;
      }

      const doc = {
        orderId:             oid,
        orderNumber,
        sellerId:            sellerOid,
        sellerSubtotal:      row.sellerSubtotal,
        sellerDiscountShare: row.sellerDiscountShare,
        sellerGiftCardShare: row.sellerGiftCardShare,
        taxableAmount:       row.taxableAmount,
        commissionAmount:    row.commissionAmount,
        tierLabel:           row.tierLabel,
        tierSnapshot:        row.tierSnapshot,
        type:                "backfill",
        status:              statusForEntries,
        triggeredBy:         "backfill",
      };

      plan.push({ sellerId: row.sellerId, commissionAmount: row.commissionAmount, skipped: false, doc });

      if (dryRun) continue;

      try {
        const opts = session ? { session } : {};
        const [inserted] = await Commission.create([doc], opts);
        created.push(inserted);
      } catch (err) {
        if (err && (err.code === 11000 || err.code === 11001)) continue; // duplicate-key — skip
        throw err;
      }
    }

    if (!dryRun) await recomputeOrderSummary(oid, { session });
    return { ok: true, skipped: false, entries: created, plan };
  } catch (err) {
    console.error("[Commission] backfill failed:", err.message);
    return _maybeThrow(safe, err);
  }
};

// ─────────────────────────────────────────────────────────────────────────
// Confirm (on Delivered)
// ─────────────────────────────────────────────────────────────────────────

/**
 * Flip all open pending accruals for an order to "confirmed".
 * Safe to call repeatedly — confirmed rows are left alone.
 */
const confirmCommissionsForOrder = async (orderId, { session, safe = false } = {}) => {
  const oid = _toObjectIdOrNull(orderId);
  if (!oid) return _maybeThrow(safe, new Error("confirm: invalid order id"));

  try {
    const filter = {
      orderId: oid,
      type:    { $in: ["accrual", "backfill"] },
      status:  "pending",
    };
    const opts = session ? { session } : {};
    const result = await Commission.updateMany(filter, { $set: { status: "confirmed" } }, opts);
    await recomputeOrderSummary(oid, { session });
    return { ok: true, matched: result.matchedCount || 0, modified: result.modifiedCount || 0 };
  } catch (err) {
    console.error("[Commission] confirm failed:", err.message);
    return _maybeThrow(safe, err);
  }
};

// ─────────────────────────────────────────────────────────────────────────
// Reverse (on cancel / return / refund)
// ─────────────────────────────────────────────────────────────────────────

/**
 * Insert reversal rows for every still-open accrual on the order and
 * flip the original rows' status to "reversed". Net effect on platform
 * revenue = 0. Already-reversed rows are skipped (idempotent).
 *
 * @param {Object} opts
 *   - triggeredBy: required, e.g. "order_cancelled" | "return_refunded" | "replacement"
 *   - reasonNote:  optional free-text
 *   - session:     optional Mongo session
 *   - safe:        when true, swallow errors and return { ok: false }
 */
const reverseCommissionsForOrder = async (
  orderId,
  { triggeredBy, reasonNote = "", session, safe = false } = {}
) => {
  if (!triggeredBy) return _maybeThrow(safe, new Error("reverse: triggeredBy is required"));
  const oid = _toObjectIdOrNull(orderId);
  if (!oid) return _maybeThrow(safe, new Error("reverse: invalid order id"));

  try {
    const opts = session ? { session } : {};

    // Only reverse rows that haven't been reversed yet.
    const cursor = Commission.find({
      orderId: oid,
      type:    { $in: ["accrual", "backfill"] },
      status:  { $in: ["pending", "confirmed"] },
    });
    if (session) cursor.session(session);
    const openEntries = await cursor;

    const reversals = [];
    for (const original of openEntries) {
      const reversalDoc = {
        orderId:             original.orderId,
        orderNumber:         original.orderNumber,
        sellerId:            original.sellerId,
        sellerSubtotal:      original.sellerSubtotal,
        sellerDiscountShare: original.sellerDiscountShare,
        sellerGiftCardShare: original.sellerGiftCardShare,
        taxableAmount:       original.taxableAmount,
        commissionAmount:    original.commissionAmount,
        tierLabel:           original.tierLabel,
        tierSnapshot:        original.tierSnapshot,
        type:                "reversal",
        status:              "confirmed",
        triggeredBy,
        reversesEntryId:     original._id,
        reasonNote,
      };

      const [inserted] = await Commission.create([reversalDoc], opts);
      reversals.push(inserted);

      original.status = "reversed";
      await original.save(opts);
    }

    await recomputeOrderSummary(oid, { session });
    return { ok: true, reversed: reversals.length, entries: reversals };
  } catch (err) {
    console.error("[Commission] reverse failed:", err.message);
    return _maybeThrow(safe, err);
  }
};

// ─────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────

const _maybeThrow = (safe, err) => {
  if (safe) return { ok: false, error: err.message };
  throw err;
};

module.exports = {
  getActiveTiers,
  accrueCommissionsForOrder,
  backfillCommissionsForOrder,
  confirmCommissionsForOrder,
  reverseCommissionsForOrder,
  recomputeOrderSummary,
};
