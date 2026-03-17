const Return = require("../../../models/Return");
const { success, error } = require("../../../utils/apiResponse");

exports.getReturns = async (req, res) => {
  try {
    const sellerId = req.user.userId;
    const returns = await Return.find({ "items.sellerId": sellerId })
      .populate("userId", "name phone")
      .populate("orderId", "orderId")
      .sort({ createdAt: -1 });
    return success(res, { returns });
  } catch (err) { return error(res, err.message); }
};

exports.getReturnDetail = async (req, res) => {
  try {
    const sellerId = req.user.userId;
    const returnReq = await Return.findOne({ _id: req.params.id, "items.sellerId": sellerId })
      .populate("userId", "name phone email")
      .populate("orderId");
    if (!returnReq) return error(res, "Return request not found", 404);
    return success(res, { returnReq });
  } catch (err) { return error(res, err.message); }
};

exports.processReturn = async (req, res) => {
  try {
    const sellerId = req.user.userId;
    const { status, remarks } = req.body;
    
    // Status restricted: Seller can only mark as "Received" or "Inspected"
    // Final approval "Refunded" is for Admin
    const returnReq = await Return.findOne({ _id: req.params.id, "items.sellerId": sellerId });
    if (!returnReq) return error(res, "Return request not found", 404);

    returnReq.status = status || returnReq.status;
    returnReq.remarks = remarks || returnReq.remarks;
    
    await returnReq.save();
    return success(res, { returnReq }, "Return request processed successfully");
  } catch (err) { return error(res, err.message); }
};
