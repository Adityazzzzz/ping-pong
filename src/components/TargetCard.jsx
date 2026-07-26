import React, { useState } from 'react';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Database, Server, Globe, RefreshCw, Trash2, Copy, Check } from 'lucide-react';
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

  const sparklineLogs = (monitor.logs || []).slice(0, 12).reverse();

  // Status-LED class maps to index.css animations
  const getStatusClass = (status) => {
    if (status === 'degraded' || status === 'warning') return 'status-warning';
    if (status === 'offline') return 'status-offline';
    return 'status-online';
  };

  return (
    <div className={`glass-card p-6 sm:p-7 rounded-3xl flex flex-col justify-between relative overflow-hidden transition-all duration-350 group ${!monitor.active ? 'opacity-40 grayscale-[40%]' : ''}`}>
      {/* Header: Icon + Name + Switch */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-white shadow-md flex items-center justify-center">
            <Icon className="w-5 h-5 text-white/80" />
          </div>
          <div>
            <h4 className="text-base font-semibold text-white tracking-tight truncate max-w-[180px]" title={monitor.name}>
              {monitor.name}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <span className={`status-dot ${getStatusClass(monitor.status)}`} />
              <span className="text-xs font-semibold uppercase tracking-wider text-white/40 font-mono">
                {monitor.status || 'online'}
              </span>
            </div>
          </div>
        </div>

        <Switch
          checked={monitor.active}
          onCheckedChange={() => onToggleActive(monitor.id)}
          title={monitor.active ? 'Pause monitoring' : 'Resume monitoring'}
        />
      </div>

      {/* URL Endpoint Bar (macOS address bar style) */}
      <div 
        onClick={handleCopyUrl}
        className="bg-white/[0.03] hover:bg-white/[0.06] active:bg-white/[0.08] px-4 py-2.5 rounded-2xl border border-white/5 hover:border-white/10 flex items-center justify-between gap-3 my-4 transition-all duration-200 cursor-pointer"
        title="Click to copy URL"
      >
        <span className="text-xs font-mono text-white/65 truncate flex-1 group-hover:text-white/85 transition-colors" title={monitor.url}>
          {monitor.url}
        </span>
        <button
          type="button"
          className="p-1 rounded-md text-white/40 hover:text-white transition-all"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>

      {/* Latency Wave History (Audio visualizer style) */}
      <div className="my-4">
        <div className="flex items-center justify-between text-xs text-white/30 mb-2.5 font-mono">
          <span className="font-semibold tracking-wider">LATENCY HISTOGRAM</span>
          <span className="text-white/50 font-medium">EVERY {monitor.interval}M</span>
        </div>
        
        <div className="flex items-end gap-1.5 h-12 px-1">
          {sparklineLogs.length === 0 ? (
            <div className="w-full h-1 bg-white/5 rounded-full" />
          ) : (
            sparklineLogs.map((log, idx) => {
              const latency = log.latency || 50;
              // Scale height relative to 400ms max latency, minimum height of 25%
              const heightPercent = Math.min(Math.max((latency / 400) * 100, 25), 100);
              const isSuccess = log.status >= 200 && log.status < 300;
              const isWarning = log.status >= 300 && log.status < 400;

              let colorClass = 'bg-emerald-400/35 hover:bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.2)]';
              if (isWarning) colorClass = 'bg-amber-400/40 hover:bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.2)]';
              if (!isSuccess && !isWarning) colorClass = 'bg-rose-500/50 hover:bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.2)]';

              return (
                <div
                  key={idx}
                  title={`${log.status} - ${log.latency}ms (${formatRelativeTime(log.timestamp)})`}
                  style={{ height: `${heightPercent}%` }}
                  className={`flex-1 rounded-full transition-all duration-300 cursor-pointer ${colorClass}`}
                />
              );
            })
          )}
        </div>
      </div>

      {/* Actions & Metrics Row */}
      <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3 mt-2 h-12">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={`text-xs font-mono px-2.5 py-0.5 border-white/10 ${getLatencyBadge(monitor.latency)}`}>
            {monitor.latency > 0 ? `${monitor.latency} ms` : '--'}
          </Badge>
          <span className="text-xs text-white/35 font-medium">{formatRelativeTime(monitor.lastPing)}</span>
        </div>

        {/* Action buttons fade in smoothly on card hover to reduce noise */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPingNow(monitor.id)}
            disabled={isPinging || !monitor.active}
            className="h-9 px-4 text-xs font-mono font-semibold text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isPinging ? 'animate-spin' : ''}`} />
            <span>PING</span>
          </Button>

          <Button
            variant="destructive"
            size="icon"
            onClick={() => onDelete(monitor.id)}
            title="Delete Target"
            className="h-9 w-9 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-all shadow-sm flex items-center justify-center"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
