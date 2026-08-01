// ------------------------------------------------------------
// prisma.js
// This file creates and exports a single PrismaClient instance.
// We import this client in our controllers to run database queries.
// ------------------------------------------------------------

import { PrismaClient } from '@prisma/client';

// Create one Prisma client for the whole app.
// (Creating multiple clients can cause connection issues.)
const prisma = new PrismaClient();

export default prisma;
