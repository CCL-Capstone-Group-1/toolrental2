// ------------------------------------------------------------
// loans.controller.js
// Handles rental loans between users.
// ------------------------------------------------------------

import prisma from '../prisma/client.js';
import { sendError } from '../utils/response.js';

// GET /api/loans
export async function getAllLoans(req, res) {
  try {
    const loans = await prisma.loans.findMany({
      include: { listings: { include: { users: true } }, users: true },
    });
    return res.json(loans);
  } catch (err) {
    console.error('Error fetching loans:', err);
    return sendError(res, 500, 'Failed to fetch loans');
  }
}

// GET /api/loans/:id
export async function getLoanById(req, res) {
  try {
    const { id } = req.params;

    const loan = await prisma.loans.findUnique({
      where: { id: Number(id) },
      include: { listings: { include: { users: true } }, users: true },
    });

    if (!loan) return sendError(res, 404, 'Loan not found');

    return res.json(loan);
  } catch (err) {
    console.error('Error fetching loan:', err);
    return sendError(res, 500, 'Failed to fetch loan');
  }
}

// POST /api/loans
export async function createLoan(req, res) {
  try {
    const listingId = Number(req.body.listingId ?? req.body.listing_id ?? req.body.toolId);
    const startDate = req.body.startDate ?? req.body.start_date;
    const endDate = req.body.endDate ?? req.body.end_date;

    if (!listingId || !startDate || !endDate) {
      return sendError(res, 400, 'listingId, startDate, and endDate are required');
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const borrower = await prisma.users.findUnique({ where: { email: req.user.email } });
    if (!borrower) return sendError(res, 404, 'No profile found for this account');

    // Two date ranges overlap whenever one starts before the other ends, in
    // both directions. Cancelled loans don't hold the tool's calendar.
    const conflictingLoan = await prisma.loans.findFirst({
      where: {
        listing_id: listingId,
        status: { not: 'cancelled' },
        start_date: { lt: end },
        end_date: { gt: start },
      },
    });

    if (conflictingLoan) {
      return sendError(res, 409, 'This tool is already booked for part of that date range');
    }

    const newLoan = await prisma.loans.create({
      data: {
        listing_id: listingId,
        borrower_id: borrower.id,
        start_date: start,
        end_date: end,
        status: 'pending',
      },
      include: { listings: { include: { users: true } }, users: true },
    });

    return res.status(201).json(newLoan);
  } catch (err) {
    console.error('Error creating loan:', err);
    return sendError(res, 500, 'Failed to create loan');
  }
}

// PUT /api/loans/:id
export async function updateLoan(req, res) {
  try {
    const { id } = req.params;

    const updated = await prisma.loans.update({
      where: { id: Number(id) },
      data: req.body,
      include: { listings: { include: { users: true } }, users: true },
    });

    return res.json(updated);
  } catch (err) {
    console.error('Error updating loan:', err);
    return sendError(res, 500, 'Failed to update loan');
  }
}

// DELETE /api/loans/:id
export async function deleteLoan(req, res) {
  try {
    const { id } = req.params;

    await prisma.loans.delete({
      where: { id: Number(id) },
    });

    return res.status(204).send();
  } catch (err) {
    console.error('Error deleting loan:', err);
    return sendError(res, 500, 'Failed to delete loan');
  }
}
