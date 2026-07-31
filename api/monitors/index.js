import { getMonitors, saveMonitors } from '../lib/redis.js';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const monitors = await getMonitors();
      return res.status(200).json(monitors);
    }

    if (req.method === 'POST') {
      const monitors = await getMonitors();
      if (monitors.length >= 10) {
        return res.status(400).json({ error: 'Maximum 10 monitors allowed' });
      }
      const newMonitor = {
        id: crypto.randomUUID(),
        name: req.body.name,
        url: req.body.url,
        networkUrl: req.body.networkUrl || null,
        type: req.body.type || 'web',
        interval: req.body.interval || 5,
        status: 'online',
        active: true,
        latency: 0,
        lastPing: null,
        logs: [],
        createdAt: new Date().toISOString(),
      };
      monitors.push(newMonitor);
      await saveMonitors(monitors);
      return res.status(201).json(newMonitor);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('monitors/index error:', err);
    return res.status(500).json({ error: err.message });
  }
}
