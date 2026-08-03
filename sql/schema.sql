-- ------------------------------------------------------------
-- SCHEMA.SQL
-- This file creates all of our PostgreSQL tables.
-- It mirrors the Prisma models in schema.prisma so we
-- can see the raw SQL structure behind our ORM.
-- ------------------------------------------------------------

-- USERS TABLE
-- Represents every member of the tool lending library.
CREATE TABLE users (
  id          SERIAL PRIMARY KEY,
  email       VARCHAR(255) UNIQUE NOT NULL,
  name        VARCHAR(255),

  created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- TOOLS TABLE
-- Represents generic tool types (e.g., "Cordless Drill").
CREATE TABLE tools (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  category    VARCHAR(255) NOT NULL,
  image_url   TEXT,

  created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- LISTINGS TABLE
-- Represents a specific owner's instance of a tool.
-- Example: John's drill for $10/day.
CREATE TABLE listings (
  id          SERIAL PRIMARY KEY,
  tool_id     INTEGER NOT NULL,
  owner_id    INTEGER NOT NULL,
  price       NUMERIC(10,2) NOT NULL,
  available   BOOLEAN NOT NULL DEFAULT TRUE,

  created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMP NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_listings_tool
    FOREIGN KEY (tool_id)
    REFERENCES tools (id)
    ON DELETE CASCADE,

  CONSTRAINT fk_listings_owner
    FOREIGN KEY (owner_id)
    REFERENCES users (id)
    ON DELETE CASCADE
);

-- LOANS TABLE
-- Represents an active or completed rental.
-- Ties together listing + renter + rental dates.
CREATE TABLE loans (
  id          SERIAL PRIMARY KEY,
  listing_id  INTEGER NOT NULL,
  renter_id   INTEGER NOT NULL,
  start_date  TIMESTAMP NOT NULL,
  end_date    TIMESTAMP NOT NULL,
  status      VARCHAR(50) NOT NULL, -- "active", "returned", "late"

  created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMP NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_loans_listing
    FOREIGN KEY (listing_id)
    REFERENCES listings (id)
    ON DELETE CASCADE,

  CONSTRAINT fk_loans_renter
    FOREIGN KEY (renter_id)
    REFERENCES users (id)
    ON DELETE CASCADE
);

-- REVIEWS TABLE
-- Feedback left by renters about a listing.
CREATE TABLE reviews (
  id          SERIAL PRIMARY KEY,
  listing_id  INTEGER NOT NULL,
  user_id     INTEGER NOT NULL,
  rating      INTEGER NOT NULL,   -- 1–5 stars
  comment     TEXT,

  created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMP NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_reviews_listing
    FOREIGN KEY (listing_id)
    REFERENCES listings (id)
    ON DELETE CASCADE,

  CONSTRAINT fk_reviews_user
    FOREIGN KEY (user_id)
    REFERENCES users (id)
    ON DELETE CASCADE
);

-- CHAT MESSAGES TABLE
-- Messages exchanged between owner and renter.
-- IMPORTANT: Messages are tied to a specific loan.
CREATE TABLE chat_messages (
  id          SERIAL PRIMARY KEY,
  loan_id     INTEGER NOT NULL,
  sender_id   INTEGER NOT NULL,
  receiver_id INTEGER NOT NULL,
  message     TEXT NOT NULL,

  created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMP NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_chat_loan
    FOREIGN KEY (loan_id)
    REFERENCES loans (id)
    ON DELETE CASCADE,

  CONSTRAINT fk_chat_sender
    FOREIGN KEY (sender_id)
    REFERENCES users (id)
    ON DELETE CASCADE,

  CONSTRAINT fk_chat_receiver
    FOREIGN KEY (receiver_id)
    REFERENCES users (id)
    ON DELETE CASCADE
);
