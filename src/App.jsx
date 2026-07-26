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
import { Plus } from 'lucide-react';

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
    { id: 'all', label: 'All Targets', count: monitors.length },
    { id: 'database', label: 'Databases', count: monitors.filter((m) => m.type === 'database').length },
    { id: 'api', label: 'APIs & Services', count: monitors.filter((m) => m.type === 'api').length },
    { id: 'web', label: 'Web Apps', count: monitors.filter((m) => m.type === 'web').length },
  ];

  return (
    <div className="relative min-h-screen w-full font-sans text-slate-100 bg-[#05070d] bg-mesh-radial selection:bg-cyan-500 selection:text-black overflow-x-hidden">
      {/* Background Image with Dark Vignette */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <img
          src={wallpaper}
          alt="Backdrop Scenery"
          className="w-full h-full object-cover filter brightness-[0.4] saturate-[1.2] transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#05070d]/80 via-[#05070d]/90 to-[#05070d]" />
      </div>

      {/* Main Glass Workspace */}
      <div className="relative z-10 p-6 md:p-10 max-w-[1500px] mx-auto min-h-screen flex flex-col justify-between">
        <div>
          {/* Header */}
          <Header
            onPingAll={handlePingAllNow}
            isPingingAll={isPingingAll}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onOpenWallpaperModal={() => setIsWallpaperModalOpen(true)}
          />

          {/* Core Stats Bar */}
          <StatsBar
            totalCount={totalCount}
            activeCount={activeCount}
            avgLatency={avgLatency}
            healthScore={healthScore}
          />

          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 8 Columns */}
            <div className="lg:col-span-8 space-y-4">
              {/* Category Filter Tabs Bar */}
              <div className="flex items-center justify-between gap-3 p-1.5 rounded-xl bg-[#090d16]/80 backdrop-blur-2xl border border-white/10">
                <div className="flex items-center gap-1 overflow-x-auto">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
                        activeCategory === cat.id
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold shadow-md shadow-cyan-500/20'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span className="px-1.5 py-0.2 rounded-full bg-white/10 text-[10px] font-mono">
                        {cat.count}
                      </span>
                    </button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddModalOpen(true)}
                  className="h-8 text-xs border-dashed border-cyan-400/40 text-cyan-300 hover:bg-cyan-500/10 font-mono"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  <span>New Target</span>
                </Button>
              </div>

              {/* Endpoint Cards Grid */}
              <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence>
                  {filteredMonitors.map((monitor) => (
                    <motion.div
                      key={monitor.id}
                      layout
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.2 }}
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
            </div>

            {/* Right 4 Columns: Speedometer Ring Dial + Live Telemetry Log Feed */}
            <div className="lg:col-span-4 space-y-6">
              <CircularGauge
                healthScore={healthScore}
                activeMode={activeMode}
                onChangeMode={setActiveMode}
              />
              <ActivityLogFeed
                logs={recentLogs}
                onRefresh={handlePingAllNow}
                isRefreshing={isPingingAll}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-xs text-slate-500 font-mono py-4 border-t border-white/5">
          PingPulse ⚡ Keep-Alive Engine • Raycast/Vercel Obsidian Theme
        </footer>
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
