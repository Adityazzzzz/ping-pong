import React from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Activity, CheckCircle2, AlertTriangle, XCircle, RefreshCw } from 'lucide-react';
import { formatRelativeTime } from '../lib/utils';

export default function ActivityLogFeed({ logs = [], onRefresh, isRefreshing }) {
  const getLogIcon = (status) => {
    if (status >= 200 && status < 300) return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
    if (status >= 300 && status < 400) return <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
    return <XCircle className="w-3.5 h-3.5 text-rose-400" />;
  };

  return (
    <div className="obsidian-card p-5 rounded-2xl flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Live Telemetry Stream</h4>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="h-7 w-7 rounded-lg text-slate-400 hover:text-white"
          title="Refresh Telemetry"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
        </Button>
      </div>

      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
        {logs.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-6 font-mono">No ping activity recorded yet.</p>
        ) : (
          logs.slice(0, 10).map((log, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 rounded-xl bg-[#05070d]/80 border border-white/5 text-xs hover:border-white/10 transition-all font-mono"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                {getLogIcon(log.status)}
                <span className="font-semibold text-white truncate max-w-[120px] font-sans">{log.targetName || 'Target'}</span>
                <Badge
                  variant={log.status >= 200 && log.status < 300 ? 'online' : 'offline'}
                  className="px-1.5 py-0 text-[10px] font-mono"
                >
                  {log.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <span className="text-cyan-300 font-bold">{log.latency}ms</span>
                <span>{formatRelativeTime(log.timestamp)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
