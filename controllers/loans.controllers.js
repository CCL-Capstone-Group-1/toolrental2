// ------------------------------------------------------------
// loans.controller.js
// Handles rental loans between users.
// ------------------------------------------------------------

import prisma from '../src/prisma.js';
import { sendError } from '../utils/response.js';

// GET /api/loans
export async function getAllLoans(req, res) {
  try {
    const loans = await prisma.loan.findMany({
      include: { listing: true, renter: true },
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

    const loan = await prisma.loan.findUnique({
      where: { id: Number(id) },
      include: { listing: true, renter: true, messages: true },
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
    const newLoan = await prisma.loan.create({ data: req.body });
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

    const updated = await prisma.loan.update({
      where: { id: Number(id) },
      data: req.body,
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

    await prisma.loan.delete({
      where: { id: Number(id) },
    });

    return res.status(204).send();
  } catch (err) {
    console.error('Error deleting loan:', err);
    return sendError(res, 500, 'Failed to delete loan');
  }
}
