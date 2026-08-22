// ------------------------------------------------------------
// listings.controller.js
// CRUD for tool listings owned by users.
// ------------------------------------------------------------

import prisma from '../prisma/client.js';
import { sendError } from '../utils/response.js';

function listingData(body, ownerId) {
  const {
    title, toolType, category, availabilityStart, availabilityEnd,
    description, pricePerDay, imageUrl, isActive,
  } = body;

  if (!title || pricePerDay === undefined || Number.isNaN(Number(pricePerDay))) {
    const error = new Error('title and a numeric pricePerDay are required');
    error.status = 400;
    throw error;
  }

  return {
    title,
    tool_type: toolType || null,
    category: category || null,
    availability_start: availabilityStart ? new Date(availabilityStart) : null,
    availability_end: availabilityEnd ? new Date(availabilityEnd) : null,
    description: description || null,
    price: Number(pricePerDay),
    image_url: imageUrl || null,
    ...(ownerId !== undefined && { owner_id: ownerId }),
    ...(isActive !== undefined && { is_active: Boolean(isActive) }),
  };
}

function publicListing(listing) {
  const safeOwner = listing.users
    ? (({ password_hash: _passwordHash, ...owner }) => owner)(listing.users)
    : listing.users;

  return {
    ...listing,
    users: safeOwner,
    toolType: listing.tool_type,
    availabilityStart: listing.availability_start,
    availabilityEnd: listing.availability_end,
    pricePerDay: listing.price,
    imageUrl: listing.image_url,
    ownerId: listing.owner_id,
    isActive: listing.is_active,
  };
}

// GET /api/listings
export async function getAllListings(req, res) {
  try {
    const listings = await prisma.listings.findMany({
      orderBy: { created_at: 'desc' },
      include: { tools: true, users: true },
    });
    return res.json(listings.map(publicListing));
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

    return res.json(publicListing(listing));
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
    const newListing = await prisma.listings.create({ data: listingData(req.body, req.user.id) });
    return res.status(201).json(publicListing(newListing));
  } catch (err) {
    console.error('Error creating listing:', err);
    return sendError(res, err.status || 500, err.status ? err.message : 'Failed to create listing');
  }
}

// PUT /api/listings/:id
export async function updateListing(req, res) {
  try {
    const { id } = req.params;

    const existing = await prisma.listings.findUnique({ where: { id: Number(id) } });
    if (!existing) return sendError(res, 404, 'Listing not found');
    if (existing.owner_id !== req.user.id) return sendError(res, 403, 'You do not own this listing');

    const updated = await prisma.listings.update({
      where: { id: Number(id) },
      data: listingData(req.body),
    });

    return res.json(publicListing(updated));
  } catch (err) {
    console.error('Error updating listing:', err);
    return sendError(res, err.status || 500, err.status ? err.message : 'Failed to update listing');
  }
}

// DELETE /api/listings/:id
export async function deleteListing(req, res) {
  try {
    const { id } = req.params;

    const existing = await prisma.listings.findUnique({ where: { id: Number(id) } });
    if (!existing) return sendError(res, 404, 'Listing not found');
    if (existing.owner_id !== req.user.id) return sendError(res, 403, 'You do not own this listing');

    await prisma.listings.delete({
      where: { id: Number(id) },
    });

    return res.status(204).send();
  } catch (err) {
    console.error('Error deleting listing:', err);
    return sendError(res, 500, 'Failed to delete listing');
  }
}
