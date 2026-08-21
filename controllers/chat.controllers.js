// ------------------------------------------------------------
// chat.controller.js
// Handles chat messages between owner and renter during a loan.
// ------------------------------------------------------------
import prisma from '../src/prisma.js';
import { sendError } from '../utils/response.js';

// GET /api/chat/listing/:listingId
export async function getMessagesForListing(req, res) {
  try {
    const { listingId } = req.params;

    const messages = await prisma.chatMessage.findMany({
      where: { listingId: Number(listingId) },
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
