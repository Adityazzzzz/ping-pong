import { getMonitors, saveMonitors } from '../lib/redis.js';

async function pingTarget(url) {
  const start = Date.now();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      redirect: 'follow',
    });
    clearTimeout(timeout);
    return {
      status: response.status,
      latency: Date.now() - start,
      timestamp: new Date().toISOString(),
    };
  } catch (err) {
    return {
      status: 0,
      latency: Date.now() - start,
      timestamp: new Date().toISOString(),
      error: err.message,
    };
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { id } = req.query;
    const monitors = await getMonitors();
    const monitor = monitors.find((m) => m.id === id);
    if (!monitor) return res.status(404).json({ error: 'Monitor not found' });

    let result;
    if (monitor.networkUrl) {
      const [mainResult, netResult] = await Promise.all([
        pingTarget(monitor.url),
        pingTarget(monitor.networkUrl),
      ]);
      result = {
        ...mainResult,
        networkLatency: netResult.latency,
      };
      monitor.networkLatency = netResult.latency;
    } else {
      result = await pingTarget(monitor.url);
      monitor.networkLatency = null;
    }

    monitor.lastPing = result.timestamp;
    monitor.latency = result.latency;
    monitor.status =
      result.status >= 200 && result.status < 400
        ? 'online'
        : result.status >= 400
          ? 'degraded'
          : 'offline';

    if (!monitor.logs) monitor.logs = [];
    monitor.logs.unshift(result);
    if (monitor.logs.length > 50) monitor.logs = monitor.logs.slice(0, 50);

    await saveMonitors(monitors);
    return res.status(200).json(monitor);
  } catch (err) {
    console.error('ping/[id] error:', err);
    return res.status(500).json({ error: err.message });
  }
}
