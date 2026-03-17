const router = require("express").Router();
const wishlistController = require("../controllers/wishlist.controller");
const authenticate = require("../../../middlewares/authenticate");

router.use(authenticate);

router.get("/", wishlistController.getWishlist);
router.post("/", wishlistController.addToWishlist);
router.delete("/:productId", wishlistController.removeFromWishlist);

module.exports = router;
