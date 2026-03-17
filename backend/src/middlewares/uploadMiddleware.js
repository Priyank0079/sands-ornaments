const multer = require("multer");
const { CloudinaryStorage } = require("@fluidjs/multer-cloudinary");
const cloudinary = require("../config/cloudinary");

const makeStorage = (folder) =>
  new CloudinaryStorage({
    cloudinary,
    params: { folder: `sands-ornaments/${folder}`, allowed_formats: ["jpg", "jpeg", "png", "webp"] },
  });

const productUpload   = multer({ storage: makeStorage("products"),   limits: { fileSize: 10 * 1024 * 1024 } });
const categoryUpload  = multer({ storage: makeStorage("categories"), limits: { fileSize: 5  * 1024 * 1024 } });
const bannerUpload    = multer({ storage: makeStorage("banners"),    limits: { fileSize: 10 * 1024 * 1024 } });
const blogUpload      = multer({ storage: makeStorage("blogs"),      limits: { fileSize: 5  * 1024 * 1024 } });
const evidenceUpload  = multer({ storage: makeStorage("returns"),    limits: { fileSize: 50 * 1024 * 1024 } });

const upload = productUpload; // Alias for generic use

module.exports = { 
  productUpload, 
  categoryUpload, 
  bannerUpload, 
  blogUpload, 
  evidenceUpload, 
  upload 
};
