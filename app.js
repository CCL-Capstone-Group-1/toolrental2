// ------------------------------------------------------------
// app.js
// Sets up Express, JSON parsing, routes, and error handling.
// ------------------------------------------------------------

import express from 'express';
import cors from 'cors';
import { errorHandler } from './utils/errorHandler.js';
import usersRoutes from './routes/users.routes.js';
import toolsRoutes from './routes/tools.routes.js';
import listingsRoutes from './routes/listings.routes.js';
import loansRoutes from './routes/loans.routes.js';
import chatRoutes from './routes/chat.routes.js';
import reviewsRoutes from './routes/reviews.routes.js';

const app = express();

// Allow the frontend (Vite dev server, or FRONTEND_URL in production) to
// call this API from the browser.
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());

//Mount routes
app.use('/api/users', usersRoutes);
app.use('/api/tools', toolsRoutes);
app.use('/api/listings', listingsRoutes);
app.use('/api/loans', loansRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/reviews', reviewsRoutes);

//Cetralized error handler
app.use(errorHandler);

export default app;
