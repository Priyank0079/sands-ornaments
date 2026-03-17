const SupportTicket = require("../../../models/SupportTicket");
const { success, error } = require("../../../utils/apiResponse");

exports.getAllTickets = async (req, res) => {
  try {
    const { status, priority } = req.query;
    const query = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const tickets = await SupportTicket.find(query)
      .populate("userId", "name phone email")
      .sort({ updatedAt: -1 });
    return success(res, { tickets }, "Tickets retrieved");
  } catch (err) { return error(res, err.message); }
};

exports.addAdminReply = async (req, res) => {
  try {
    const { message, status } = req.body;
    const ticket = await SupportTicket.findById(req.params.id);
    if (!ticket) return error(res, "Ticket not found", 404);

    ticket.messages.push({ sender: "admin", message, senderId: req.user.userId });
    if (status) ticket.status = status;
    else ticket.status = "In Progress";
    
    await ticket.save();
    return success(res, { ticket }, "Reply added and status updated");
  } catch (err) { return error(res, err.message); }
};
