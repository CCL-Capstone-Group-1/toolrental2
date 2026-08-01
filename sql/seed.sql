-- ------------------------------------------------------------
-- SEED.SQL
-- This file inserts sample data into our tables so we can
-- test the app and demonstrate relationships.
-- ------------------------------------------------------------

-- SAMPLE USERS
-- One owner and one renter to show both sides of a loan.
INSERT INTO users (email, name)
VALUES
  ('owner@example.com', 'Owner One'),
  ('renter@example.com', 'Renter One');

-- SAMPLE TOOLS
-- Two generic tools that can have listings.
INSERT INTO tools (name, category, image_url)
VALUES
  ('Cordless Drill', 'Power Tools', NULL),
  ('Circular Saw', 'Power Tools', NULL);

-- SAMPLE LISTINGS
-- Owner lists their tools for rent.
-- Assume user with id=1 is the owner.
INSERT INTO listings (tool_id, owner_id, price, available)
VALUES
  (1, 1, 10.00, TRUE),  -- Cordless Drill listing
  (2, 1, 15.00, TRUE);  -- Circular Saw listing

-- SAMPLE LOAN
-- Renter (id=2) rents the owner's drill listing (id=1).
INSERT INTO loans (listing_id, renter_id, start_date, end_date, status)
VALUES
  (1, 2, NOW(), NOW() + INTERVAL '3 days', 'active');

-- SAMPLE REVIEW
-- Renter leaves a review for the drill listing.
INSERT INTO reviews (listing_id, user_id, rating, comment)
VALUES
  (1, 2, 5, 'Great tool, worked perfectly!');

-- SAMPLE CHAT MESSAGES
-- Messages tied to the active loan (assume loan id=1).
INSERT INTO chat_messages (loan_id, sender_id, receiver_id, message)
VALUES
  (1, 2, 1, 'Hi, what time can I pick up the drill?'),
  (1, 1, 2, 'Anytime after 5 PM works for me.');
