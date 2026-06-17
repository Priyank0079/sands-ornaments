const SupportTicket = require("../../../models/SupportTicket");
const { success, error } = require("../../../utils/apiResponse");
const socketEmitter = require("../../../services/socketEmitter");

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

    const newReply = { from: "admin", text: message, date: new Date() };
    ticket.replies.push(newReply);
    
    if (status) ticket.status = status;
    else ticket.status = "In Progress";
    
    await ticket.save();

    // Emit support message event to user and admin rooms
    socketEmitter.emitSupportMessage(ticket, newReply);

    return success(res, { ticket }, "Reply added and status updated");
  } catch (err) { return error(res, err.message); }
};
