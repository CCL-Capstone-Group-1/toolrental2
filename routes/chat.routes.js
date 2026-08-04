// ------------------------------------------------------------
// chat.routes.js
// This file defines the API endpoints for chat messages
// exchanged between an owner and renter during a loan.
// ------------------------------------------------------------

import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  getMessagesForLoan,
  sendMessage
} from '../controllers/chat.controllers.js';

const router = Router();

// GET /api/chat/loan/:loanId
// Lists all messages for a given loan, oldest first
router.get('/loan/:loanId', requireAuth, getMessagesForLoan);

// POST /api/chat
// Sends a new chat message
router.post('/', requireAuth, sendMessage);

export default router;
