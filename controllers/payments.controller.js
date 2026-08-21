// ------------------------------------------------------------
// payments.controller.js
// Handles Stripe checkout sessions and webhook events.
// ------------------------------------------------------------

import stripe from "../server/stripe.js";
import prisma from "../prisma/client.js";

// POST /api/payments/create-checkout-session
export async function createCheckoutSession(req, res, next) {
  try {
    const { loanId, amount } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Tool Rental Loan #${loanId}`,
            },
            unit_amount: amount * 100, // convert dollars → cents
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/payment-success`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
      metadata: { loanId },
    });

    return res.json({ url: session.url });
  } catch (err) {
    next(err);
  }
}

// POST /api/payments/webhook
export async function stripeWebhook(req, res, next) {
  try {
    const sig = req.headers["stripe-signature"];

    const event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const loanId = Number(session.metadata.loanId);

      await prisma.loans.update({
        where: { id: loanId },
        data: { status: "paid" },
      });
    }

    res.json({ received: true });
  } catch (err) {
    next(err);
  }
}
