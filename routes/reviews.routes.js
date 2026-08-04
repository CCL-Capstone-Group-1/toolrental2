// ------------------------------------------------------------
// reviews.routes.js
// This file defines the API endpoints for reviews left by
// renters on listings.
// ------------------------------------------------------------

import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview
} from '../controllers/reviews.controllers.js';

const router = Router();

// GET /api/reviews
// Lists all reviews
router.get('/', getAllReviews);

// GET /api/reviews/:id
// Gets one review by its ID
router.get('/:id', getReviewById);

// POST /api/reviews
// Creates a new review (requires an authenticated renter)
router.post('/', requireAuth, createReview);

// PUT /api/reviews/:id
// Updates a review's details
router.put('/:id', requireAuth, updateReview);

// DELETE /api/reviews/:id
// Deletes a review
router.delete('/:id', requireAuth, deleteReview);

export default router;
