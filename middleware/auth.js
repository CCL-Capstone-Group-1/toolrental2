// ------------------------------------------------------------
// auth.js
// This middleware verifies the Supabase JWT sent by the frontend.
// If the token is valid, we attach the authenticated user to req.user.
// If not, we block access to protected routes.
// ------------------------------------------------------------

import supabase from '../db/supabase.js';
import { sendError } from '../utils/response.js';

export async function requireAuth(req, res, next) {
  try {
    // The frontend must send the JWT in the Authorization header:
    // Authorization: Bearer <token>
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return sendError(res, 401, 'Missing Authorization header');
    }

    // Extract the token from "Bearer <token>"
    const token = authHeader.split(' ')[1];

    if (!token) {
      return sendError(res, 401, 'Invalid Authorization header format');
    }

    // Verify the token using Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return sendError(res, 401, 'Invalid or expired token');
    }

    // Attach the authenticated user to the request
    req.user = user;

    // Allow the request to continue
    next();
  } catch (err) {
    next(err);
  }
}
