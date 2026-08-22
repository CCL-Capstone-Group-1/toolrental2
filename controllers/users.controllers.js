// ------------------------------------------------------------
// users.controller.js
// Handles user profile CRUD using Prisma.
// Supabase manages authentication (called directly from the frontend);
// this backend only stores/serves the profile row that mirrors it.
// ------------------------------------------------------------

import prisma from '../prisma/client.js';
import supabase from '../db/supabase.js';
import { sendError } from '../utils/response.js';

// POST /api/users/profile   (protected by requireAuth)
// Creates the Prisma profile row for a user who has ALREADY registered
// with Supabase Auth directly from the frontend (supabase.auth.signUp()).
// req.user is attached by requireAuth after verifying the Supabase JWT,
// so we trust req.user.email rather than trusting the request body for
// identity — the body only supplies extra profile fields.
export async function createProfile(req, res) {
  try {
    const email = req.user.email;
    const { name, image_url } = req.body;

    const existing = await prisma.users.findUnique({ where: { email } });
    if (existing) {
      // Already created (e.g. a retried request) — just return it instead
      // of erroring, so this endpoint is safe to call more than once.
      return res.status(200).json(existing);
    }

    const user = await prisma.users.create({
      data: { email, name: name || email, image_url: image_url || null },
    });

    return res.status(201).json(user);
  } catch (err) {
    console.error('Error creating profile:', err);
    return sendError(res, 500, 'Failed to create profile');
  }
}

// GET /api/users/profile
// Protected by requireAuth, which attaches the Supabase auth user (verified
// from the JWT) to req.user. We look up the matching Prisma profile by email.
export async function getProfile(req, res) {
  try {
    const user = await prisma.users.findUnique({ where: { email: req.user.email } });
    if (!user) return sendError(res, 404, 'User not found');
    return res.json(user);
  } catch (err) {
    console.error('Error fetching profile:', err);
    return sendError(res, 500, 'Failed to fetch profile');
  }
}

// GET /api/users
export async function getAllUsers(req, res) {
  try {
    const users = await prisma.users.findMany();
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

    const user = await prisma.users.findUnique({
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

    const updated = await prisma.users.update({
      where: { id: Number(id) },
      data: req.body,
    });

    return res.json(updated);
  } catch (err) {
    console.error('Error updating user:', err);
    return sendError(res, 500, 'Failed to update user');
  }
}