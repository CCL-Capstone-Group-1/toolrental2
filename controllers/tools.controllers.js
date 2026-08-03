// ------------------------------------------------------------
// tools.controller.js
// CRUD operations for tool types (e.g., “Cordless Drill”).
// ------------------------------------------------------------

import prisma from '../prisma/client.js';
import { sendError } from '../utils/response.js';

// GET /api/tools
export async function getAllTools(req, res) {
  try {
    const tools = await prisma.tool.findMany();
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

    const tool = await prisma.tool.findUnique({
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
    const newTool = await prisma.tool.create({ data: req.body });
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

    const updated = await prisma.tool.update({
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

    await prisma.tool.delete({
      where: { id: Number(id) },
    });

    return res.status(204).send();
  } catch (err) {
    console.error('Error deleting tool:', err);
    return sendError(res, 500, 'Failed to delete tool');
  }
}
