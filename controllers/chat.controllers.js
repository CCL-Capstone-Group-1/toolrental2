// ------------------------------------------------------------
// chat.controller.js
// Handles chat messages between owner and renter during a loan.
// ------------------------------------------------------------

import prisma from '../src/prisma.js';
import { sendError } from '../utils/response.js';

// GET /api/chat/loan/:loanId
export async function getMessagesForLoan(req, res) {
  try {
    const { loanId } = req.params;

    const messages = await prisma.chatMessage.findMany({
      where: { loanId: Number(loanId) },
      include: { sender: true, receiver: true },
      orderBy: { createdAt: 'asc' },
    });

    return res.json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    return sendError(res, 500, 'Failed to fetch messages');
  }
}

// POST /api/chat
export async function sendMessage(req, res) {
  try {
    const newMessage = await prisma.chatMessage.create({
      data: req.body,
    });

    return res.status(201).json(newMessage);
  } catch (err) {
    console.error('Error sending message:', err);
    return sendError(res, 500, 'Failed to send message');
  }
}
