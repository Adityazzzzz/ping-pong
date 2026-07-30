import React, { useState } from 'react';
import { usePerformanceObserver } from '../hooks/usePerformanceObserver';
import { Activity, ChevronDown, ChevronUp, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ApiWaterfallCard() {
  const logs = usePerformanceObserver(5);
  const [expandedLogId, setExpandedLogId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedLogId(expandedLogId === id ? null : id);
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white rounded-[28px] border border-black/[0.04] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.015)] space-y-4 font-display">
      
      {/* Title */}
      <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-600 animate-pulse" />
          <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest block leading-none">
            API Network Auditor
          </span>
        </div>
        <span className="text-[9px] font-mono font-bold bg-zinc-100/80 text-zinc-500 border border-zinc-200 px-1.5 py-0.5 rounded">
          Live Timing
        </span>
      </div>

      {logs.length === 0 ? (
        <div className="text-center py-6 text-[10px] text-zinc-400 font-mono">
          Waiting for API requests...
        </div>
      ) : (
        <div className="space-y-3">
          {logs.slice().reverse().map((log) => {
            const isExpanded = expandedLogId === log.id;
            
            // Calculate proportional segments for the waterfall bar
            const total = Math.max(1, log.dns + log.connect + log.ttfb + log.download);
            const dnsPercent = (log.dns / total) * 100;
            const connectPercent = (log.connect / total) * 100;
            const ttfbPercent = (log.ttfb / total) * 100;
            const downloadPercent = (log.download / total) * 100;

            return (
              <div 
                key={log.id} 
                className="border-b border-zinc-100/60 pb-2.5 last:border-0 last:pb-0"
              >
                {/* Header Row */}
                <div 
                  onClick={() => toggleExpand(log.id)}
                  className="flex items-center justify-between cursor-pointer group"
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <span className="text-xs font-mono font-bold text-zinc-700 truncate block group-hover:text-zinc-950 transition-colors">
                      {log.name}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold text-zinc-850 bg-zinc-50 px-1.5 py-0.5 rounded border border-zinc-200">
                      {log.duration}ms
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-700 transition-colors" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-700 transition-colors" />
                    )}
                  </div>
                </div>

                {/* Inline Mini-Waterfall Bar */}
                <div className="h-1.5 w-full bg-zinc-100/80 rounded-full overflow-hidden flex mt-2 shadow-inner">
                  {log.dns > 0 && (
                    <div 
                      style={{ width: `${dnsPercent}%` }} 
                      className="bg-cyan-500 h-full transition-all duration-300"
                      title={`DNS: ${log.dns}ms`}
                    />
                  )}
                  {log.connect > 0 && (
                    <div 
                      style={{ width: `${connectPercent}%` }} 
                      className="bg-amber-500 h-full transition-all duration-300"
                      title={`Connect: ${log.connect}ms`}
                    />
                  )}
                  <div 
                    style={{ width: `${ttfbPercent}%` }} 
                    className="bg-purple-500 h-full transition-all duration-300"
                    title={`Waiting (TTFB): ${log.ttfb}ms`}
                  />
                  <div 
                    style={{ width: `${downloadPercent}%` }} 
                    className="bg-emerald-500 h-full transition-all duration-300"
                    title={`Download: ${log.download}ms`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
