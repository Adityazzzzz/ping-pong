import React from 'react';
import { Button } from './ui/button';
import { RefreshCw, Plus, Image, Activity, ShieldCheck, Zap } from 'lucide-react';

export default function Header({
  onPingAll,
  isPingingAll,
  onOpenAddModal,
  onOpenWallpaperModal,
  totalCount,
  activeCount,
  avgLatency,
  healthScore,
}) {
  return (
    <header className="px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 bg-white/[0.01] backdrop-blur-md">
      {/* Inline Dashboard Metrics summary (Super Clean) */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-white/40 font-medium">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span className="text-white/80 font-semibold">{activeCount}/{totalCount}</span>
          <span>Online Nodes</span>
        </div>
        <div className="w-1.5 h-1.5 rounded-full bg-white/10 hidden sm:block" />
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span className="text-white/80 font-semibold">{healthScore}%</span>
          <span>System Uptime</span>
        </div>
        <div className="w-1.5 h-1.5 rounded-full bg-white/10 hidden sm:block" />
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <span className="text-white/80 font-semibold">{avgLatency}ms</span>
          <span>Avg Latency</span>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2.5 ml-auto sm:ml-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenWallpaperModal}
          className="h-9 px-3.5 text-xs font-medium text-white/60 hover:text-white hover:bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-all"
        >
          <Image className="w-4 h-4 mr-1.5" />
          <span>Backdrop</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onPingAll}
          disabled={isPingingAll}
          className="h-9 px-3.5 text-xs font-mono text-white/60 hover:text-white hover:bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isPingingAll ? 'animate-spin text-white' : ''}`} />
          <span>{isPingingAll ? 'Pinging...' : 'Ping All'}</span>
        </Button>

        <Button
          onClick={onOpenAddModal}
          className="glass-button h-9 px-4 text-xs font-semibold text-white shadow-md flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Target</span>
        </Button>
      </div>
    </header>
  );
}
