import React, { useState } from 'react';
import { Card } from './ui/card';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Database, Server, Globe, RefreshCw, Trash2, Copy, Check, ExternalLink } from 'lucide-react';
import { formatRelativeTime, getLatencyBadge } from '../lib/utils';

export default function TargetCard({ monitor, onToggleActive, onPingNow, onDelete, isPinging }) {
  const [copied, setCopied] = useState(false);

  const providerIcons = {
    database: Database,
    api: Server,
    web: Globe,
    default: Server,
  };

  const Icon = providerIcons[monitor.type] || providerIcons.default;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(monitor.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Status LED glow class
  const ledClasses = {
    online: 'led-online bg-emerald-500',
    degraded: 'led-warning bg-amber-500',
    offline: 'led-offline bg-rose-500',
  };

  // Generate mini sparkline visual (last 10 pings)
  const sparklineLogs = (monitor.logs || []).slice(0, 10).reverse();

  return (
    <Card className={`flex flex-col justify-between relative overflow-hidden transition-all duration-300 ${!monitor.active ? 'opacity-50 grayscale-[30%]' : ''}`}>
      {/* Top Header: Provider Icon + Name + Switch */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-cyan-400">
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white tracking-tight truncate max-w-[160px]" title={monitor.name}>
              {monitor.name}
            </h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`w-2 h-2 rounded-full ${ledClasses[monitor.status] || ledClasses.online}`} />
              <span className="text-[11px] font-semibold capitalize text-slate-300">{monitor.status}</span>
            </div>
          </div>
        </div>

        {/* Shadcn Switch */}
        <Switch
          checked={monitor.active}
          onCheckedChange={() => onToggleActive(monitor.id)}
          title={monitor.active ? 'Pause monitoring' : 'Resume monitoring'}
        />
      </div>

      {/* URL Endpoint Bar */}
      <div className="bg-slate-950/60 p-2 rounded-xl border border-white/5 flex items-center justify-between gap-2 my-2">
        <span className="text-xs font-mono text-slate-400 truncate flex-1" title={monitor.url}>
          {monitor.url}
        </span>
        <button
          onClick={handleCopyUrl}
          className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
          title="Copy URL"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
        </button>
      </div>

      {/* Mini Sparkline Status Bar */}
      <div className="my-2">
        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
          <span>Ping History (Last 10)</span>
          <span className="font-semibold text-cyan-300">Every {monitor.interval}m</span>
        </div>
        <div className="flex items-center gap-1 h-3">
          {sparklineLogs.length === 0 ? (
            <div className="w-full h-1.5 rounded-full bg-slate-800" />
          ) : (
            sparklineLogs.map((log, idx) => (
              <div
                key={idx}
                title={`${log.status} - ${log.latency}ms (${formatRelativeTime(log.timestamp)})`}
                className={`flex-1 h-full rounded-sm transition-all ${
                  log.status >= 200 && log.status < 300
                    ? 'bg-emerald-500/80 shadow-[0_0_6px_rgba(16,185,129,0.5)]'
                    : log.status >= 300 && log.status < 400
                    ? 'bg-amber-500/80 shadow-[0_0_6px_rgba(245,158,11,0.5)]'
                    : 'bg-rose-500/80 shadow-[0_0_6px_rgba(244,63,94,0.5)]'
                }`}
              />
            ))
          )}
        </div>
      </div>

      {/* Bottom Footer Stats & Action Buttons */}
      <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2 mt-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={getLatencyBadge(monitor.latency)}>
            {monitor.latency > 0 ? `${monitor.latency} ms` : '--'}
          </Badge>
          <span className="text-[10px] text-slate-400">{formatRelativeTime(monitor.lastPing)}</span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="cyan"
            size="sm"
            onClick={() => onPingNow(monitor.id)}
            disabled={isPinging || !monitor.active}
            className="h-7 px-3 text-[11px]"
          >
            <RefreshCw className={`w-3 h-3 mr-1 ${isPinging ? 'animate-spin' : ''}`} />
            <span>Ping</span>
          </Button>

          <Button
            variant="destructive"
            size="icon"
            onClick={() => onDelete(monitor.id)}
            title="Delete Target"
            className="h-7 w-7 rounded-lg"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
