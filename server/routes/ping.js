import express from 'express';
import { getMonitors, saveMonitors } from '../storage.js';
import { executePing, pingAllMonitors } from '../pinger.js';

const router = express.Router();

// POST trigger ping for single monitor
router.post('/ping/:id', async (req, res) => {
  const { id } = req.params;
  const monitors = getMonitors();
  const monitor = monitors.find((m) => m.id === id);

  if (!monitor) {
    return res.status(404).json({ error: 'Monitor not found' });
  }

  const updatedMonitor = await executePing(monitor);
  const updatedList = monitors.map((m) => (m.id === id ? updatedMonitor : m));
  saveMonitors(updatedList);

  res.json(updatedMonitor);
});

// POST trigger ping for all monitors
router.post('/ping-all', async (req, res) => {
  const updatedMonitors = await pingAllMonitors();
  res.json({
    message: 'All monitors pinged successfully',
    count: updatedMonitors.length,
    monitors: updatedMonitors,
  });
});

export default router;
