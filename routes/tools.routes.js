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
  deleteTool,
  getPopularTools,
  getSeasonalTools
} from '../controllers/tools.controllers.js';

const router = Router();

// GET /api/tools
// Lists all tools (supports optional ?category= and ?search= filters)
router.get('/', getAllTools);

// GET /api/tools/popular?limit=5
// Ranks tools by total number of loans, most-rented first
router.get('/popular', getPopularTools);

// GET /api/tools/seasonal?month=8&limit=5
// Ranks tools by loans started in a given month (defaults to current month)
router.get('/seasonal', getSeasonalTools);

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
