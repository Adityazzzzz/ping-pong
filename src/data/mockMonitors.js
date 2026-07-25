export const MOCK_MONITORS = [
  {
    id: 'supabase-main-db',
    name: 'Supabase Main PostgreSQL',
    url: 'https://httpbin.org/status/200',
    type: 'database',
    interval: 5,
    method: 'GET',
    status: 'online',
    active: true,
    lastPing: new Date(Date.now() - 2 * 60000).toISOString(),
    latency: 142,
    uptimePercent: 99.8,
    createdAt: new Date().toISOString(),
    logs: [
      { timestamp: new Date(Date.now() - 2 * 60000).toISOString(), status: 200, latency: 142, message: '200 OK - Database responsive' },
      { timestamp: new Date(Date.now() - 7 * 60000).toISOString(), status: 200, latency: 138, message: '200 OK - Heartbeat received' },
      { timestamp: new Date(Date.now() - 12 * 60000).toISOString(), status: 200, latency: 145, message: '200 OK - Heartbeat received' },
    ]
  },
  {
    id: 'render-backend-api',
    name: 'Render Node.js Backend API',
    url: 'https://httpbin.org/delay/0',
    type: 'api',
    interval: 5,
    method: 'GET',
    status: 'online',
    active: true,
    lastPing: new Date(Date.now() - 3 * 60000).toISOString(),
    latency: 215,
    uptimePercent: 99.4,
    createdAt: new Date().toISOString(),
    logs: [
      { timestamp: new Date(Date.now() - 3 * 60000).toISOString(), status: 200, latency: 215, message: '200 OK - Keepalive successful' },
      { timestamp: new Date(Date.now() - 8 * 60000).toISOString(), status: 200, latency: 220, message: '200 OK - Heartbeat OK' },
    ]
  },
  {
    id: 'koyeb-frontend-app',
    name: 'Koyeb React Dashboard App',
    url: 'https://httpbin.org/get',
    type: 'web',
    interval: 10,
    method: 'GET',
    status: 'online',
    active: true,
    lastPing: new Date(Date.now() - 5 * 60000).toISOString(),
    latency: 98,
    uptimePercent: 100,
    createdAt: new Date().toISOString(),
    logs: [
      { timestamp: new Date(Date.now() - 5 * 60000).toISOString(), status: 200, latency: 98, message: '200 OK - Ping received' }
    ]
  },
  {
    id: 'vercel-microservice',
    name: 'Vercel Auth Microservice',
    url: 'https://httpbin.org/status/200',
    type: 'api',
    interval: 5,
    method: 'GET',
    status: 'online',
    active: true,
    lastPing: new Date(Date.now() - 1 * 60000).toISOString(),
    latency: 175,
    uptimePercent: 99.9,
    createdAt: new Date().toISOString(),
    logs: [
      { timestamp: new Date(Date.now() - 1 * 60000).toISOString(), status: 200, latency: 175, message: '200 OK - Heartbeat OK' }
    ]
  }
];

export const LATENCY_HISTORY = [
  { time: '00:00', supabase: 140, render: 210, koyeb: 95, vercel: 160 },
  { time: '04:00', supabase: 145, render: 230, koyeb: 92, vercel: 170 },
  { time: '08:00', supabase: 138, render: 205, koyeb: 99, vercel: 165 },
  { time: '12:00', supabase: 150, render: 225, koyeb: 102, vercel: 180 },
  { time: '16:00', supabase: 142, render: 215, koyeb: 98, vercel: 175 },
  { time: '20:00', supabase: 139, render: 218, koyeb: 94, vercel: 168 },
];
