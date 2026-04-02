require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');

const authRoutes   = require('./routes/auth');
const recordRoutes = require('./routes/records');

const app = express();

/* ── CORS ── */
const allowedOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
app.use(cors({ origin: allowedOrigin, credentials: true }));
console.log(`CORS accepting: ${allowedOrigin}`);

app.use(express.json());

/* ── API routes ── */
app.use('/api/auth',    authRoutes);
app.use('/api/records', recordRoutes);

/* ── Health check (useful on Render) ── */
app.get('/health', (_, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅  MongoDB connected');
    app.listen(PORT, () => console.log(`🚀  Server on port ${PORT}`));
  })
  .catch((err) => { console.error('MongoDB error:', err); process.exit(1); });

