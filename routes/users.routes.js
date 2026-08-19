// ------------------------------------------------------------
// users.routes.js
// Routes for user profile operations.
// ------------------------------------------------------------

import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';

import {
  register,
  login,
  getProfile,
  getAllUsers,
  getUserById,
  updateUser
} from '../controllers/users.controllers.js';

const router = Router();

// Public auth endpoints
router.post('/register', register);
router.post('/login', login);

// Protected
router.get('/profile', requireAuth, getProfile);
router.get('/', requireAuth, getAllUsers);
router.get('/:id', requireAuth, getUserById);
router.put('/:id', requireAuth, updateUser);

export default router;
