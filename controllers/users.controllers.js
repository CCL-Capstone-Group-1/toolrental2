// ------------------------------------------------------------
// users.controller.js
// Handles user profile CRUD using Prisma.
// Supabase manages authentication; Prisma stores profile details.
// ------------------------------------------------------------

import prisma from '../prisma/client.js';
import supabase from '../db/supabase.js';
import { sendError } from '../utils/response.js';

// POST /api/users/register
// Creates the auth account in Supabase (which stores/hashes the password —
// we never touch it ourselves) and mirrors the profile into our own Users
// table, keyed by email. Returns a session token + the Prisma user row.
export async function register(req, res) {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) {
      return sendError(res, 400, 'Email and password are required');
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return sendError(res, 409, 'An account with this email already exists');
    }

    const { error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // skip email verification for this app
    });

    if (authError) {
      return sendError(res, 400, authError.message);
    }

    const user = await prisma.user.create({ data: { email, name } });

    const { data: sessionData, error: sessionError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (sessionError) {
      return sendError(res, 500, 'Account created, but failed to sign in');
    }

    return res.status(201).json({
      token: sessionData.session.access_token,
      user,
    });
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

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return sendError(res, 401, 'Invalid email or password');
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return sendError(res, 404, 'No profile found for this account');
    }

    return res.json({
      token: data.session.access_token,
      user,
    });
  } catch (err) {
    console.error('Error logging in:', err);
    return sendError(res, 500, 'Failed to log in');
  }
}

// GET /api/users/profile
// Protected by requireAuth, which attaches the Supabase auth user (verified
// from the JWT) to req.user. We look up the matching Prisma profile by email.
export async function getProfile(req, res) {
  try {
    const user = await prisma.user.findUnique({ where: { email: req.user.email } });
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
