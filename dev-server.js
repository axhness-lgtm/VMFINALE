import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// Load env vars from .env and .env.local
dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local' });

const app = express();
app.use(cors());
app.use(express.json());

// Dynamic import wrapper for hot-reloading API routes in dev
const wrap = (path) => async (req, res) => {
  try {
    const handler = (await import(`${path}?t=${Date.now()}`)).default;
    await handler(req, res);
  } catch (err) {
    console.error(`Error in ${path}:`, err);
    if (!res.headersSent) res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};

app.post('/api/interests', wrap('./api/interests.js'));
app.get('/api/bookings/status', wrap('./api/bookings/status.js'));
app.post('/api/bookings/lock-seats', wrap('./api/bookings/lock-seats.js'));
app.post('/api/bookings/confirm', wrap('./api/bookings/confirm.js'));
app.post('/api/bookings/finalize', wrap('./api/bookings/finalize.js'));
app.post('/api/admin/open-bookings', wrap('./api/admin/open-bookings.js'));
app.post('/api/admin/reply-query', wrap('./api/admin/reply-query.js'));
app.get('/api/occurrences', wrap('./api/occurrences.js'));
app.post('/api/occurrences', wrap('./api/occurrences.js'));
app.post('/api/admin/get-interests', wrap('./api/admin/get-interests.js'));
app.get('/api/admin/community', wrap('./api/admin/community.js'));
app.post('/api/admin/community', wrap('./api/admin/community.js'));

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 [DEV API] Mock Vercel Server running on port ${PORT}`);
  console.log(`======================================================\n`);
});
