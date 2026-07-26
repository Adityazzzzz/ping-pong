import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import StatsBar from './components/StatsBar';
import CircularGauge from './components/CircularGauge';
import TargetCard from './components/TargetCard';
import ActivityLogFeed from './components/ActivityLogFeed';
import AddMonitorModal from './components/AddMonitorModal';
import WallpaperSelector from './components/WallpaperSelector';
import { Button } from './components/ui/button';

import {
  getStoredMonitors,
  saveStoredMonitors,
  getStoredWallpaper,
  setStoredWallpaper,
} from './utils/storage';
import { Plus, LayoutGrid, Database, Server, Globe, Zap } from 'lucide-react';

export default function App() {
  const [monitors, setMonitors] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeMode, setActiveMode] = useState('eco');
  const [wallpaper, setWallpaper] = useState(getStoredWallpaper());

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isWallpaperModalOpen, setIsWallpaperModalOpen] = useState(false);

  const [pingingIds, setPingingIds] = useState([]);
  const [isPingingAll, setIsPingingAll] = useState(false);
  const [recentLogs, setRecentLogs] = useState([]);

  useEffect(() => {
    fetchMonitors();
    const timer = setInterval(fetchMonitors, 10000);
    return () => clearInterval(timer);
  }, []);

  const fetchMonitors = async () => {
    try {
      const res = await fetch('/api/monitors');
      if (res.ok) {
        const data = await res.json();
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

  const categories = [
    { id: 'all', label: 'All Targets', count: monitors.length, icon: LayoutGrid },
    { id: 'database', label: 'Databases', count: monitors.filter((m) => m.type === 'database').length, icon: Database },
    { id: 'api', label: 'APIs & Services', count: monitors.filter((m) => m.type === 'api').length, icon: Server },
    { id: 'web', label: 'Web Apps', count: monitors.filter((m) => m.type === 'web').length, icon: Globe },
  ];

  return (
    <div className="relative min-h-screen w-full bg-[#05070d] overflow-hidden flex items-center justify-center font-sans">
      {/* Background Image with dim and blur filters */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          src={wallpaper}
          alt="Backdrop Scenery"
          className="w-full h-full object-cover filter brightness-[0.7] saturate-[1.1] transition-all duration-700"
        />
        <div className="absolute inset-0 bg-[#05070d]/50 backdrop-blur-[20px]" />
      </div>

      {/* Decorative Ambient Color Glow Spheres for depth (macOS/Linear vibe) */}
      <div className="absolute top-[20%] left-[20%] w-[35rem] h-[35rem] rounded-full ambient-glow-1 blur-[120px] pointer-events-none z-0 opacity-40 animate-pulse" />
      <div className="absolute bottom-[20%] right-[20%] w-[30rem] h-[30rem] rounded-full ambient-glow-2 blur-[100px] pointer-events-none z-0 opacity-30 animate-pulse" />

      {/* Main Glass Workspace Window */}
      <div className="relative z-10 w-full max-w-[1550px] h-[92vh] mx-4 md:mx-8 glass-panel rounded-[32px] overflow-hidden flex flex-col md:flex-row shadow-[0_35px_80px_rgba(0,0,0,0.6)] border border-white/10">
        
        {/* SIDEBAR: Category navigation and circular dial */}
        <aside className="w-full md:w-[320px] flex flex-col justify-between border-r border-white/10 p-6 bg-white/[0.01] backdrop-blur-md shrink-0">
          <div className="space-y-8">
            {/* Branding Identity */}
            <div className="flex items-center gap-3 px-2">
              <div className="w-9 h-9 rounded-xl bg-white/10 p-[1px] border border-white/20 shadow-sm flex items-center justify-center">
                <Zap className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white font-sans flex items-center gap-2">
                  PingPulse
                  <span className="text-[9px] font-mono tracking-widest bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 px-1.5 py-0.5 rounded font-bold">1.0</span>
                </h1>
                <p className="text-[10px] text-white/40 uppercase tracking-widest font-semibold mt-0.5">Uptime Control</p>
              </div>
            </div>

            {/* Sidebar Search/Selector Categories */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-2">MONITORING CLASSIFICATION</span>
              <nav className="space-y-1">
                {categories.map((cat) => {
                  const CatIcon = cat.icon;
                  const isActive = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`w-full px-4 py-3 rounded-2xl text-sm font-medium transition-all flex items-center justify-between group ${
                        isActive
                          ? 'bg-white/10 text-white shadow-sm border border-white/5'
                          : 'text-white/50 hover:text-white/80 hover:bg-white/[0.03]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <CatIcon className={`w-4.5 h-4.5 transition-transform group-hover:scale-105 ${isActive ? 'text-white' : 'text-white/40'}`} />
                        <span>{cat.label}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold ${isActive ? 'bg-white/10 text-white' : 'bg-white/5 text-white/40'}`}>
                        {cat.count}
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Embedded Speedometer Ring Gauge Dial */}
          <div className="mt-8">
            <CircularGauge
              healthScore={healthScore}
              activeMode={activeMode}
              onChangeMode={setActiveMode}
            />
          </div>
        </aside>

        {/* MAIN PANEL CONTENT CANVAS */}
        <main className="flex-1 min-w-0 flex flex-col h-full bg-black/10">
          
          {/* TOP HEADER STATUS BAR */}
          <Header
            onPingAll={handlePingAllNow}
            isPingingAll={isPingingAll}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onOpenWallpaperModal={() => setIsWallpaperModalOpen(true)}
            totalCount={totalCount}
            activeCount={activeCount}
            avgLatency={avgLatency}
            healthScore={healthScore}
          />

          {/* CANVAS WORKSPACE (SCROLLABLE GRID & FEED) */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 custom-scrollbar">
            
            {/* Targets Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-white/40">Target Nodes ({filteredMonitors.length})</h2>
                <div className="h-[1px] flex-1 bg-white/5 mx-4" />
              </div>

              {filteredMonitors.length === 0 ? (
                <div className="glass-card p-12 text-center rounded-3xl border border-white/5">
                  <p className="text-white/40 text-sm">No targets configured for this category.</p>
                  <Button
                    onClick={() => setIsAddModalOpen(true)}
                    className="glass-button mt-4 h-9 px-4 text-xs font-semibold"
                  >
                    Configure First Target
                  </Button>
                </div>
              ) : (
                <motion.div layout className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                  <AnimatePresence mode="popLayout">
                    {filteredMonitors.map((monitor) => (
                      <motion.div
                        key={monitor.id}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                      >
                        <TargetCard
                          monitor={monitor}
                          onToggleActive={handleToggleActive}
                          onPingNow={handlePingSingle}
                          onDelete={handleDeleteTarget}
                          isPinging={pingingIds.includes(monitor.id)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>

            {/* Bottom Section: Wide Telemetry stream */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-white/40">Live Logs</h2>
                <div className="h-[1px] flex-1 bg-white/5 mx-4" />
              </div>
              <ActivityLogFeed
                logs={recentLogs}
                onRefresh={handlePingAllNow}
                isRefreshing={isPingingAll}
              />
            </div>
          </div>
        </main>
      </div>

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
