import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../data');
const DATA_FILE = path.join(DATA_DIR, 'monitors.json');

// Default initial monitors if data file does not exist
const DEFAULT_MONITORS = [
  {
    id: 'supabase-main-db',
    name: 'Supabase Main PostgreSQL',
    url: 'https://httpbin.org/status/200',
    type: 'database',
    interval: 5, // minutes
    method: 'GET',
    status: 'online', // online, degraded, offline
    active: true,
    lastPing: new Date().toISOString(),
    latency: 142,
    uptimePercent: 99.8,
    createdAt: new Date().toISOString(),
    logs: [
      { timestamp: new Date().toISOString(), status: 200, latency: 142, message: '200 OK - Database responsive' }
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
    lastPing: new Date().toISOString(),
    latency: 215,
    uptimePercent: 99.4,
    createdAt: new Date().toISOString(),
    logs: [
      { timestamp: new Date().toISOString(), status: 200, latency: 215, message: '200 OK - Keepalive successful' }
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
    lastPing: new Date().toISOString(),
    latency: 98,
    uptimePercent: 100,
    createdAt: new Date().toISOString(),
    logs: [
      { timestamp: new Date().toISOString(), status: 200, latency: 98, message: '200 OK - Ping received' }
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
    lastPing: new Date().toISOString(),
    latency: 175,
    uptimePercent: 99.9,
    createdAt: new Date().toISOString(),
    logs: [
      { timestamp: new Date().toISOString(), status: 200, latency: 175, message: '200 OK - Heartbeat OK' }
    ]
  }
];

export function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_MONITORS, null, 2), 'utf-8');
  }
}

export function getMonitors() {
  try {
    ensureDataDir();
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading monitors data:', error);
    return DEFAULT_MONITORS;
  }
}

export function saveMonitors(monitors) {
  try {
    ensureDataDir();
    fs.writeFileSync(DATA_FILE, JSON.stringify(monitors, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error saving monitors data:', error);
    return false;
  }
}
