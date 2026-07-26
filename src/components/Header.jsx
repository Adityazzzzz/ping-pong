import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Zap, RefreshCw, Plus, Image, ShieldCheck } from 'lucide-react';

export default function Header({
  onPingAll,
  isPingingAll,
  onOpenAddModal,
  onOpenWallpaperModal,
}) {
  return (
    <header className="obsidian-panel px-6 py-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Brand Identity */}
      <div className="flex items-center gap-3.5">
        <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-emerald-500 to-indigo-600 p-[1.5px] shadow-lg shadow-cyan-500/25">
          <div className="w-full h-full bg-[#05070d] rounded-[10px] flex items-center justify-center">
            <Zap className="w-5 h-5 text-cyan-400 fill-cyan-400/20" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-extrabold tracking-tight text-white font-sans">
              PingPulse <span className="text-cyan-400 font-mono text-sm">⚡</span>
            </h1>
            <Badge variant="outline" className="text-[10px] font-mono px-2 py-0.5 border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1" />
              CRON ACTIVE 5M
            </Badge>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            24/7 Keep-Alive Engine for Free Tier Cloud Hosting & Databases
          </p>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2.5">
        <Button
          variant="glass"
          size="sm"
          onClick={onOpenWallpaperModal}
          className="text-xs font-medium border-white/10"
        >
          <Image className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
          <span>Backdrop</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onPingAll}
          disabled={isPingingAll}
          className="text-xs font-mono"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isPingingAll ? 'animate-spin text-cyan-400' : 'text-slate-400'}`} />
          <span>{isPingingAll ? 'Pinging All...' : 'Ping All'}</span>
        </Button>

        <Button
          variant="cyan"
          size="sm"
          onClick={onOpenAddModal}
          className="text-xs font-bold"
        >
          <Plus className="w-4 h-4 mr-1" />
          <span>New Target</span>
        </Button>
      </div>
    </header>
  );
}
