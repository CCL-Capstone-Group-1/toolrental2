import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { processPayment } from '../controllers/payments.controllers.js';

const router = Router();

// Frontend paymentService.js will hit this route to log the receipt
router.post('/', requireAuth, processPayment);

export default router;