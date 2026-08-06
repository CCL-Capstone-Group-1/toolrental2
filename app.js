// ------------------------------------------------------------
// app.js
// Sets up Express, JSON parsing, routes, and error handling.
// ------------------------------------------------------------

import express from 'express';
import { errorHandler } from './utils/errorHandler.js';
import toolsRoutes from './routes/tools.routes.js';
import listingsRoutes from './routes/listings.routes.js';
import loansRoutes from './routes/loans.routes.js';
import chatRoutes from './routes/chat.routes.js';
import reviewsRoutes from './routes/reviews.routes.js';
import paymentsRoutes from './routes/payments.routes.js';

const app = express();

// Allows Express to read JSON bodies
app.use(express.json());
//Mount routes
app.use('/api/tools', toolsRoutes);
app.use('/api/listings', listingsRoutes);
app.use('/api/loans', loansRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/payments', paymentsRoutes);//For Stripe Payments

//Cetralized error handler
app.use(errorHandler);
app.use("/api/payments", paymentsRoutes);

export default app;
