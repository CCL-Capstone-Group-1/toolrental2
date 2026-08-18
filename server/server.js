// ------------------------------------------------------------
// server.js
// Entry point: loads environment variables and starts the
// Express app defined in app.js.
// ------------------------------------------------------------

import 'dotenv/config';
import app from '../app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
