// ------------------------------------------------------------
// users.controller.js
// Handles auth and profile CRUD entirely with Prisma + bcrypt + JWT.
// No Supabase Auth involved — this backend is the full source of truth
// for accounts, so it doesn't depend on any Supabase project settings.
// ------------------------------------------------------------

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prisma/client.js';
import { sendError } from '../utils/response.js';

const TOKEN_EXPIRY = '7d';

function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: TOKEN_EXPIRY,
  });
}

// POST /api/users/register
export async function register(req, res) {
  try {
    const { email, password, name, image_url } = req.body;
    if (!email || !password) {
      return sendError(res, 400, 'Email and password are required');
    }

    const existing = await prisma.users.findUnique({ where: { email } });
    if (existing) {
      return sendError(res, 409, 'An account with this email already exists');
    }

    const password_hash = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
      data: { email, name: name || email, password_hash, image_url: image_url || null },
    });

    const token = signToken(user);
    const { password_hash: _omit, ...safeUser } = user;

    return res.status(201).json({ token, user: safeUser });
  } catch (err) {
    console.error('Error registering user:', err);
    return sendError(res, 500, 'Failed to register user');
  }
}

// POST /api/users/login
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return sendError(res, 400, 'Email and password are required');
    }

    const user = await prisma.users.findUnique({ where: { email } });
    if (!user || !user.password_hash) {
      return sendError(res, 401, 'Invalid email or password');
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) {
      return sendError(res, 401, 'Invalid email or password');
    }

    const token = signToken(user);
    const { password_hash: _omit, ...safeUser } = user;

    return res.json({ token, user: safeUser });
  } catch (err) {
    console.error('Error logging in:', err);
    return sendError(res, 500, 'Failed to log in');
  }
}

// GET /api/users/profile   (protected by requireAuth)
export async function getProfile(req, res) {
  try {
    const user = await prisma.users.findUnique({ where: { id: req.user.id } });
    if (!user) return sendError(res, 404, 'User not found');
    const { password_hash, ...safeUser } = user;
    return res.json(safeUser);
  } catch (err) {
    console.error('Error fetching profile:', err);
    return sendError(res, 500, 'Failed to fetch profile');
  }
}

// GET /api/users
export async function getAllUsers(req, res) {
  try {
    const users = await prisma.users.findMany();
    const safeUsers = users.map(({ password_hash, ...u }) => u);
    return res.json(safeUsers);
  } catch (err) {
    console.error('Error fetching users:', err);
    return sendError(res, 500, 'Failed to fetch users');
  }
}

// GET /api/users/:id
export async function getUserById(req, res) {
  try {
    const { id } = req.params;
    const user = await prisma.users.findUnique({ where: { id: Number(id) } });
    if (!user) return sendError(res, 404, 'User not found');
    const { password_hash, ...safeUser } = user;
    return res.json(safeUser);
  } catch (err) {
    console.error('Error fetching user:', err);
    return sendError(res, 500, 'Failed to fetch user');
  }
}

// PUT /api/users/:id
export async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { password_hash, password, ...safeData } = req.body;

    const updated = await prisma.users.update({
      where: { id: Number(id) },
      data: safeData,
    });

    const { password_hash: _omit, ...safeUser } = updated;
    return res.json(safeUser);
  } catch (err) {
    console.error('Error updating user:', err);
    return sendError(res, 500, 'Failed to update user');
  }
}