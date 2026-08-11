// ------------------------------------------------------------
// supabase.js
// This file creates a Supabase client that we use for:
// - Authentication (verifying JWTs)
// - Storage (uploading images or ID verification files)
// ------------------------------------------------------------

import "dotenv/config";
import { createClient } from '@supabase/supabase-js';

// We read the Supabase URL and keys from environment variables.
// These will be defined in .env file.
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default supabase;
