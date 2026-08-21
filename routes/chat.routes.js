// ------------------------------------------------------------
// chat.routes.js
// This file defines the API endpoints for chat messages
// exchanged between an owner and renter during a loan.
// ------------------------------------------------------------

import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  getMessagesForListing, // Renamed from getMessagesForLoan
  sendMessage
} from '../controllers/chat.controllers.js';

const router = Router();

// GET /api/chat/listing/:listingId
// Lists all messages for a given listing, oldest first
router.get('/listing/:listingId', requireAuth, getMessagesForListing);

// POST /api/chat
// Sends a new chat message
router.post('/', requireAuth, sendMessage);

export default router;
