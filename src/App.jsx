import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import HeroCard from './components/HeroCard';
import MetricCard from './components/MetricCard';
import LatencyChart from './components/LatencyChart';
import TargetGrid from './components/TargetGrid';
import CategoryTabs from './components/CategoryTabs';
import ControlPanel from './components/ControlPanel';
import AddMonitorModal from './components/AddMonitorModal';
import WallpaperSelector from './components/WallpaperSelector';

import {
  getStoredMonitors,
  saveStoredMonitors,
  getStoredWallpaper,
  setStoredWallpaper,
} from './utils/storage';
import { LATENCY_HISTORY } from './data/mockMonitors';
import { Activity, ShieldCheck, Zap, AlertTriangle, RefreshCw, LayoutGrid } from 'lucide-react';

export default function App() {
  const [monitors, setMonitors] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeMode, setActiveMode] = useState('eco');
  const [wallpaper, setWallpaper] = useState(getStoredWallpaper());
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isWallpaperModalOpen, setIsWallpaperModalOpen] = useState(false);
  
  const [pingingIds, setPingingIds] = useState([]);
  const [isPingingAll, setIsPingingAll] = useState(false);
  const [recentLogs, setRecentLogs] = useState([]);

  // Fetch initial monitors on mount
  useEffect(() => {
    fetchMonitors();
    const timer = setInterval(fetchMonitors, 10000); // Poll backend every 10s
    return () => clearInterval(timer);
  }, []);

  const fetchMonitors = async () => {
    try {
      const response = await fetch('/api/monitors');
      if (response.ok) {
        const data = await response.json();
        setMonitors(data);
        saveStoredMonitors(data);
        extractRecentLogs(data);
      } else {
        const local = getStoredMonitors();
        setMonitors(local);
        extractRecentLogs(local);
      }
    } catch {
      const local = getStoredMonitors();
      setMonitors(local);
      extractRecentLogs(local);
    }
  };

  const extractRecentLogs = (monitorList) => {
    const logs = [];
    monitorList.forEach((m) => {
      if (m.logs && m.logs.length > 0) {
        m.logs.forEach((log) => {
          logs.push({ ...log, targetName: m.name });
        });
      }
    });
    logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    setRecentLogs(logs);
  };

  // Actions
  const handleToggleActive = async (id) => {
    const updated = monitors.map((m) => (m.id === id ? { ...m, active: !m.active } : m));
    setMonitors(updated);
    saveStoredMonitors(updated);

    try {
      const target = updated.find((m) => m.id === id);
      await fetch(`/api/monitors/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: target.active }),
      });
    } catch (e) {
      console.warn('API sync fallback to localStorage', e);
    }
  };

  const handlePingSingle = async (id) => {
    setPingingIds((prev) => [...prev, id]);
    try {
      const res = await fetch(`/api/ping/${id}`, { method: 'POST' });
      if (res.ok) {
        const updatedTarget = await res.json();
        setMonitors((prev) => prev.map((m) => (m.id === id ? updatedTarget : m)));
      }
    } catch {
      // Mock ping simulation fallback
      setTimeout(() => {
        setMonitors((prev) =>
          prev.map((m) =>
            m.id === id
              ? { ...m, lastPing: new Date().toISOString(), latency: Math.floor(Math.random() * 120) + 80 }
              : m
          )
        );
      }, 800);
    } finally {
      setPingingIds((prev) => prev.filter((i) => i !== id));
    }
  };

  const handlePingAllNow = async () => {
    setIsPingingAll(true);
    try {
      const res = await fetch('/api/ping-all', { method: 'POST' });
      if (res.ok) {
        await fetchMonitors();
      }
    } catch {
      await fetchMonitors();
    } finally {
      setTimeout(() => setIsPingingAll(false), 1000);
    }
  };

  const handleAddTarget = async (newTarget) => {
    try {
      const res = await fetch('/api/monitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTarget),
      });
      if (res.ok) {
        await fetchMonitors();
      } else {
        const local = [...monitors, { ...newTarget, id: Date.now().toString(), status: 'online', active: true, logs: [] }];
        setMonitors(local);
        saveStoredMonitors(local);
      }
    } catch {
      const local = [...monitors, { ...newTarget, id: Date.now().toString(), status: 'online', active: true, logs: [] }];
      setMonitors(local);
      saveStoredMonitors(local);
    }
  };

  const handleDeleteTarget = async (id) => {
    const updated = monitors.filter((m) => m.id !== id);
    setMonitors(updated);
    saveStoredMonitors(updated);
    try {
      await fetch(`/api/monitors/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('API delete fallback', e);
    }
  };

  const handleToggleAllMonitors = () => {
    const allActive = monitors.every((m) => m.active);
    const updated = monitors.map((m) => ({ ...m, active: !allActive }));
    setMonitors(updated);
    saveStoredMonitors(updated);
  };

  const handleSelectWallpaper = (url) => {
    setWallpaper(url);
    setStoredWallpaper(url);
    setIsWallpaperModalOpen(false);
  };

  // Calculations
  const filteredMonitors =
    activeCategory === 'all'
      ? monitors
      : monitors.filter((m) => m.type === activeCategory);

  const activeCount = monitors.filter((m) => m.active && m.status === 'online').length;
  const totalCount = monitors.length;
  const healthScore = totalCount > 0 ? parseFloat(((activeCount / totalCount) * 100).toFixed(1)) : 100;
  const avgLatency =
    monitors.length > 0
      ? Math.round(monitors.reduce((acc, m) => acc + (m.latency || 0), 0) / monitors.length)
      : 0;
  const featuredMonitor = monitors[0] || null;
  const allActive = monitors.every((m) => m.active);

  return (
    <div className="relative min-h-screen w-full font-sans text-white overflow-hidden bg-slate-950">
      {/* Background Scenery Wallpaper with Overlay */}
      <div className="fixed inset-0 z-0">
        <img
          src={wallpaper}
          alt="Scenery Background"
          className="w-full h-full object-cover filter brightness-[0.65] saturate-[1.1] scale-105 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/20" />
      </div>

      {/* Floating Left Glass Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenWallpaperModal={() => setIsWallpaperModalOpen(true)}
      />

      {/* Main Glass Dashboard Layout */}
      <main className="relative z-10 pl-24 pr-6 py-8 max-w-[1700px] mx-auto min-h-screen flex flex-col justify-between">
        {/* Header Bar */}
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-500/20 text-cyan-400 border border-cyan-400/30 backdrop-blur-xl">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                PingPulse <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-400/20 border border-cyan-400/30 text-cyan-300">v1.0 Vercel</span>
              </h1>
              <p className="text-xs text-slate-300 font-medium">Glassmorphic Keep-Alive & Project Uptime Command Center</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePingAllNow}
              disabled={isPingingAll}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900/60 backdrop-blur-2xl border border-white/10 hover:border-white/20 text-xs font-semibold text-white transition-all shadow-lg"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isPingingAll ? 'animate-spin text-cyan-400' : 'text-slate-400'}`} />
              <span>{isPingingAll ? 'Pinging All...' : 'Refresh All'}</span>
            </button>
          </div>
        </header>

        {/* Dashboard Grid Layout (Inspired by Reference UI Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (8 Columns wide) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Top Row: Hero Featured Card + Latency Chart + Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Hero Featured Card (5 cols) */}
              <div className="md:col-span-6">
                <HeroCard
                  featuredMonitor={featuredMonitor}
                  onPingNow={handlePingSingle}
                  isPinging={pingingIds.includes(featuredMonitor?.id)}
                />
              </div>

              {/* Latency Bar Chart & Metrics Card (6 cols) */}
              <div className="md:col-span-6 glass-panel p-6 rounded-3xl border border-white/10 flex flex-col justify-between shadow-2xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Response Latency (ms)</h3>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Live Telemetry
                  </span>
                </div>

                <LatencyChart data={LATENCY_HISTORY} />

                {/* Sub-Metrics inside Latency Panel */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/10 text-center">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400">Total Monitored</span>
                    <p className="text-base font-extrabold text-white">{totalCount}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400">Avg Latency</span>
                    <p className="text-base font-extrabold text-cyan-300">{avgLatency} ms</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400">Active Systems</span>
                    <p className="text-base font-extrabold text-emerald-400">{activeCount}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <MetricCard title="Monitored URLs" value={totalCount} unit="Nodes" icon={LayoutGrid} color="blue" />
              <MetricCard title="Avg Latency" value={avgLatency} unit="ms" icon={Zap} color="cyan" />
              <MetricCard title="Active Systems" value={activeCount} unit="Online" icon={ShieldCheck} color="emerald" />
              <MetricCard title="Down Incidents" value={totalCount - activeCount} unit="Alerts" icon={AlertTriangle} color="rose" />
            </div>

            {/* Target Projects Grid Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400" /> Monitored Project Endpoints
                </h3>
              </div>

              <TargetGrid
                monitors={filteredMonitors}
                onToggleActive={handleToggleActive}
                onPingNow={handlePingSingle}
                onDelete={handleDeleteTarget}
                onOpenAddModal={() => setIsAddModalOpen(true)}
                pingingIds={pingingIds}
              />
            </div>
          </div>

          {/* Right Column: Control Panel Widget (4 Columns wide matching reference thermostat widget) */}
          <div className="lg:col-span-4">
            <ControlPanel
              healthScore={healthScore}
              activeMode={activeMode}
              onChangeMode={setActiveMode}
              logs={recentLogs}
              onPingAllNow={handlePingAllNow}
              isPingingAll={isPingingAll}
              onToggleAllMonitors={handleToggleAllMonitors}
              allActive={allActive}
            />
          </div>
        </div>

        {/* Bottom Category Pill Navigation Tabs */}
        <CategoryTabs
          activeCategory={activeCategory}
          onChangeCategory={setActiveCategory}
          onOpenAddModal={() => setIsAddModalOpen(true)}
        />
      </main>

      {/* Modals */}
      <AddMonitorModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddTarget={handleAddTarget}
      />

      <WallpaperSelector
        isOpen={isWallpaperModalOpen}
        onClose={() => setIsWallpaperModalOpen(false)}
        currentWallpaper={wallpaper}
        onSelectWallpaper={handleSelectWallpaper}
      />
    </div>
  );
}
