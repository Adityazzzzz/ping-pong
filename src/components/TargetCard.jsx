import React, { useState, useEffect } from 'react';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Database, Server, Globe, Copy, Check, Info } from 'lucide-react';
import { formatRelativeTime, getLatencyBadge } from '../lib/utils';

export default function TargetCard({ monitor, onToggleActive, onClick, isSelected, onShowToast }) {
  const [copied, setCopied] = useState(false);
  const [hoveredTick, setHoveredTick] = useState(null);
  const [localLatency, setLocalLatency] = useState(null);

  const providerIcons = {
    database: Database,
    api: Server,
    web: Globe,
    default: Server,
  };

  const Icon = providerIcons[monitor.type] || providerIcons.default;

  // Run client-side local latency measurement to compare global vs local speed
  useEffect(() => {
    if (!monitor.active || !monitor.url) return;

    let isMounted = true;
    const testLocalPing = async () => {
      const start = Date.now();
      try {
        await fetch(monitor.url, { 
          method: 'GET',
          mode: 'no-cors',
          credentials: 'omit',
          cache: 'no-store'
        });
        if (isMounted) setLocalLatency(Date.now() - start);
      } catch (err) {
        if (isMounted) setLocalLatency(Date.now() - start);
      }
    };

    const timer = setTimeout(testLocalPing, 1200);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [monitor.url, monitor.active]);

  const handleCopyUrl = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(monitor.url);
    setCopied(true);
    if (onShowToast) onShowToast('Endpoint URL copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const sparklineLogs = (monitor.logs || []).slice(0, 12).reverse();
  const totalTicks = 12;
  const placeholderCount = Math.max(0, totalTicks - sparklineLogs.length);
  const histogramTicks = [
    ...Array(placeholderCount).fill({ isPlaceholder: true }),
    ...sparklineLogs.map(log => ({ ...log, isPlaceholder: false }))
  ];

  const getStatusBadgeClass = (status) => {
    if (status === 'degraded' || status === 'warning') {
      return 'bg-amber-50 text-amber-700 border-amber-200/50';
    }
    if (status === 'offline') {
      return 'bg-rose-50 text-rose-700 border-rose-200/50';
    }
    return 'bg-emerald-50 text-emerald-700 border-emerald-200/50';
  };

  const displayedLatency = hoveredTick ? hoveredTick.latency : monitor.latency;
  const displayedTime = hoveredTick ? hoveredTick.timestamp : monitor.lastPing;
  const isViewingHistory = hoveredTick !== null;

  return (
    <div 
      onClick={onClick}
      className={`glass-card p-5 rounded-[28px] flex flex-col justify-between relative overflow-hidden transition-all duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] cursor-pointer group ${
        isSelected 
          ? 'bg-white border-zinc-950 shadow-[0_12px_30px_rgba(0,0,0,0.04)] ring-2 ring-zinc-950/5 transform -translate-y-1' 
          : 'hover:shadow-[0_20px_40px_rgba(0,0,0,0.035)] hover:-translate-y-1'
      } ${!monitor.active ? 'opacity-40 grayscale-[40%]' : ''}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-zinc-50 border border-zinc-200 text-zinc-950 shadow-sm flex items-center justify-center font-display">
            <Icon className="w-4.5 h-4.5 text-zinc-800" />
          </div>
          <div>
            <h4 className="text-base font-bold font-display text-zinc-950 tracking-tight truncate max-w-[180px]" title={monitor.name}>
              {monitor.name}
            </h4>
            <div className="flex items-center gap-1.5 mt-0.5 font-display">
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${getStatusBadgeClass(monitor.status)}`}>
                {monitor.status || 'online'}
              </span>
            </div>
          </div>
        </div>

        <div onClick={(e) => e.stopPropagation()}>
          <Switch
            checked={monitor.active}
            onCheckedChange={() => onToggleActive(monitor.id)}
            title={monitor.active ? 'Pause monitoring' : 'Resume monitoring'}
          />
        </div>
      </div>

      {/* URL Endpoint Bar */}
      <div 
        onClick={handleCopyUrl}
        className="bg-zinc-50 hover:bg-zinc-100/80 px-3.5 py-2.5 rounded-xl border border-zinc-200 flex items-center justify-between gap-2.5 my-2.5 transition-all duration-200 cursor-pointer"
        title="Click to copy URL"
      >
        <span className="text-xs font-mono text-zinc-500 truncate flex-1 group-hover:text-zinc-900 transition-colors" title={monitor.url}>
          {monitor.url}
        </span>
        <button
          type="button"
          className="p-1 rounded-md text-zinc-400 hover:text-zinc-900 transition-all"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Latency Wave History */}
      <div className="my-2">
        <div className="flex items-center justify-between text-[10px] text-zinc-400 mb-2 font-mono">
          <span className="font-bold tracking-wider">LATENCY HISTOGRAM</span>
          <span className="text-zinc-500 font-medium">EVERY {monitor.interval}M</span>
        </div>
        
        <div className="flex items-end justify-between gap-1 h-8 px-1">
          {histogramTicks.map((tick, idx) => {
            if (tick.isPlaceholder) {
              return (
                <div
                  key={`placeholder-${idx}`}
                  className="w-[6px] h-2 bg-zinc-200/50 rounded-full"
                />
              );
            }

            const latency = tick.latency || 50;
            const heightPercent = Math.min(Math.max((latency / 400) * 100, 25), 100);
            const isSuccess = tick.status >= 200 && tick.status < 400;

            let colorClass = 'bg-emerald-500/85 hover:bg-emerald-500';
            if (tick.status >= 400) colorClass = 'bg-amber-500/90 hover:bg-amber-500';
            if (tick.status === 0) colorClass = 'bg-rose-500/90 hover:bg-rose-500';

            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredTick(tick)}
                onMouseLeave={() => setHoveredTick(null)}
                title={`${tick.status || 'Error'} - ${tick.latency}ms (${formatRelativeTime(tick.timestamp)})`}
                style={{ height: `${heightPercent}%` }}
                className={`w-[6px] rounded-full transition-all duration-300 cursor-pointer ${colorClass} ${
                  hoveredTick && hoveredTick.timestamp === tick.timestamp ? 'scale-y-[1.1] ring-1 ring-zinc-950/20' : ''
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Metrics Row (Updates dynamically on hover) */}
      <div className="pt-3 border-t border-zinc-200/60 flex flex-col gap-2 mt-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Badge variant="outline" className={`text-xs font-mono px-2 py-0.5 border-zinc-200 text-zinc-650 bg-zinc-50 transition-all ${
              isViewingHistory ? 'bg-zinc-950 text-white border-zinc-950 shadow-sm' : getLatencyBadge(displayedLatency)
            }`}>
              {displayedLatency > 0 ? `${displayedLatency} ms` : '--'}
            </Badge>
            <span className={`text-[10px] transition-all font-display font-bold uppercase tracking-wider ${isViewingHistory ? 'text-zinc-950 font-bold' : 'text-zinc-400'}`}>
              {isViewingHistory ? `History: ${formatRelativeTime(displayedTime)}` : `Server (Vercel)`}
            </span>
          </div>

          {!isViewingHistory && localLatency !== null && (
            <div className="flex items-center gap-1.5 text-[10px] font-display font-bold uppercase tracking-wider text-zinc-400">
              <span className="font-mono text-zinc-700 bg-zinc-150/80 border border-zinc-200 rounded px-1.5 py-0.5 text-xs normal-case">
                {localLatency} ms
              </span>
              <span>Local (You)</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-[10px] text-zinc-400 font-bold uppercase tracking-wider font-display">
          <span className="font-medium">
            {!isViewingHistory && monitor.lastPing ? `Checked ${formatRelativeTime(monitor.lastPing)}` : ''}
          </span>
          <span className="flex items-center gap-1 group-hover:text-zinc-700 transition-colors">
            <Info className="w-3.5 h-3.5" /> Details
          </span>
        </div>
      </div>

    </div>
  );
}
