// ------------------------------------------------------------
// app.js
// Sets up Express, JSON parsing, routes, and error handling.
// ------------------------------------------------------------

import express from 'express';
import { errorHandler } from './middleware/errorHandler.js';
import toolsRoutes from './routes/tools.routes.js';

const app = express();

// Allows Express to read JSON bodies
app.use(express.json());
//Mount routes
app.use('/api/tools', toolsRoutes);
//Cetralized error handler
app.use(errorHandler);

export default app;
