const Replacement = require("../../../models/Replacement");
const { success, error } = require("../../../utils/apiResponse");

exports.getAllReplacements = async (req, res) => {
  try {
    const { status } = req.query;
    const replacements = await Replacement.find(status ? { status } : {})
      .populate("userId", "name phone")
      .populate("orderId", "orderId")
      .sort({ createdAt: -1 });
    return success(res, { replacements }, "Replacements retrieved");
  } catch (err) { return error(res, err.message); }
};

exports.updateReplacementStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const repl = await Replacement.findById(req.params.id);
    if (!repl) return error(res, "Replacement not found", 404);

    repl.status = status;
    repl.timeline.push({ status, note, date: new Date() });
    await repl.save();

    return success(res, { repl }, `Replacement ${status} successfully`);
  } catch (err) { return error(res, err.message); }
};
