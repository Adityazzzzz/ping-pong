import React from 'react';
import { Button } from './ui/button';
import { RefreshCw, Plus, Activity, ShieldCheck, Zap } from 'lucide-react';

export default function Header({
  onPingAll,
  isPingingAll,
  onOpenAddModal,
  totalCount,
  activeCount,
  avgLatency,
  healthScore,
}) {
  return (
    <header className="px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-200 bg-white/50 backdrop-blur-md">
      {/* Inline Dashboard Metrics summary (Super Clean, Display Typography) */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-zinc-500 font-medium">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-600 animate-pulse" />
          <span className="text-zinc-950 font-extrabold font-display text-sm">{activeCount}</span>
          <span className="text-[10px] text-zinc-400">/ {totalCount} Online Nodes</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-zinc-300 hidden sm:block" />
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-600" />
          <span className="text-zinc-950 font-extrabold font-display text-sm">{healthScore}%</span>
          <span className="text-[10px] text-zinc-400">System Uptime</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-zinc-300 hidden sm:block" />
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-600" />
          <span className="text-zinc-950 font-extrabold font-display text-sm">{avgLatency}ms</span>
          <span className="text-[10px] text-zinc-400">Avg Speed</span>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2.5 ml-auto sm:ml-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={onPingAll}
          disabled={isPingingAll}
          className="h-9 px-3.5 text-xs font-mono font-bold text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 rounded-xl border border-zinc-200 shadow-sm transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isPingingAll ? 'animate-spin text-zinc-950' : ''}`} />
          <span>{isPingingAll ? 'Pinging...' : 'Ping All'}</span>
        </Button>

        <Button
          onClick={onOpenAddModal}
          className="glass-button h-9 px-4.5 text-xs font-bold text-white shadow-sm flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Target</span>
        </Button>
      </div>
    </header>
  );
}
