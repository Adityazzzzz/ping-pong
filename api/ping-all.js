import { getMonitors, saveMonitors } from './lib/redis.js';

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
  try {
    const monitors = await getMonitors();
    const activeMonitors = monitors.filter((m) => m.active);

    const results = await Promise.allSettled(
      activeMonitors.map(async (monitor) => {
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
        return { name: monitor.name, status: result.status, latency: result.latency };
      })
    );

    await saveMonitors(monitors);

    return res.status(200).json({
      pinged: activeMonitors.length,
      total: monitors.length,
      timestamp: new Date().toISOString(),
      results: results.map((r) =>
        r.status === 'fulfilled' ? r.value : { error: r.reason?.message }
      ),
    });
  } catch (err) {
    console.error('ping-all error:', err);
    return res.status(500).json({ error: err.message });
  }
}
