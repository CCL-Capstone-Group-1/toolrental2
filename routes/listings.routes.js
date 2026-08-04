// ------------------------------------------------------------
// listings.routes.js
// This file defines the API endpoints for tool listings.
// Each route calls a controller function that contains the logic.
// ------------------------------------------------------------

import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  getAllListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing
} from '../controllers/listings.controllers.js';

const router = Router();

// GET /api/listings
// Lists all tool listings
router.get('/', getAllListings);

// GET /api/listings/:id
// Gets one listing by its ID
router.get('/:id', getListingById);

// POST /api/listings
// Creates a new listing (requires an authenticated owner)
router.post('/', requireAuth, createListing);

// PUT /api/listings/:id
// Updates a listing's details
router.put('/:id', requireAuth, updateListing);

// DELETE /api/listings/:id
// Deletes a listing
router.delete('/:id', requireAuth, deleteListing);

export default router;
