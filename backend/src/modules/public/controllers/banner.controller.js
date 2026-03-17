const Banner = require("../../../models/Banner");
const { success, error } = require("../../../utils/apiResponse");

exports.getActiveBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true }).sort({ sortOrder: 1 });
    return success(res, { banners });
  } catch (err) { return error(res, err.message); }
};
