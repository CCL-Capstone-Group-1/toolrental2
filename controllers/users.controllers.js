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

function publicUser(user) {
  const { password_hash: _passwordHash, ...safeUser } = user;
  return {
    ...safeUser,
    firstName: user.first_name,
    lastName: user.last_name,
    homeAddress: user.home_address,
    aptNumber: user.apt_number,
    eSignature: user.e_signature,
    avatarUrl: user.avatar_url || user.image_url,
  };
}

// POST /api/users/register
export async function register(req, res) {
  try {
    const {
      firstName, lastName, name, email, password, homeAddress, aptNumber,
      city, state, eSignature, avatarUrl, imageUrl,
    } = req.body;
    if (!email || !password) {
      return sendError(res, 400, 'Email and password are required');
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await prisma.users.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      return sendError(res, 409, 'An account with this email already exists');
    }

    const password_hash = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
      data: {
        first_name: firstName || null,
        last_name: lastName || null,
        name: name || [firstName, lastName].filter(Boolean).join(' ') || email,
        email: normalizedEmail,
        password_hash,
        home_address: homeAddress || null,
        apt_number: aptNumber || null,
        city: city || null,
        state: state || null,
        e_signature: eSignature || null,
        avatar_url: avatarUrl || null,
        image_url: imageUrl || null,
      },
    });

    const token = signToken(user);
    return res.status(201).json({ token, user: publicUser(user) });
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

    const user = await prisma.users.findUnique({ where: { email: email.trim().toLowerCase() } });
    if (!user || !user.password_hash) {
      return sendError(res, 401, 'Invalid email or password');
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) {
      return sendError(res, 401, 'Invalid email or password');
    }

    const token = signToken(user);
    return res.json({ token, user: publicUser(user) });
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
    return res.json(publicUser(user));
  } catch (err) {
    console.error('Error fetching profile:', err);
    return sendError(res, 500, 'Failed to fetch profile');
  }
}

// GET /api/users
export async function getAllUsers(req, res) {
  try {
    const users = await prisma.users.findMany();
    return res.json(users.map(publicUser));
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
    return res.json(publicUser(user));
  } catch (err) {
    console.error('Error fetching user:', err);
    return sendError(res, 500, 'Failed to fetch user');
  }
}

// PUT /api/users/:id
export async function updateUser(req, res) {
  try {
    const { id } = req.params;
    if (Number(id) !== req.user.id) {
      return sendError(res, 403, 'You can only update your own profile');
    }

    const {
      firstName, lastName, name, email, password, homeAddress, aptNumber,
      city, state, eSignature, avatarUrl, imageUrl,
    } = req.body;
    const safeData = {
      ...(firstName !== undefined && { first_name: firstName }),
      ...(lastName !== undefined && { last_name: lastName }),
      ...(name !== undefined && { name }),
      ...(email !== undefined && { email: email.trim().toLowerCase() }),
      ...(homeAddress !== undefined && { home_address: homeAddress }),
      ...(aptNumber !== undefined && { apt_number: aptNumber }),
      ...(city !== undefined && { city }),
      ...(state !== undefined && { state }),
      ...(eSignature !== undefined && { e_signature: eSignature }),
      ...(avatarUrl !== undefined && { avatar_url: avatarUrl }),
      ...(imageUrl !== undefined && { image_url: imageUrl }),
      ...(password && { password_hash: await bcrypt.hash(password, 10) }),
    };

    const updated = await prisma.users.update({
      where: { id: Number(id) },
      data: safeData,
    });

    return res.json(publicUser(updated));
  } catch (err) {
    console.error('Error updating user:', err);
    return sendError(res, 500, 'Failed to update user');
  }
}