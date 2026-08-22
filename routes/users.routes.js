// ------------------------------------------------------------
// users.routes.js
// Routes for user profile operations. Authentication itself (signup/login)
// is now handled by the frontend calling Supabase Auth directly — this
// backend only creates and serves the Prisma profile row that mirrors it.
// ------------------------------------------------------------
import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  createProfile,
  getProfile,
  getAllUsers,
  getUserById,
  updateUser
} from '../controllers/users.controllers.js';
const router = Router();

// Protected — all of these require a valid Supabase session token
router.post('/profile', requireAuth, createProfile);
router.get('/profile', requireAuth, getProfile);
router.get('/', requireAuth, getAllUsers);
router.get('/:id', requireAuth, getUserById);
router.put('/:id', requireAuth, updateUser);

export default router;