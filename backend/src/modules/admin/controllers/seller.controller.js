const Seller = require("../../../models/Seller");
const { success, error } = require("../../../utils/apiResponse");
const { sendEmail } = require("../../../services/emailService");

exports.getSellers = async (req, res) => {
  try {
    const { status, search } = req.query;
    const query = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { shopName: { $regex: search, $options: "i" } },
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }

    const sellers = await Seller.find(query).sort({ createdAt: -1 });
    return success(res, { sellers }, "Sellers retrieved");
  } catch (err) { return error(res, err.message); }
};

exports.getSellerDetail = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);
    if (!seller) return error(res, "Seller not found", 404);
    return success(res, { seller }, "Seller details retrieved");
  } catch (err) { return error(res, err.message); }
};

exports.updateSellerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return error(res, "Invalid status", 400);
    }

    const seller = await Seller.findById(id);
    if (!seller) return error(res, "Seller not found", 404);

    seller.status = status;
    if (status === "REJECTED") {
      if (!rejectionReason || !rejectionReason.trim()) {
        return error(res, "Rejection reason is required", 400);
      }
      seller.rejectionReason = rejectionReason;
    } else {
      seller.rejectionReason = null;
    }
    
    await seller.save();

    if (seller.email) {
      await sendEmail({
        email: seller.email,
        subject: `Your seller account has been ${status.toLowerCase()}`,
        message: status === "APPROVED"
          ? `Hi ${seller.fullName}, your seller account is approved. You can now log in to the seller panel.`
          : `Hi ${seller.fullName}, your seller account was rejected. Reason: ${rejectionReason || "Not specified"}.`,
      });
    }
    
    return success(res, { seller }, `Seller ${status.toLowerCase()} successfully`);
  } catch (err) { return error(res, err.message); }
};
