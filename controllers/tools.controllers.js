// ------------------------------------------------------------
// tools.controller.js
// CRUD operations for tool types (e.g., “Cordless Drill”).
// ------------------------------------------------------------

import prisma from '../prisma/client.js';
import { sendError } from '../utils/response.js';

// GET /api/tools
export async function getAllTools(req, res) {
  try {
    const tools = await prisma.tools.findMany();
    return res.json(tools);
  } catch (err) {
    console.error('Error fetching tools:', err);
    return sendError(res, 500, 'Failed to fetch tools');
  }
}

// GET /api/tools/:id
export async function getToolById(req, res) {
  try {
    const { id } = req.params;

    const tool = await prisma.tools.findUnique({
      where: { id: Number(id) },
    });

    if (!tool) return sendError(res, 404, 'Tool not found');

    return res.json(tool);
  } catch (err) {
    console.error('Error fetching tool:', err);
    return sendError(res, 500, 'Failed to fetch tool');
  }
}

// POST /api/tools
export async function createTool(req, res) {
  try {
    const newTool = await prisma.tools.create({ data: req.body });
    return res.status(201).json(newTool);
  } catch (err) {
    console.error('Error creating tool:', err);
    return sendError(res, 500, 'Failed to create tool');
  }
}

// PUT /api/tools/:id
export async function updateTool(req, res) {
  try {
    const { id } = req.params;

    const updated = await prisma.tools.update({
      where: { id: Number(id) },
      data: req.body,
    });

    return res.json(updated);
  } catch (err) {
    console.error('Error updating tool:', err);
    return sendError(res, 500, 'Failed to update tool');
  }
}

// DELETE /api/tools/:id
export async function deleteTool(req, res) {
  try {
    const { id } = req.params;

    await prisma.tools.delete({
      where: { id: Number(id) },
    });

    return res.status(204).send();
  } catch (err) {
    console.error('Error deleting tool:', err);
    return sendError(res, 500, 'Failed to delete tool');
  }
}

// Counts loans per tool from a set of listing_id -> count pairs, by
// mapping each listing back to its tool. Shared by the popular/seasonal
// endpoints below.
async function countLoansByTool(listingIdCounts) {
  const listingIds = [...listingIdCounts.keys()];
  if (listingIds.length === 0) return new Map();

  const listings = await prisma.listings.findMany({
    where: { id: { in: listingIds } },
    include: { tools: true },
  });

  const countsByTool = new Map();
  for (const listing of listings) {
    if (!listing.tools) continue;
    const count = listingIdCounts.get(listing.id) || 0;
    const entry = countsByTool.get(listing.tools.id) || { tool: listing.tools, rentalCount: 0 };
    entry.rentalCount += count;
    countsByTool.set(listing.tools.id, entry);
  }

  return countsByTool;
}

function topN(countsByTool, limit) {
  return [...countsByTool.values()]
    .sort((a, b) => b.rentalCount - a.rentalCount)
    .slice(0, limit)
    .map(({ tool, rentalCount }) => ({ ...tool, rentalCount }));
}

// GET /api/tools/popular?limit=5
// Ranks tools by total number of loans across all their listings.
export async function getPopularTools(req, res) {
  try {
    const limit = Number(req.query.limit) || 5;

    const grouped = await prisma.loans.groupBy({
      by: ['listing_id'],
      _count: { _all: true },
    });

    const listingIdCounts = new Map(grouped.map((g) => [g.listing_id, g._count._all]));
    const countsByTool = await countLoansByTool(listingIdCounts);

    return res.json(topN(countsByTool, limit));
  } catch (err) {
    console.error('Error fetching popular tools:', err);
    return sendError(res, 500, 'Failed to fetch popular tools');
  }
}

// GET /api/tools/seasonal?month=8&limit=5
// Ranks tools by number of loans that started in the given month
// (1-12, defaults to the current month).
export async function getSeasonalTools(req, res) {
  try {
    const limit = Number(req.query.limit) || 5;
    const month = req.query.month ? Number(req.query.month) : new Date().getMonth() + 1;

    if (month < 1 || month > 12) {
      return sendError(res, 400, 'month must be between 1 and 12');
    }

    // Prisma's groupBy can't extract a date part, so loans are fetched
    // and bucketed by month in application code.
    const loans = await prisma.loans.findMany({
      select: { listing_id: true, start_date: true },
    });

    const listingIdCounts = new Map();
    for (const loan of loans) {
      if (loan.start_date.getMonth() + 1 !== month) continue;
      listingIdCounts.set(loan.listing_id, (listingIdCounts.get(loan.listing_id) || 0) + 1);
    }

    const countsByTool = await countLoansByTool(listingIdCounts);

    return res.json({ month, tools: topN(countsByTool, limit) });
  } catch (err) {
    console.error('Error fetching seasonal tools:', err);
    return sendError(res, 500, 'Failed to fetch seasonal tools');
  }
}
