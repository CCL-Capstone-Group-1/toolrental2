// ------------------------------------------------------------
// prisma.js
// This file creates and exports a single PrismaClient instance.
// We import this client in our controllers to run database queries.
// ------------------------------------------------------------

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

// Supabase (and most hosted Postgres) requires SSL. The pg driver
// does not always pick that up from the connection string alone.
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export default prisma;
