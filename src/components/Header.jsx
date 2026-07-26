import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Zap, RefreshCw, Plus, Image } from 'lucide-react';

export default function Header({
  onPingAll,
  isPingingAll,
  onOpenAddModal,
  onOpenWallpaperModal,
}) {
  return (
    <header className="glass-panel-luxury px-6 py-4 mb-8 flex items-center justify-between gap-4">
      {/* Brand Identity */}
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 p-[1px] shadow-lg shadow-cyan-500/20">
          <div className="w-full h-full bg-slate-950/90 rounded-[11px] flex items-center justify-center">
            <Zap className="w-5 h-5 text-cyan-400 fill-current" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-lg font-bold tracking-tight text-white font-sans">PingPulse</h1>
            <Badge variant="outline" className="text-[10px] px-2 py-0.5 border-cyan-500/30 text-cyan-300 bg-cyan-500/10">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              24/7 Vercel Cron
            </Badge>
          </div>
          <p className="text-xs text-slate-400 font-medium">Keep-Alive Engine for Free Tier Databases & Services</p>
        </div>
      </div>

      {/* Quick Action Controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenWallpaperModal}
          className="bg-slate-900/40 border-white/10 hover:border-white/20 text-xs text-slate-300"
        >
          <Image className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
          <span>Backdrop</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onPingAll}
          disabled={isPingingAll}
          className="bg-slate-900/40 border-white/10 hover:border-white/20 text-xs text-slate-300"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isPingingAll ? 'animate-spin text-cyan-400' : 'text-slate-400'}`} />
          <span>{isPingingAll ? 'Pinging All...' : 'Ping All'}</span>
        </Button>

        <Button
          variant="cyan"
          size="sm"
          onClick={onOpenAddModal}
          className="text-xs font-semibold"
        >
          <Plus className="w-4 h-4 mr-1" />
          <span>New Target</span>
        </Button>
      </div>
    </header>
  );
}
