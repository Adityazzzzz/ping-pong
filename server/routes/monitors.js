import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getMonitors, saveMonitors } from '../storage.js';

const router = express.Router();

// GET all monitors
router.get('/', (req, res) => {
  const monitors = getMonitors();
  res.json(monitors);
});

// POST add new monitor
router.post('/', (req, res) => {
  const { name, url, type, interval, method } = req.body;

  if (!name || !url) {
    return res.status(400).json({ error: 'Name and URL are required' });
  }

  const monitors = getMonitors();
  const newMonitor = {
    id: uuidv4(),
    name,
    url,
    type: type || 'web',
    interval: parseInt(interval, 10) || 5,
    method: method || 'GET',
    status: 'online',
    active: true,
    lastPing: new Date().toISOString(),
    latency: 0,
    uptimePercent: 100,
    createdAt: new Date().toISOString(),
    logs: [
      {
        timestamp: new Date().toISOString(),
        status: 200,
        latency: 0,
        message: 'Monitor added successfully',
      },
    ],
  };

  monitors.push(newMonitor);
  saveMonitors(monitors);
  res.status(201).json(newMonitor);
});

// PUT update monitor
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const monitors = getMonitors();
  const index = monitors.findIndex((m) => m.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Monitor not found' });
  }

  monitors[index] = { ...monitors[index], ...req.body };
  saveMonitors(monitors);
  res.json(monitors[index]);
});

// DELETE monitor
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const monitors = getMonitors();
  const filtered = monitors.filter((m) => m.id !== id);

  if (monitors.length === filtered.length) {
    return res.status(404).json({ error: 'Monitor not found' });
  }

  saveMonitors(filtered);
  res.json({ message: 'Monitor deleted successfully', id });
});

export default router;
