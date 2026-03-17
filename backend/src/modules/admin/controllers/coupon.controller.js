const Coupon = require("../../../models/Coupon");
const { success, error } = require("../../../utils/apiResponse");

exports.createCoupon = async (req, res) => {
  try {
    const existing = await Coupon.findOne({ code: req.body.code.toUpperCase() });
    if (existing) return error(res, "Coupon code already exists", 409);

    const coupon = await Coupon.create(req.body);
    return success(res, { coupon }, "Coupon created successfully", 201);
  } catch (err) { return error(res, err.message); }
};

exports.getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    return success(res, { coupons });
  } catch (err) { return error(res, err.message); }
};

exports.updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!coupon) return error(res, "Coupon not found", 404);
    return success(res, { coupon }, "Coupon updated successfully");
  } catch (err) { return error(res, err.message); }
};

exports.deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return error(res, "Coupon not found", 404);
    return success(res, {}, "Coupon deleted successfully");
  } catch (err) { return error(res, err.message); }
};

exports.toggleCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return error(res, "Coupon not found", 404);
    coupon.active = !coupon.active;
    await coupon.save();
    return success(res, { coupon }, `Coupon ${coupon.active ? "enabled" : "disabled"}`);
  } catch (err) { return error(res, err.message); }
};
