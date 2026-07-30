import React, { useState } from 'react';
import { usePerformanceObserver } from '../hooks/usePerformanceObserver';
import { Activity, ChevronDown, ChevronUp, Zap, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ApiWaterfallCard() {
  const logs = usePerformanceObserver(5);
  const [expandedLogId, setExpandedLogId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedLogId(expandedLogId === id ? null : id);
  };

  return (
    <div className="bg-white rounded-[28px] border border-black/[0.04] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.015)] space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-600 animate-pulse" />
          <span className="text-[10px] font-extrabold font-display text-zinc-400 uppercase tracking-widest block leading-none">
            API Network Auditor
          </span>
        </div>
        <span className="text-[9px] font-mono font-bold bg-zinc-105 text-zinc-500 border border-zinc-200 px-1.5 py-0.5 rounded">
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
            return (
              <div 
                key={log.id} 
                className="border-b border-zinc-100/60 pb-2.5 last:border-0 last:pb-0 font-display"
              >
                {/* Header Row */}
                <div 
                  onClick={() => toggleExpand(log.id)}
                  className="flex items-center justify-between cursor-pointer group"
                >
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-mono font-bold text-zinc-700 truncate block">
                      {log.name}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 pl-2">
                    <span className="text-xs font-mono font-bold text-zinc-800 bg-zinc-50 px-1.5 py-0.5 rounded border border-zinc-200">
                      {log.duration}ms
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-700" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-700" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
