import React from 'react';
import { Activity, ShieldCheck, Zap } from 'lucide-react';

export default function StatsBar({ totalCount, activeCount, avgLatency, healthScore }) {
  return (
    <div className="glass-panel rounded-3xl p-6 mb-10 flex flex-col md:flex-row items-center justify-around gap-6 divide-y md:divide-y-0 md:divide-x divide-white/10 shadow-2xl border border-white/10">
      {/* Active Monitored */}
      <div className="flex items-center gap-5 w-full md:w-auto px-6 py-2 md:py-0">
        <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-emerald-400 shadow-inner">
          <Activity className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <span className="text-xs uppercase tracking-widest text-white/50 block font-sans font-semibold mb-1">
            Active Targets
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-light text-white tracking-tight font-sans">
              {activeCount}
              <span className="text-xl text-white/40 font-normal">/{totalCount}</span>
            </span>
            <span className="text-[10px] bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 px-1.5 py-0.5 rounded-md font-mono font-bold tracking-wider">ONLINE</span>
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="flex items-center gap-5 w-full md:w-auto px-6 pt-4 md:pt-0 md:pl-6">
        <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-cyan-400 shadow-inner">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs uppercase tracking-widest text-white/50 block font-sans font-semibold mb-1">
            System Uptime
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-light text-white tracking-tight font-sans">
              {healthScore}<span className="text-xl text-white/40 font-normal">%</span>
            </span>
            <span className="text-[10px] bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 px-1.5 py-0.5 rounded-md font-mono font-bold tracking-wider">24H</span>
          </div>
        </div>
      </div>

      {/* Average Latency */}
      <div className="flex items-center gap-5 w-full md:w-auto px-6 pt-4 md:pt-0 md:pl-6">
        <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-amber-400 shadow-inner">
          <Zap className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs uppercase tracking-widest text-white/50 block font-sans font-semibold mb-1">
            Avg Latency
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-light text-white tracking-tight font-sans">
              {avgLatency}<span className="text-xl text-white/40 font-normal">ms</span>
            </span>
            <span className="text-[10px] bg-amber-400/10 text-amber-400 border border-amber-400/20 px-1.5 py-0.5 rounded-md font-mono font-bold tracking-wider">LATENCY</span>
          </div>
        </div>
      </div>
    </div>
  );
}
