import React from 'react';
import { Activity, ShieldCheck, Zap } from 'lucide-react';

export default function StatsBar({ totalCount, activeCount, avgLatency, healthScore }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      {/* Active Monitored */}
      <div className="glass-card-luxury p-4 rounded-xl flex items-center justify-between">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 block mb-1">
            Active Targets
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">{activeCount}/{totalCount}</span>
            <span className="text-xs text-emerald-400 font-medium">Online</span>
          </div>
        </div>
        <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
          <Activity className="w-4 h-4" />
        </div>
      </div>

      {/* Uptime Score */}
      <div className="glass-card-luxury p-4 rounded-xl flex items-center justify-between">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 block mb-1">
            System Health Score
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">{healthScore}%</span>
            <span className="text-xs text-slate-400 font-medium">24h Uptime</span>
          </div>
        </div>
        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
        </div>
      </div>

      {/* Response Latency */}
      <div className="glass-card-luxury p-4 rounded-xl flex items-center justify-between">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 block mb-1">
            Avg Response Latency
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">{avgLatency}</span>
            <span className="text-xs text-slate-400 font-medium">ms</span>
          </div>
        </div>
        <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
          <Zap className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
