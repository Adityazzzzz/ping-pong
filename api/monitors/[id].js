import { getMonitors, saveMonitors } from '../lib/redis.js';

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    if (req.method === 'PUT') {
      const monitors = await getMonitors();
      const index = monitors.findIndex((m) => m.id === id);
      if (index === -1) return res.status(404).json({ error: 'Monitor not found' });
      monitors[index] = { ...monitors[index], ...req.body };
      await saveMonitors(monitors);
      return res.status(200).json(monitors[index]);
    }

    if (req.method === 'DELETE') {
      let monitors = await getMonitors();
      monitors = monitors.filter((m) => m.id !== id);
      await saveMonitors(monitors);
      return res.status(204).end();
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('monitors/[id] error:', err);
    return res.status(500).json({ error: err.message });
  }
}
