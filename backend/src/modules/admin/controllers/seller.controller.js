const Seller = require("../../../models/Seller");
const { success, error } = require("../../../utils/apiResponse");

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
    if (status === "REJECTED") seller.rejectionReason = rejectionReason;
    
    await seller.save();

    // In production: Send email/SMS notification to seller here
    
    return success(res, { seller }, `Seller ${status.toLowerCase()} successfully`);
  } catch (err) { return error(res, err.message); }
};
