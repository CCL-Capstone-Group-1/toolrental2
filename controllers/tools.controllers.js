// ------------------------------------------------------------
// tools.controller.js
// CRUD operations for tool types (e.g., “Cordless Drill”).
// ------------------------------------------------------------

import prisma from '../src/prisma.js';
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

    const tools = await prisma.tools.findUnique({
      where: { id: Number(id) },
    });

    if (!tools) return sendError(res, 404, 'Tool not found');

    return res.json(tools);
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
    console.error('Error updating tools:', err);
    return sendError(res, 500, 'Failed to update tools');
  }
}

// DELETE /api/tools/:id
export async function deleteTool(req, res) {
  try {
    const { id } = req.params;

    return res.status(204).send();
  } catch (err) {
    console.error('Error deleting tool:', err);
    return sendError(res, 500, 'Failed to delete tool');
  }
}
