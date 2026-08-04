// ------------------------------------------------------------
// loans.routes.js
// This file defines the API endpoints for rental loans.
// Each route calls a controller function that contains the logic.
// ------------------------------------------------------------

import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  getAllLoans,
  getLoanById,
  createLoan,
  updateLoan,
  deleteLoan
} from '../controllers/loans.controllers.js';

const router = Router();

// GET /api/loans
// Lists all loans (requires authentication)
router.get('/', requireAuth, getAllLoans);

// GET /api/loans/:id
// Gets one loan by its ID
router.get('/:id', requireAuth, getLoanById);

// POST /api/loans
// Creates a new loan (renter checking out a listing)
router.post('/', requireAuth, createLoan);

// PUT /api/loans/:id
// Updates a loan's details (e.g. status, return date)
router.put('/:id', requireAuth, updateLoan);

// DELETE /api/loans/:id
// Deletes a loan
router.delete('/:id', requireAuth, deleteLoan);

export default router;
