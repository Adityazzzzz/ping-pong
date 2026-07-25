import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'PingPulse Keep-Alive Engine',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

export default router;
