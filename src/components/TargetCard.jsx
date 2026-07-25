import React from 'react';
import { Database, Globe, Server, Code, RefreshCw, Trash2 } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { formatRelativeTime } from '../utils/formatters';

export default function TargetCard({ monitor, onToggleActive, onPingNow, onDelete, isPinging }) {
  const icons = {
    database: Database,
    api: Server,
    web: Globe,
    default: Code,
  };

  const Icon = icons[monitor.type] || icons.default;

  return (
    <div
      className={`glass-card p-5 rounded-2xl flex flex-col justify-between relative overflow-hidden transition-all duration-300 ${
        !monitor.active ? 'opacity-60 grayscale-[40%]' : ''
      }`}
    >
      {/* Top Bar: Icon + Toggle */}
      <div className="flex items-center justify-between mb-3">
        <div className="p-2.5 rounded-xl bg-slate-800/80 border border-white/10 text-cyan-400">
          <Icon className="w-4 h-4" />
        </div>

        {/* Toggle Switch matching reference UI */}
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={monitor.active}
            onChange={() => onToggleActive(monitor.id)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 shadow-inner"></div>
        </label>
      </div>

      {/* Target Title & Details */}
      <div>
        <div className="flex items-center justify-between">
          <h4 className="text-base font-bold text-white tracking-tight truncate max-w-[180px]">
            {monitor.name}
          </h4>
          <StatusBadge status={monitor.status} />
        </div>
        <p className="text-xs text-slate-400 font-mono truncate mt-1" title={monitor.url}>
          {monitor.url}
        </p>
      </div>

      {/* Stats Row */}
      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-semibold text-slate-500">Latency</span>
          <span className="font-bold text-white">{monitor.latency > 0 ? `${monitor.latency} ms` : '--'}</span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-[10px] uppercase font-semibold text-slate-500">Last Ping</span>
          <span className="font-medium text-slate-300">{formatRelativeTime(monitor.lastPing)}</span>
        </div>
      </div>

      {/* Actions Row */}
      <div className="mt-3 flex items-center justify-between gap-2">
        <button
          onClick={() => onPingNow(monitor.id)}
          disabled={isPinging || !monitor.active}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-cyan-300 border border-cyan-400/20 text-xs font-semibold transition-all disabled:opacity-40"
        >
          <RefreshCw className={`w-3 h-3 ${isPinging ? 'animate-spin' : ''}`} />
          <span>Ping</span>
        </button>

        <button
          onClick={() => onDelete(monitor.id)}
          title="Delete Target"
          className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all hover:scale-105"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
