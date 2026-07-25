import axios from 'axios';

// Default monitor URLs to keep alive when running on Vercel Serverless Cron
const TARGET_MONITORS = [
  { id: 'supabase-db', name: 'Supabase DB', url: 'https://httpbin.org/status/200' },
  { id: 'render-api', name: 'Render Backend', url: 'https://httpbin.org/delay/0' },
  { id: 'koyeb-app', name: 'Koyeb Dashboard', url: 'https://httpbin.org/get' },
  { id: 'vercel-microservice', name: 'Vercel Microservice', url: 'https://httpbin.org/status/200' },
];

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const startTime = Date.now();
  console.log('[Vercel Serverless Cron] Executing keep-alive pings...');

  try {
    const results = await Promise.allSettled(
      TARGET_MONITORS.map(async (target) => {
        const pingStart = Date.now();
        try {
          const response = await axios.get(target.url, {
            timeout: 8000,
            headers: { 'User-Agent': 'PingPulse-Vercel-Cron/1.0' },
          });
          return {
            id: target.id,
            name: target.name,
            url: target.url,
            status: response.status >= 200 && response.status < 400 ? 'online' : 'degraded',
            statusCode: response.status,
            latency: Date.now() - pingStart,
            timestamp: new Date().toISOString(),
          };
        } catch (err) {
          return {
            id: target.id,
            name: target.name,
            url: target.url,
            status: 'offline',
            statusCode: err.response ? err.response.status : 500,
            latency: Date.now() - pingStart,
            error: err.message,
            timestamp: new Date().toISOString(),
          };
        }
      })
    );

    const pingData = results.map((r) => r.value || r.reason);
    const duration = Date.now() - startTime;

    return res.status(200).json({
      success: true,
      message: 'Vercel Cron Keep-Alive Ping Executed',
      timestamp: new Date().toISOString(),
      durationMs: duration,
      results: pingData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}
