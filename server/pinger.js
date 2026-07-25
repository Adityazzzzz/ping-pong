import axios from 'axios';
import cron from 'node-cron';
import { getMonitors, saveMonitors } from './storage.js';

/**
 * Execute HTTP Ping against a target monitor
 */
export async function executePing(monitor) {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();
  let status = 'offline';
  let httpStatusCode = 0;
  let latency = 0;
  let message = '';

  try {
    const response = await axios({
      method: monitor.method || 'GET',
      url: monitor.url,
      timeout: 10000,
      headers: {
        'User-Agent': 'PingPulse-KeepAlive-Bot/1.0',
        'Cache-Control': 'no-cache',
      },
    });

    latency = Date.now() - startTime;
    httpStatusCode = response.status;
    status = response.status >= 200 && response.status < 400 ? 'online' : 'degraded';
    message = `${response.status} ${response.statusText || 'OK'} - Response in ${latency}ms`;
  } catch (error) {
    latency = Date.now() - startTime;
    httpStatusCode = error.response ? error.response.status : 500;
    status = 'offline';
    message = error.response
      ? `HTTP ${error.response.status} - ${error.response.statusText}`
      : `Network Error: ${error.message}`;
  }

  // Update monitor object state
  const updatedLogs = [
    { timestamp, status: httpStatusCode, latency, message },
    ...(monitor.logs || []).slice(0, 49), // Keep last 50 logs
  ];

  // Calculate new overall uptime percentage
  const totalPings = updatedLogs.length;
  const successfulPings = updatedLogs.filter((l) => l.status >= 200 && l.status < 400).length;
  const uptimePercent = totalPings > 0 ? parseFloat(((successfulPings / totalPings) * 100).toFixed(1)) : 100;

  return {
    ...monitor,
    status,
    lastPing: timestamp,
    latency,
    uptimePercent,
    logs: updatedLogs,
  };
}

/**
 * Ping all active monitors concurrently
 */
export async function pingAllMonitors() {
  const monitors = getMonitors();
  const activeMonitors = monitors.filter((m) => m.active);

  const results = await Promise.allSettled(
    activeMonitors.map((monitor) => executePing(monitor))
  );

  const updatedMonitors = monitors.map((monitor) => {
    const match = results.find(
      (res) => res.status === 'fulfilled' && res.value.id === monitor.id
    );
    return match ? match.value : monitor;
  });

  saveMonitors(updatedMonitors);
  return updatedMonitors;
}

/**
 * Initialize Node Cron scheduler for local background server execution
 */
export function initScheduler() {
  // Run every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    console.log(`[PingPulse Scheduler] Executing automated pings at ${new Date().toISOString()}...`);
    await pingAllMonitors();
  });
  console.log('[PingPulse Scheduler] Background cron initialized (Running every 5m)');
}
