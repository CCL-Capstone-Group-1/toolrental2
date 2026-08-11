// ------------------------------------------------------------
// reviews.controller.js
// Handles reviews left by renters on listings.
// ------------------------------------------------------------

import prisma from '../src/prisma.js';
import { sendError } from '../utils/response.js';

// GET /api/reviews
export async function getAllReviews(req, res) {
  try {
    const reviews = await prisma.review.findMany({
      include: { listing: true, user: true },
    });
    return res.json(reviews);
  } catch (err) {
    console.error('Error fetching reviews:', err);
    return sendError(res, 500, 'Failed to fetch reviews');
  }
}

// GET /api/reviews/:id
export async function getReviewById(req, res) {
  try {
    const { id } = req.params;

    const review = await prisma.review.findUnique({
      where: { id: Number(id) },
      include: { listing: true, user: true },
    });

    if (!review) return sendError(res, 404, 'Review not found');

    return res.json(review);
  } catch (err) {
    console.error('Error fetching review:', err);
    return sendError(res, 500, 'Failed to fetch review');
  }
}

// POST /api/reviews
export async function createReview(req, res) {
  try {
    const newReview = await prisma.review.create({ data: req.body });
    return res.status(201).json(newReview);
  } catch (err) {
    console.error('Error creating review:', err);
    return sendError(res, 500, 'Failed to create review');
  }
}

// PUT /api/reviews/:id
export async function updateReview(req, res) {
  try {
    const { id } = req.params;

    const updated = await prisma.review.update({
      where: { id: Number(id) },
      data: req.body,
    });

    return res.json(updated);
  } catch (err) {
    console.error('Error updating review:', err);
    return sendError(res, 500, 'Failed to update review');
  }
}

// DELETE /api/reviews/:id
export async function deleteReview(req, res) {
  try {
    const { id } = req.params;

    await prisma.review.delete({
      where: { id: Number(id) },
    });

    return res.status(204).send();
  } catch (err) {
    console.error('Error deleting review:', err);
    return sendError(res, 500, 'Failed to delete review');
  }
}
