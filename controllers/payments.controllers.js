import prisma from '../src/prisma.js';
import { sendError } from '../utils/response.js';

// POST /api/payments
export async function processPayment(req, res) {
  try {
    const { loanId, amount, status } = req.body;

    // Save the receipt to the database
    const newPayment = await prisma.payment.create({
      data: {
        loanId: Number(loanId),
        amount: Number(amount),
        status: status || 'completed' // Default to completed for CashApp/Venmo
      }
    });

    return res.status(201).json({ 
      success: true, 
      message: "Payment receipt recorded successfully",
      payment: newPayment 
    });
  } catch (err) {
    console.error('Error recording payment:', err);
    return sendError(res, 500, 'Failed to record payment');
  }
}