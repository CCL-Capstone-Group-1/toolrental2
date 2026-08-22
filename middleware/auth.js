// ------------------------------------------------------------
// auth.js
// Verifies our own JWT (signed with JWT_SECRET in users.controllers.js).
// No Supabase Auth call here at all.
// ------------------------------------------------------------
import jwt from 'jsonwebtoken';
import { sendError } from '../utils/response.js';

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return sendError(res, 401, 'Missing Authorization header');
    }

    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) {
      return sendError(res, 401, 'Invalid Authorization header format');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return sendError(res, 401, 'Invalid or expired token');
  }
}