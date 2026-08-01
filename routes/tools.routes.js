// ------------------------------------------------------------
// tools.routes.js
// This file defines the API endpoints for tools.
// Each route calls a controller function that contains the logic.
// ------------------------------------------------------------

import { Router } from 'express';
import {
  getAllTools,
  getToolById,
  createTool,
  updateTool,
  deleteTool
} from '../controllers/tools.controller.js';

const router = Router();

// GET /api/tools
// Lists all tools (supports optional ?category= and ?search= filters)
router.get('/', getAllTools);

// GET /api/tools/:id
// Gets one tool by its ID
router.get('/:id', getToolById);

// POST /api/tools
// Creates a new tool (admin or owner action)
router.post('/', createTool);

// PUT /api/tools/:id
// Updates a tool's details
router.put('/:id', updateTool);

// DELETE /api/tools/:id
// Deletes a tool
router.delete('/:id', deleteTool);

export default router;
