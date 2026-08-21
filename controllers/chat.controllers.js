// ------------------------------------------------------------
// chat.controller.js
// Handles chat messages between owner and renter during a loan.
//
// NOTE: The live database (see prisma/schema.prisma) has no chat/message
// table. These endpoints are stubbed to return 501 Not Implemented rather
// than crashing on a missing Prisma model. Exports are kept so routes/
// chat.routes.js can still import them without breaking at boot time.
// ------------------------------------------------------------

import { sendError } from '../utils/response.js';

// GET /api/chat/loan/:loanId
export async function getMessagesForLoan(req, res) {
  return sendError(res, 501, 'Chat is not yet implemented');
}

// POST /api/chat
export async function sendMessage(req, res) {
  return sendError(res, 501, 'Chat is not yet implemented');
}
