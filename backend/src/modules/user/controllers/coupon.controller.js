const Coupon = require("../../../models/Coupon");
const { success, error } = require("../../../utils/apiResponse");

exports.getPublicCoupons = async (req, res) => {
  try {
    const now = new Date();
    const coupons = await Coupon.find({ 
      active: true, 
      validFrom: { $lte: now },
      validUntil: { $gte: now },
      $or: [
        { usageLimit: null },
        { $expr: { $lt: ["$usageCount", "$usageLimit"] } }
      ]
    }).select("code type value minOrderValue description validUntil");
    return success(res, { coupons }, "Active coupons retrieved");
  } catch (err) { return error(res, err.message); }
};

const Order = require("../../../models/Order");

exports.validateCoupon = async (req, res) => {
  try {
    const { code, cartTotal, items } = req.body;
    const userId = req.user.userId;

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), active: true });

    if (!coupon) return error(res, "Invalid or expired coupon code", 400);

    // 1. Date Validation
    const now = new Date();
    if (coupon.validFrom && now < coupon.validFrom) return error(res, "Coupon not yet active", 400);
    if (coupon.validUntil && now > coupon.validUntil) return error(res, "Coupon expired", 400);

    // 2. Usage Limit Validation
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) return error(res, "Coupon usage limit reached", 400);

    // 3. User Specific Validation
    const userUsage = coupon.usedBy.filter(u => u.userId.toString() === userId).length;
    if (userUsage >= coupon.perUserLimit) return error(res, "You have already used this coupon", 400);

    // 4. User Eligibility (New User)
    if (coupon.userEligibility === "new") {
      const priorOrders = await Order.countDocuments({ userId, paymentStatus: "paid" });
      if (priorOrders > 0) return error(res, "This coupon is only for first-time customers", 400);
    }

    // 5. Applicability Checks
    let isApplicable = true;
    let applicableItems = items || [];

    if (coupon.applicabilityType !== "all") {
      isApplicable = false;
      if (!items || items.length === 0) return error(res, "Cart items required for validation", 400);

      applicableItems = items.filter(item => {
        if (coupon.applicabilityType === "category") {
          return coupon.applicableCategories.includes(item.categoryId);
        }
        if (coupon.applicabilityType === "subcategory") {
          return coupon.applicableSubcategories.includes(item.subcategoryId);
        }
        if (coupon.applicabilityType === "product") {
          return coupon.applicableProducts.includes(item.productId);
        }
        return false;
      });

      if (applicableItems.length > 0) isApplicable = true;
    }

    if (!isApplicable) return error(res, "Coupon not applicable to items in your cart", 400);

    // 6. Min Order Value
    const applicableTotal = coupon.applicabilityType === "all" 
      ? cartTotal 
      : applicableItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    if (applicableTotal < coupon.minOrderValue) {
      return error(res, `Minimum value of ₹${coupon.minOrderValue} required for applicable items`, 400);
    }

    // 7. Calculate Discount
    let discount = 0;
    if (coupon.type === "flat") {
      discount = coupon.value;
    } else if (coupon.type === "percentage") {
      discount = Math.round((applicableTotal * coupon.value) / 100);
      if (coupon.maxDiscount && discount > coupon.maxDiscount) discount = coupon.maxDiscount;
    } else if (coupon.type === "free_shipping") {
      discount = 0; // Handled separately as shipping discount
    }

    // Ensure discount doesn't exceed applicable total
    discount = Math.min(discount, applicableTotal);

    return success(res, { 
      code: coupon.code,
      discount,
      type: coupon.type,
      value: coupon.value,
      isFreeShipping: coupon.type === "free_shipping"
    }, "Coupon applied successfully");

  } catch (err) { 
    console.error("Coupon Validation Error:", err);
    return error(res, err.message); 
  }
};
