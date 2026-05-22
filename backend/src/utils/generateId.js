const crypto = require("crypto");

const generateOrderId  = () => `ORD-${Date.now()}`;
const generateReturnId = () => `RET-${Math.floor(100000 + Math.random() * 900000)}`;
const generateReplId   = () => `REP-${Math.floor(100000 + Math.random() * 900000)}`;
const generateTicketId = () => `TKT-${Math.floor(100000 + Math.random() * 900000)}`;

/**
 * Generates a cryptographically unique gift card code.
 * Format: SANDS-XXXX-XXXX-XXXX  (alphanumeric, uppercase, no ambiguous chars)
 */
const SAFE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I confusion
const generateGiftCardCode = () => {
  const segment = (len) =>
    Array.from(crypto.randomBytes(len))
      .map((b) => SAFE_CHARS[b % SAFE_CHARS.length])
      .join("");
  return `SANDS-${segment(4)}-${segment(4)}-${segment(4)}`;
};

module.exports = { generateOrderId, generateReturnId, generateReplId, generateTicketId, generateGiftCardCode };

