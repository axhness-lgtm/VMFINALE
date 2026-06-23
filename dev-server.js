import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// Load env vars from .env and .env.local
dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local' });

const app = express();
app.use(cors());
app.use(express.json());

// Import API handlers
const interestsHandler = (await import('./api/interests.js')).default;
const statusHandler = (await import('./api/bookings/status.js')).default;
const lockHandler = (await import('./api/bookings/lock-seats.js')).default;
const confirmHandler = (await import('./api/bookings/confirm.js')).default;
const finalizeHandler = (await import('./api/bookings/finalize.js')).default;
const openHandler = (await import('./api/admin/open-bookings.js')).default;
const adminInterestsHandler = (await import('./api/admin/interests.js')).default;
const replyQueryHandler = (await import('./api/admin/reply-query.js')).default;

// Wrap Vercel handlers in Express routes
const wrap = (handler) => async (req, res) => {
  try {
    await handler(req, res);
  } catch (err) {
    console.error(err);
    if (!res.headersSent) res.status(500).json({ error: 'Internal Server Error' });
  }
};

app.post('/api/interests', wrap(interestsHandler));
app.get('/api/bookings/status', wrap(statusHandler));
app.post('/api/bookings/lock-seats', wrap(lockHandler));
app.post('/api/bookings/confirm', wrap(confirmHandler));
app.post('/api/bookings/finalize', wrap(finalizeHandler));
app.post('/api/admin/open-bookings', wrap(openHandler));
app.post('/api/admin/interests', wrap(adminInterestsHandler));
app.post('/api/admin/reply-query', wrap(replyQueryHandler));

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 [DEV API] Mock Vercel Server running on port ${PORT}`);
  console.log(`======================================================\n`);
});
