import React, { useState, useEffect } from 'react';
import CircularHealthGauge from './CircularHealthGauge';
import ActivityLogFeed from './ActivityLogFeed';
import { formatClockTime } from '../utils/formatters';
import { Play, Pause, RefreshCw } from 'lucide-react';

export default function ControlPanel({
  healthScore,
  activeMode,
  onChangeMode,
  logs,
  onPingAllNow,
  isPingingAll,
  onToggleAllMonitors,
  allActive,
}) {
  const [currentTime, setCurrentTime] = useState(formatClockTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(formatClockTime());
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between h-full border border-white/10 shadow-2xl space-y-6">
      {/* Top Header & Clock Display */}
      <div className="flex flex-col items-center justify-center text-center pt-2">
        <span className="text-3xl font-black tracking-tight text-white font-mono">{currentTime}</span>
        <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full my-2" />
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
          System Control Center
        </span>
      </div>

      {/* Circular Health Gauge (Thermostat Style) */}
      <CircularHealthGauge
        healthScore={healthScore}
        activeMode={activeMode}
        onChangeMode={onChangeMode}
      />

      {/* Master Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onPingAllNow}
          disabled={isPingingAll}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isPingingAll ? 'animate-spin' : ''}`} />
          <span>{isPingingAll ? 'Pinging All...' : 'Ping All Now'}</span>
        </button>

        <button
          onClick={onToggleAllMonitors}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-bold text-xs border transition-all hover:scale-[1.02] active:scale-95 ${
            allActive
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
          }`}
        >
          {allActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{allActive ? 'Pause All' : 'Resume All'}</span>
        </button>
      </div>

      {/* Live Activity Feed */}
      <ActivityLogFeed logs={logs} onRefresh={onPingAllNow} isRefreshing={isPingingAll} />
    </div>
  );
}
