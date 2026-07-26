import React from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Activity, RefreshCw } from 'lucide-react';
import { formatRelativeTime } from '../lib/utils';

export default function ActivityLogFeed({ logs = [], onRefresh, isRefreshing }) {
  
  const getStatusColor = (status) => {
    if (status >= 200 && status < 300) return 'bg-emerald-400 border-emerald-500/30 text-emerald-400';
    if (status >= 300 && status < 400) return 'bg-amber-400 border-amber-500/30 text-amber-400';
    return 'bg-rose-500 border-rose-600/30 text-rose-400';
  };

  return (
    <div className="glass-card p-6 sm:p-7 rounded-3xl flex flex-col justify-between h-full relative overflow-hidden">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <Activity className="w-5 h-5 text-white/80" />
          <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40">LIVE TELEMETRY STREAM</h4>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="h-9 w-9 rounded-xl text-white/40 hover:text-white hover:bg-white/10"
          title="Refresh Telemetry"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-white' : ''}`} />
        </Button>
      </div>

      {/* Timeline Stream */}
      <div className="relative space-y-4 max-h-60 overflow-y-auto pr-1 pl-3.5">
        {logs.length === 0 ? (
          <p className="text-xs text-white/30 text-center py-8 font-mono">No ping activity recorded yet.</p>
        ) : (
          <>
            {/* Timeline Vertical Axis Line */}
            <div className="absolute left-[20px] top-2 bottom-2 w-[1px] bg-white/10 pointer-events-none" />

            {logs.slice(0, 8).map((log, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between gap-4 relative group"
              >
                {/* Timeline Dot Indicator */}
                <div className="absolute left-[-18px] top-1.5 flex items-center justify-center">
                  <span className={`w-2.5 h-2.5 rounded-full border border-white/10 ${
                    log.status >= 200 && log.status < 300 
                      ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)]' 
                      : log.status >= 300 && log.status < 400 
                      ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.4)]' 
                      : 'bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]'
                  }`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white/90 text-sm truncate max-w-[140px] font-sans">
                      {log.targetName || 'Target'}
                    </span>
                    <span className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-md border ${
                      log.status >= 200 && log.status < 300
                        ? 'bg-emerald-400/5 border-emerald-400/20 text-emerald-400'
                        : log.status >= 300 && log.status < 400
                        ? 'bg-amber-400/5 border-amber-400/20 text-amber-400'
                        : 'bg-rose-500/5 border-rose-500/20 text-rose-400'
                    }`}>
                      {log.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-white/30 font-mono mt-0.5">
                    {formatRelativeTime(log.timestamp)}
                  </div>
                </div>

                {/* Metrics */}
                <div className="text-right flex flex-col justify-center">
                  <span className="text-xs font-mono font-semibold text-white/60">
                    {log.latency}ms
                  </span>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
