// ------------------------------------------------------------
// payments.routes.js
// Routes for Stripe payments.
// ------------------------------------------------------------

import { Router } from "express";
import { createCheckoutSession, stripeWebhook } from "../controllers/payments.controller.js";

const router = Router();

// Stripe checkout
router.post("/create-checkout-session", createCheckoutSession);

// Stripe webhook (must NOT use express.json)
router.post("/webhook", stripeWebhook);

export default router;
