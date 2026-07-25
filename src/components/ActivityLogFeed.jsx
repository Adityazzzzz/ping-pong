import React from 'react';
import { Activity, CheckCircle2, AlertTriangle, XCircle, RefreshCw } from 'lucide-react';
import { formatRelativeTime } from '../utils/formatters';

export default function ActivityLogFeed({ logs = [], onRefresh, isRefreshing }) {
  const getLogIcon = (status) => {
    if (status >= 200 && status < 300) return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
    if (status >= 300 && status < 400) return <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
    return <XCircle className="w-3.5 h-3.5 text-rose-400" />;
  };

  return (
    <div className="glass-card p-5 rounded-2xl flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Live Activity Log</h4>
        </div>
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
          title="Refresh Logs"
        >
          <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
        {logs.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-4">No recent pings logged.</p>
        ) : (
          logs.slice(0, 8).map((log, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2 rounded-xl bg-slate-900/40 border border-white/5 text-xs hover:border-white/10 transition-all"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                {getLogIcon(log.status)}
                <span className="font-semibold text-white truncate max-w-[120px]">{log.targetName || 'Target'}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-400 font-mono">
                  {log.status}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <span className="font-mono text-cyan-300">{log.latency}ms</span>
                <span>{formatRelativeTime(log.timestamp)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
