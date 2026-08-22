// ------------------------------------------------------------
// listings.controller.js
// CRUD for tool listings owned by users.
// ------------------------------------------------------------

import prisma from '../prisma/client.js';
import { sendError } from '../utils/response.js';

// GET /api/listings
export async function getAllListings(req, res) {
  try {
    const listings = await prisma.listings.findMany({
      include: { tools: true, users: true },
    });
    return res.json(listings);
  } catch (err) {
    console.error('Error fetching listings:', err);
    return sendError(res, 500, 'Failed to fetch listings');
  }
}

// GET /api/listings/:id
export async function getListingById(req, res) {
  try {
    const { id } = req.params;

    const listing = await prisma.listings.findUnique({
      where: { id: Number(id) },
      include: { tools: true, users: true },
    });

    if (!listing) return sendError(res, 404, 'Listing not found');

    return res.json(listing);
  } catch (err) {
    console.error('Error fetching listing:', err);
    return sendError(res, 500, 'Failed to fetch listing');
  }
}

// GET /api/listings/:id/bookings
// Returns the date ranges this listing is already booked for, so the
// frontend can block/warn about those dates before a renter submits.
export async function getListingBookings(req, res) {
  try {
    const { id } = req.params;

    const bookings = await prisma.loans.findMany({
      where: {
        listing_id: Number(id),
        status: { not: 'cancelled' },
      },
      select: { start_date: true, end_date: true },
    });

    return res.json(bookings);
  } catch (err) {
    console.error('Error fetching listing bookings:', err);
    return sendError(res, 500, 'Failed to fetch listing bookings');
  }
}

// POST /api/listings
export async function createListing(req, res) {
  try {
    const newListing = await prisma.listings.create({ data: req.body });
    return res.status(201).json(newListing);
  } catch (err) {
    console.error('Error creating listing:', err);
    return sendError(res, 500, 'Failed to create listing');
  }
}

// PUT /api/listings/:id
export async function updateListing(req, res) {
  try {
    const { id } = req.params;

    const updated = await prisma.listings.update({
      where: { id: Number(id) },
      data: req.body,
    });

    return res.json(updated);
  } catch (err) {
    console.error('Error updating listing:', err);
    return sendError(res, 500, 'Failed to update listing');
  }
}

// DELETE /api/listings/:id
export async function deleteListing(req, res) {
  try {
    const { id } = req.params;

    await prisma.listings.delete({
      where: { id: Number(id) },
    });

    return res.status(204).send();
  } catch (err) {
    console.error('Error deleting listing:', err);
    return sendError(res, 500, 'Failed to delete listing');
  }
}
