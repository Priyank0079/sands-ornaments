const cloudinary = require("../config/cloudinary");

/**
 * Deletes an image from Cloudinary based on its secure_url
 * @param {string} url - The Cloudinary image URL
 * @returns {Promise<object>} - Cloudinary destruction result
 */
const deleteFromCloudinary = async (url) => {
  try {
    if (!url || !url.includes("cloudinary.com")) return null;

    // Extract public_id from URL
    // Format: https://res.cloudinary.com/cloud_name/image/upload/v12345/folder/public_id.jpg
    const parts = url.split("/");
    const filenameWithExt = parts.pop();
    const publicIdWithFolder = parts.slice(parts.indexOf("upload") + 2).join("/") + "/" + filenameWithExt.split(".")[0];
    
    // Fallback if the above logic fails due to different URL structure
    const publicId = publicIdWithFolder.startsWith("/") ? publicIdWithFolder.substring(1) : publicIdWithFolder;

    const result = await cloudinary.uploader.destroy(publicId);
    console.log(`Cloudinary deletion result for ${publicId}:`, result);
    return result;
  } catch (err) {
    console.error("Cloudinary deletion error:", err);
    throw err;
  }
};

module.exports = { deleteFromCloudinary };
