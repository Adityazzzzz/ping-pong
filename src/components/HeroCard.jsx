import React from 'react';
import { Database, Zap, Clock, RefreshCw } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { formatRelativeTime } from '../utils/formatters';

export default function HeroCard({ featuredMonitor, onPingNow, isPinging }) {
  if (!featuredMonitor) return null;

  return (
    <div className="glass-card p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between border border-white/10 shadow-2xl">
      {/* Glow effect */}
      <div className="absolute -top-16 -left-16 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-blue-500/20 border border-blue-400/30 text-cyan-400">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs uppercase font-medium text-slate-400 tracking-wider">Featured Target</span>
            <h3 className="text-xl font-extrabold text-white tracking-tight">{featuredMonitor.name}</h3>
          </div>
        </div>
        <StatusBadge status={featuredMonitor.status} />
      </div>

      {/* Metrics Row */}
      <div className="my-6 grid grid-cols-2 gap-4 z-10">
        <div className="bg-slate-900/40 backdrop-blur-md p-4 rounded-2xl border border-white/5 flex flex-col">
          <span className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
            <Clock className="w-3.5 h-3.5 text-cyan-400" /> Ping Schedule
          </span>
          <span className="text-2xl font-black text-white">Every {featuredMonitor.interval}m</span>
          <span className="text-xs text-slate-400 mt-1">
            Last ping: {formatRelativeTime(featuredMonitor.lastPing)}
          </span>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-md p-4 rounded-2xl border border-white/5 flex flex-col">
          <span className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
            <Zap className="w-3.5 h-3.5 text-blue-400" /> Response Latency
          </span>
          <span className="text-2xl font-black text-white">{featuredMonitor.latency} ms</span>
          <span className="text-xs text-emerald-400 mt-1 font-semibold">
            {featuredMonitor.uptimePercent}% Uptime
          </span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10 z-10">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>Active 24/7 Keep-Alive Engine</span>
        </div>

        <button
          onClick={() => onPingNow(featuredMonitor.id)}
          disabled={isPinging}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-xs shadow-lg shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`} />
          <span>{isPinging ? 'Pinging...' : 'Ping Now'}</span>
        </button>
      </div>
    </div>
  );
}
