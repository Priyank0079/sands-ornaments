const SupportTicket = require("../../../models/SupportTicket");
const { generateTicketId } = require("../../../utils/generateId");
const { success, error } = require("../../../utils/apiResponse");

exports.createTicket = async (req, res) => {
  try {
    const { subject, message, priority } = req.body;
    const ticket = await SupportTicket.create({
      ticketId: generateTicketId(),
      userId: req.user.userId,
      subject,
      messages: [{ sender: "user", message, senderId: req.user.userId }],
      priority: priority || "Medium"
    });
    return success(res, { ticket }, "Support ticket created", 201);
  } catch (err) { return error(res, err.message); }
};

exports.getMyTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find({ userId: req.user.userId }).sort({ updatedAt: -1 });
    return success(res, { tickets }, "Tickets retrieved");
  } catch (err) { return error(res, err.message); }
};

exports.addReply = async (req, res) => {
  try {
    const { message } = req.body;
    const ticket = await SupportTicket.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!ticket) return error(res, "Ticket not found", 404);

    ticket.messages.push({ sender: "user", message, senderId: req.user.userId });
    ticket.status = "Open"; // reopen if closed/resolved? Depends on policy
    await ticket.save();

    return success(res, { ticket }, "Reply added");
  } catch (err) { return error(res, err.message); }
};
