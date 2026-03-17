const Seller = require("../../../models/Seller");
const { success, error } = require("../../../utils/apiResponse");

exports.getProfile = async (req, res) => {
  try {
    const seller = await Seller.findById(req.user.userId);
    if (!seller) return error(res, "Seller not found", 404);
    return success(res, { seller });
  } catch (err) { return error(res, err.message); }
};

exports.updateProfile = async (req, res) => {
  try {
    const seller = await Seller.findByIdAndUpdate(req.user.userId, req.body, { new: true });
    return success(res, { seller }, "Profile updated successfully");
  } catch (err) { return error(res, err.message); }
};
