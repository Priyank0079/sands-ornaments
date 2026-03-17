const Setting = require("../../../models/Setting");
const { success, error } = require("../../../utils/apiResponse");

exports.getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({}); // Initialize with defaults
    }
    return success(res, { settings });
  } catch (err) { return error(res, err.message); }
};

exports.updateSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create(req.body);
    } else {
      Object.assign(settings, req.body);
      await settings.save();
    }
    return success(res, { settings }, "Settings updated successfully");
  } catch (err) { return error(res, err.message); }
};
