// ------------------------------------------------------------
// users.routes.js
// Routes for user profile operations.
// ------------------------------------------------------------

import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';

import {
  getAllUsers,
  getUserById,
  updateUser
} from '../controllers/users.controllers.js';

const router = Router();

// Public or protected? Up to you — usually protected:
router.get('/', requireAuth, getAllUsers);
router.get('/:id', requireAuth, getUserById);
router.put('/:id', requireAuth, updateUser);

export default router;
