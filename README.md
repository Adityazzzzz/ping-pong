# PingPulse ⚡

> **VisionOS-Inspired Frosted Glass Keep-Alive & Project Uptime Monitoring Tool**

PingPulse is a modern, high-performance web tool designed to prevent free-tier web services, APIs, and databases (Render, Supabase, Koyeb, Railway, Fly.io, Vercel) from going inactive or sleeping due to inactivity.

![PingPulse UI](public/scenery_landscape.jpg)

---

## 🌟 Key Features

- 🌌 **VisionOS Frosted Glassmorphism UI**: High-end translucent glass panels (`backdrop-filter: blur(28px)`), crisp light borders, and scenery landscape backgrounds.
- ⚡ **Never-Stop Vercel Cron Architecture**: Automatic background execution every 5 minutes using Vercel Serverless Cron (`vercel.json`).
- 🎯 **Target Monitor Management**: Easily add, edit, toggle, or remove target URLs with customizable ping intervals (1m, 5m, 10m, 14m) and HTTP methods (GET, POST, HEAD).
- ⏱️ **Real-Time Latency & Response Tracking**: Interactive bar charts tracking response times (ms) and status codes (200 OK, 404, 500).
- ⭕ **Circular Speedometer Health Gauge**: Tactile circular system health widget showing overall uptime percentage and active nodes.
- ⚡ **Instant "Ping Now" Trigger**: One-click manual heartbeat trigger for immediate verification.
- 📜 **Live Activity Feed**: Real-time ticker showing recent ping events, timestamps, and HTTP response metadata.
- 🔄 **Self-Keepalive Endpoint**: Built-in `/api/health` route so PingPulse itself stays alive on free cloud hosts.

---

## 🏗️ Architecture & Scalability

```
PingPulse Application
├── Frontend: React 18 + Vite + Tailwind CSS + Lucide React + Recharts
├── Backend API: Express Server / Vercel Serverless API (`api/ping-all.js`)
├── Scheduler: Vercel Cron (`vercel.json`) / Node Cron engine
└── Storage: Dual Persistence (JSON Local Storage / Cloud DB Adapter)
```

### Scalability Roadmap
- **1 – 100 Projects**: Parallel async HTTP fetching via Vercel Serverless Functions (`Promise.allSettled`).
- **100 – 1,000 Projects**: Chunked batching queue with indexed database.
- **1,000 – 10,000+ Projects**: SaaS Multi-tenant architecture with edge workers & Upstash QStash message queue.

---

## 🚀 Quick Start

### Local Development
```bash
npm install
npm run dev
```

### Deploy to Vercel
```bash
vercel --prod
```

---

## 📄 License
MIT License © 2026 PingPulse
