// ------------------------------------------------------------
// app.js
// Sets up Express, JSON parsing, routes, and error handling.
// ------------------------------------------------------------

import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { errorHandler } from './utils/errorHandler.js';
import toolsRoutes from './routes/tools.routes.js';
import listingsRoutes from './routes/listings.routes.js';
import loansRoutes from './routes/loans.routes.js';
import chatRoutes from './routes/chat.routes.js';
import reviewsRoutes from './routes/reviews.routes.js';
import usersRoutes from './routes/users.routes.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3001;

app.use(cors());
app.use(express.json());

// Mount routes
app.use('/api/tools', toolsRoutes);
app.use('/api/listings', listingsRoutes);
app.use('/api/loans', loansRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/users', usersRoutes);

// Centralized error handler
app.use(errorHandler);

app.get("/", (req, res) => {
  res.json({ message: "Backend is running" });
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;
