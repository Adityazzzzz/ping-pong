import React from 'react';
import { motion } from 'framer-motion';
import { X, Copy, Check, RefreshCw, Trash2, Database, Server, Globe, ShieldAlert, Activity } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { formatRelativeTime, getLatencyBadge } from '../lib/utils';

export default function ProjectInspector({ monitor, onPingNow, onDelete, isPinging, onClose }) {
  const [copied, setCopied] = React.useState(false);

  if (!monitor) return null;

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

  const logs = monitor.logs || [];

  return (
    <motion.div
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 360, opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="h-[82vh] border border-black/[0.04] bg-white flex flex-col justify-between shrink-0 overflow-hidden relative rounded-[28px] shadow-[0_8px_30px_rgba(0,0,0,0.015)]"
    >
      {/* Inner container */}
      <div className="w-[360px] h-full flex flex-col justify-between absolute right-0 top-0">
        
        {/* Header */}
        <div className="p-5 border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-zinc-50 border border-zinc-200 text-zinc-800 flex items-center justify-center">
              <Icon className="w-5 h-5 text-zinc-700" />
            </div>
            <div>
              <h3 className="text-base font-extrabold font-display text-zinc-950 tracking-tight truncate max-w-[180px]" title={monitor.name}>
                {monitor.name}
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 font-display">
                Inspector Node
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-850 hover:bg-zinc-100 p-2 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Details Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
          
          {/* Node Status Indicator */}
          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-150 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={`w-2.5 h-2.5 rounded-full relative ${
                monitor.status === 'degraded' 
                  ? 'status-warning' 
                  : monitor.status === 'offline' 
                  ? 'status-offline' 
                  : 'status-online'
              }`} />
              <div>
                <span className="text-[10px] text-zinc-400 block font-display font-bold">CURRENT STATUS</span>
                <span className="text-xs font-semibold text-zinc-800 capitalize">{monitor.status || 'online'}</span>
              </div>
            </div>

            <Badge variant="outline" className={`text-xs font-mono px-2 py-0.5 border-zinc-200 text-zinc-700 ${getLatencyBadge(monitor.latency)}`}>
              {monitor.latency > 0 ? `${monitor.latency} ms` : '--'}
            </Badge>
          </div>

          {/* Configurations */}
          <div className="space-y-4">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block px-1 font-display">SPECIFICATIONS</span>
            
            <div className="space-y-3">
              <div>
                <span className="text-[10px] text-zinc-400 block mb-1">Target Address URL</span>
                <div 
                  onClick={handleCopyUrl}
                  className="bg-zinc-50 px-3.5 py-2.5 rounded-xl border border-zinc-200 flex items-center justify-between gap-3 transition-all hover:bg-zinc-100 cursor-pointer group"
                >
                  <span className="text-xs font-mono text-zinc-650 truncate flex-1 group-hover:text-zinc-950 transition-colors">
                    {monitor.url}
                  </span>
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-zinc-400 group-hover:text-zinc-700" />}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-zinc-400 block mb-1">Interval Rate</span>
                  <div className="bg-zinc-50 px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs text-zinc-700 font-mono">
                    Every {monitor.interval} Min
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 block mb-1">Last Contact</span>
                  <div className="bg-zinc-50 px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs text-zinc-700">
                    {formatRelativeTime(monitor.lastPing)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Specific Telemetry Logs stream */}
          <div className="space-y-4">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block px-1 flex items-center gap-1.5 font-display">
              <Activity className="w-3.5 h-3.5 text-cyan-600" /> Node Telemetry Stream
            </span>

            <div className="relative pl-3.5 space-y-3.5 max-h-52 overflow-y-auto pr-1">
              {logs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center text-zinc-400">
                  <ShieldAlert className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-xs font-mono">No telemetry records exist.</p>
                </div>
              ) : (
                <>
                  <div className="absolute left-[19px] top-1.5 bottom-1.5 w-[1px] bg-zinc-200" />
                  {logs.slice(0, 8).map((log, idx) => (
                    <div key={idx} className="flex items-start justify-between relative">
                      <div className="absolute left-[-18px] top-1.5 flex items-center justify-center">
                        <span className={`w-2 h-2 rounded-full border border-zinc-200 ${
                          log.status >= 200 && log.status < 300 
                            ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.3)]' 
                            : 'bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.3)]'
                        }`} />
                      </div>

                      <div className="pl-1.5">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-mono font-bold px-1 py-0.5 rounded border ${
                            log.status >= 200 && log.status < 300 
                              ? 'bg-emerald-50/5 border-emerald-200 text-emerald-600' 
                              : 'bg-rose-50/5 border-rose-200 text-rose-600'
                          }`}>
                            {log.status}
                          </span>
                          <span className="text-[11px] font-mono font-semibold text-zinc-700">{log.latency}ms</span>
                        </div>
                        <span className="text-[10px] text-zinc-400 font-mono block mt-0.5">{formatRelativeTime(log.timestamp)}</span>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

        </div>

        {/* Control Actions Row */}
        <div className="p-5 border-t border-zinc-100 bg-zinc-50 flex items-center gap-3">
          <Button
            onClick={() => onPingNow(monitor.id)}
            disabled={isPinging || !monitor.active}
            className="flex-1 h-10 rounded-xl text-xs font-bold bg-zinc-950 hover:bg-zinc-900 active:bg-zinc-950 text-white flex items-center justify-center gap-2 transition-all shadow-sm border border-zinc-950 font-display tracking-wide"
          >
            <RefreshCw className={`w-4 h-4 ${isPinging ? 'animate-spin' : ''}`} />
            <span>Manual Ping</span>
          </Button>

          <Button
            onClick={() => {
              onDelete(monitor.id);
              onClose();
            }}
            className="h-10 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-all flex items-center justify-center shadow-sm"
            title="Delete Target Node"
          >
            <Trash2 className="w-4.5 h-4.5" />
          </Button>
        </div>

      </div>
    </motion.div>
  );
}
