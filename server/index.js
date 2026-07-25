import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import monitorsRouter from './routes/monitors.js';
import pingRouter from './routes/ping.js';
import healthRouter from './routes/health.js';
import { initScheduler } from './pinger.js';
import { ensureDataDir } from './storage.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Data Storage & Scheduler
ensureDataDir();
initScheduler();

// API Routes
app.use('/api/monitors', monitorsRouter);
app.use('/api', pingRouter);
app.use('/api/health', healthRouter);

// Serve static frontend files in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`[PingPulse Server] Running on http://localhost:${PORT}`);
});
