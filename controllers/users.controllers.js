// ------------------------------------------------------------
// users.controller.js
// Handles user profile CRUD using Prisma.
// Supabase manages authentication; Prisma stores profile details.
// ------------------------------------------------------------

import prisma from '../src/prisma.js';
import { sendError } from '../utils/response.js';

// GET /api/users
export async function getAllUsers(req, res) {
  try {
    const users = await prisma.user.findMany();
    return res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    return sendError(res, 500, 'Failed to fetch users');
  }
}

// GET /api/users/:id
export async function getUserById(req, res) {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!user) return sendError(res, 404, 'User not found');

    return res.json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    return sendError(res, 500, 'Failed to fetch user');
  }
}

// PUT /api/users/:id
export async function updateUser(req, res) {
  try {
    const { id } = req.params;

    const updated = await prisma.user.update({
      where: { id: Number(id) },
      data: req.body,
    });

    return res.json(updated);
  } catch (err) {
    console.error('Error updating user:', err);
    return sendError(res, 500, 'Failed to update user');
  }
}
