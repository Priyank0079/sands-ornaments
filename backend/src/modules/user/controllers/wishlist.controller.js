const User = require("../../../models/User");
const { success, error } = require("../../../utils/apiResponse");

exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate({
      path: "wishlist",
      select: "name slug brand images variants tags rating reviewCount",
      match: { status: "Active" }
    });
    return success(res, { wishlist: user.wishlist }, "Wishlist retrieved");
  } catch (err) { return error(res, err.message); }
};

exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    await User.findByIdAndUpdate(req.user.userId, {
      $addToSet: { wishlist: productId }
    });
    return success(res, {}, "Product added to wishlist");
  } catch (err) { return error(res, err.message); }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    await User.findByIdAndUpdate(req.user.userId, {
      $pull: { wishlist: productId }
    });
    return success(res, {}, "Product removed from wishlist");
  } catch (err) { return error(res, err.message); }
};
