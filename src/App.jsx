import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import CircularGauge from './components/CircularGauge';
import TargetCard from './components/TargetCard';
import InlineAddCard from './components/InlineAddCard';
import ProjectInspector from './components/ProjectInspector';
import { Button } from './components/ui/button';

import {
  getStoredMonitors,
  saveStoredMonitors,
} from './utils/storage';
import { Plus, LayoutGrid, Database, Server, Globe, Zap } from 'lucide-react';

export default function App() {
  const [monitors, setMonitors] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeMode, setActiveMode] = useState('eco');
  
  // Custom Toast State
  const [toast, setToast] = useState(null);

  // Workspace states
  const [editingSlotIndex, setEditingSlotIndex] = useState(null);
  const [selectedMonitorId, setSelectedMonitorId] = useState(null);

  const [pingingIds, setPingingIds] = useState([]);
  const [isPingingAll, setIsPingingAll] = useState(false);
  const [recentLogs, setRecentLogs] = useState([]);

  useEffect(() => {
    fetchMonitors();
    const timer = setInterval(fetchMonitors, 10000);
    return () => clearInterval(timer);
  }, []);

  const showToast = (message) => {
    setToast(null);
    setTimeout(() => {
      setToast(message);
    }, 50);
  };

  // Close toast automatically
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

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

    const target = updated.find((m) => m.id === id);
    showToast(target.active ? `Monitoring resumed for ${target.name}` : `Monitoring paused for ${target.name}`);

    try {
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
    const targetNode = monitors.find(m => m.id === id);
    showToast(`Contacting ${targetNode ? targetNode.name : 'node'} keep-alive endpoint...`);
    
    try {
      const res = await fetch(`/api/ping/${id}`, { method: 'POST' });
      if (res.ok) {
        const updatedTarget = await res.json();
        setMonitors((prev) => prev.map((m) => (m.id === id ? updatedTarget : m)));
        showToast(`Ping completed for ${updatedTarget.name}: ${updatedTarget.latency}ms`);
        if (selectedMonitorId === id) {
          setSelectedMonitorId(null);
          setTimeout(() => setSelectedMonitorId(id), 10);
        }
      }
    } catch {
      setTimeout(() => {
        setMonitors((prev) =>
          prev.map((m) => {
            if (m.id === id) {
              const syntheticLatency = Math.floor(Math.random() * 120) + 80;
              showToast(`Ping completed (mock) for ${m.name}: ${syntheticLatency}ms`);
              return { ...m, lastPing: new Date().toISOString(), latency: syntheticLatency };
            }
            return m;
          })
        );
      }, 800);
    } finally {
      setPingingIds((prev) => prev.filter((i) => i !== id));
    }
  };

  const handlePingAllNow = async () => {
    setIsPingingAll(true);
    showToast('Triggering keep-alive checks for all configured nodes...');
    try {
      const res = await fetch('/api/ping-all', { method: 'POST' });
      if (res.ok) {
        await fetchMonitors();
        showToast('All keep-alive node pings verified successfully');
      }
    } catch {
      await fetchMonitors();
      showToast('All keep-alive node checks complete');
    } finally {
      setTimeout(() => setIsPingingAll(false), 1000);
    }
  };

  const handleAddTargetAtIndex = async (newTarget) => {
    showToast(`Configuring keep-alive node: ${newTarget.name}...`);
    try {
      const res = await fetch('/api/monitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTarget),
      });
      if (res.ok) {
        await fetchMonitors();
        showToast(`Target configured successfully`);
      } else {
        const local = [...monitors, { ...newTarget, id: Date.now().toString(), status: 'online', active: true, logs: [] }];
        setMonitors(local);
        saveStoredMonitors(local);
        showToast(`Target configured successfully (local)`);
      }
    } catch {
      const local = [...monitors, { ...newTarget, id: Date.now().toString(), status: 'online', active: true, logs: [] }];
      setMonitors(local);
      saveStoredMonitors(local);
      showToast(`Target configured successfully (local)`);
    } finally {
      setEditingSlotIndex(null);
    }
  };

  const handleDeleteTarget = async (id) => {
    const targetNode = monitors.find(m => m.id === id);
    const updated = monitors.filter((m) => m.id !== id);
    setMonitors(updated);
    saveStoredMonitors(updated);
    showToast(`Target node "${targetNode ? targetNode.name : ''}" removed`);
    
    if (selectedMonitorId === id) {
      setSelectedMonitorId(null);
    }
    try {
      await fetch(`/api/monitors/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('API delete fallback', e);
    }
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

  const handleOpenAddInline = () => {
    if (filteredMonitors.length < 10) {
      setEditingSlotIndex(filteredMonitors.length);
    }
  };

  const selectedMonitor = monitors.find((m) => m.id === selectedMonitorId);

  return (
    <div className="relative min-h-screen w-full bg-[#b6beb6] flex items-center justify-center p-6 md:p-8 font-sans overflow-x-hidden">
      
      {/* Floating Bento layout configuration */}
      <div className="w-full max-w-[1550px] flex flex-col lg:flex-row gap-6 items-stretch">
        
        {/* SIDEBAR COLUMN (Independent Floating Bento Cards) */}
        <aside className="w-full lg:w-[320px] flex flex-col gap-6 shrink-0 justify-start">
          
          {/* Card 1: Branding Identity (High Contrast Bento) */}
          <div className="bg-zinc-950 text-white rounded-[28px] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.05)] border border-zinc-900 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 p-[1px] border border-white/20 flex items-center justify-center shadow-sm">
                <Zap className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-black font-display tracking-tight text-white flex items-center gap-1">
                  PingPulse
                  <span className="text-[9px] font-mono tracking-widest bg-white/10 text-white border border-white/20 px-1.5 py-0.5 rounded font-bold">1.0</span>
                </h1>
                <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold font-display mt-0.5">Uptime Control</p>
              </div>
            </div>
          </div>

          {/* Card 2: Sidebar classification navigation */}
          <div className="bg-white rounded-[28px] border border-black/[0.04] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.015)] space-y-3">
            <span className="text-[10px] font-extrabold font-display text-zinc-400 uppercase tracking-widest px-2 block font-bold">MONITORING CLASSIFICATION</span>
            <nav className="space-y-1.5">
              {categories.map((cat) => {
                const CatIcon = cat.icon;
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setSelectedMonitorId(null);
                    }}
                    className={`w-full px-4 py-3 rounded-2xl text-sm font-semibold transition-all flex items-center justify-between group ${
                      isActive
                        ? 'bg-zinc-100 text-zinc-950 shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-zinc-200'
                        : 'text-zinc-555 hover:text-zinc-900 hover:bg-zinc-100/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <CatIcon className={`w-4.5 h-4.5 transition-transform group-hover:scale-105 ${isActive ? 'text-zinc-950' : 'text-zinc-455'}`} />
                      <span className="font-display font-bold">{cat.label}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${isActive ? 'bg-zinc-950 text-white' : 'bg-zinc-200 text-zinc-500'}`}>
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Card 3: Embedded Gauge Dial */}
          <div className="bg-white rounded-[28px] border border-black/[0.04] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.015)]">
            <CircularGauge
              healthScore={healthScore}
              activeMode={activeMode}
              onChangeMode={setActiveMode}
            />
          </div>
        </aside>

        {/* MAIN PANEL CONTENT CANVAS */}
        <div className="flex-1 min-w-0 flex flex-col md:flex-row gap-6">
          
          <main className="flex-1 min-w-0 flex flex-col gap-6">
            {/* TOP HEADER STATUS BAR (Floating Capsule Card) */}
            <div className="bg-white rounded-[28px] border border-black/[0.04] shadow-[0_8px_30px_rgba(0,0,0,0.015)] overflow-hidden shrink-0">
              <Header
                onPingAll={handlePingAllNow}
                isPingingAll={isPingingAll}
                onOpenAddModal={handleOpenAddInline}
                totalCount={totalCount}
                activeCount={activeCount}
                avgLatency={avgLatency}
                healthScore={healthScore}
              />
            </div>

            {/* CANVAS WORKSPACE (NATIVE FLOATING TARGET CARDS) */}
            <div className="flex-1 overflow-y-auto max-h-[82vh] pr-1 custom-scrollbar">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-[11px] font-extrabold font-display uppercase tracking-wider text-zinc-900 block font-bold">Workstation Workspace Nodes (10 max)</h2>
                  <div className="h-[1px] flex-1 bg-zinc-900/10 mx-4" />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                  {/* Dynamic configured target nodes stack */}
                  {filteredMonitors.map((monitor) => (
                    <TargetCard
                      key={monitor.id}
                      monitor={monitor}
                      isSelected={selectedMonitorId === monitor.id}
                      onToggleActive={handleToggleActive}
                      onClick={() => setSelectedMonitorId(monitor.id)}
                      onShowToast={showToast}
                    />
                  ))}

                  {/* Render exactly ONE "+" placeholder card at the end of the stack */}
                  {filteredMonitors.length < 10 && (
                    editingSlotIndex !== null ? (
                      <InlineAddCard
                        key="editing-slot"
                        onAddTarget={handleAddTargetAtIndex}
                        onCancel={() => setEditingSlotIndex(null)}
                      />
                    ) : (
                      <div
                        onClick={() => setEditingSlotIndex(filteredMonitors.length)}
                        className="glass-card p-4 sm:p-5 rounded-[28px] border border-dashed border-zinc-400 hover:border-zinc-800 flex flex-col items-center justify-center gap-2.5 min-h-[160px] transition-all hover:bg-white cursor-pointer group"
                      >
                        <div className="w-9 h-9 rounded-full border border-dashed border-zinc-400 flex items-center justify-center text-zinc-500 group-hover:text-zinc-900 group-hover:border-zinc-700 transition-colors">
                          <Plus className="w-4.5 h-4.5 transition-transform group-hover:scale-105" />
                        </div>
                        <div className="text-center select-none font-display">
                          <span className="text-xs font-bold text-zinc-650 block group-hover:text-zinc-900 transition-colors">Available Keep-Alive Slot</span>
                          <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-extrabold block mt-0.5">Click to configure target</span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </main>

          {/* PROJECT DETAIL INSPECTOR PANEL (Floating Bento Block) */}
          <AnimatePresence>
            {selectedMonitor && (
              <ProjectInspector
                monitor={selectedMonitor}
                onPingNow={handlePingSingle}
                onDelete={handleDeleteTarget}
                isPinging={pingingIds.includes(selectedMonitor.id)}
                onClose={() => setSelectedMonitorId(null)}
                onShowToast={showToast}
              />
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Sleek Floating Toast Notification Banner */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 35, scale: 0.95, x: '-50%' }}
            animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
            exit={{ opacity: 0, y: 15, scale: 0.95, x: '-50%' }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-6 left-1/2 z-50 bg-zinc-950 text-white text-xs font-bold font-display px-5 py-3.5 rounded-full shadow-[0_12px_32px_rgba(0,0,0,0.15)] flex items-center gap-2 border border-zinc-800 pointer-events-none"
          >
            <Zap className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
