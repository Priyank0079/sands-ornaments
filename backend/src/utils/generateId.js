const generateOrderId  = () => `ORD-${Date.now()}`;
const generateReturnId = () => `RET-${Math.floor(100000 + Math.random() * 900000)}`;
const generateReplId   = () => `REP-${Math.floor(100000 + Math.random() * 900000)}`;
const generateTicketId = () => `TKT-${Math.floor(100000 + Math.random() * 900000)}`;

module.exports = { generateOrderId, generateReturnId, generateReplId, generateTicketId };
