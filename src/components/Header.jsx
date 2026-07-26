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
    <header className="glass-container p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 border border-white/15 shadow-2xl">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-cyan-500/30 text-slate-950">
          <Zap className="w-6 h-6 fill-current" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black tracking-tight text-white">PingPulse</h1>
            <Badge variant="default" className="bg-cyan-500/20 text-cyan-300 border-cyan-400/30">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Vercel Cron Active
            </Badge>
          </div>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Keep-Alive Engine & Uptime Telemetry Dashboard
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <Button
          variant="glass"
          size="sm"
          onClick={onOpenWallpaperModal}
          title="Change Wallpaper"
        >
          <Image className="w-4 h-4 mr-1.5 text-cyan-400" />
          <span>Wallpaper</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onPingAll}
          disabled={isPingingAll}
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isPingingAll ? 'animate-spin text-cyan-400' : 'text-slate-400'}`} />
          <span>{isPingingAll ? 'Pinging All...' : 'Ping All Now'}</span>
        </Button>

        <Button
          variant="cyan"
          size="sm"
          onClick={onOpenAddModal}
        >
          <Plus className="w-4 h-4 mr-1" />
          <span>Add Target Endpoint</span>
        </Button>
      </div>
    </header>
  );
}
