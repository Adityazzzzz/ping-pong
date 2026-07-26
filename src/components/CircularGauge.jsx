import React from 'react';
import { ShieldCheck, Flame, Leaf, Wind, Snowflake } from 'lucide-react';

export default function CircularGauge({ healthScore = 99.4, activeMode = 'eco', onChangeMode }) {
  const radius = 65;
  const strokeWidth = 8;
  const normalizedRadius = radius - strokeWidth * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (healthScore / 100) * circumference;

  const modes = [
    { id: 'turbo', label: '1m', icon: Flame, title: 'Turbo' },
    { id: 'eco', label: '5m', icon: Leaf, title: 'Eco' },
    { id: 'standard', label: '10m', icon: Wind, title: 'Standard' },
    { id: 'passive', label: '14m', icon: Snowflake, title: 'Passive' },
  ];

  return (
    <div className="glass-card-luxury p-5 rounded-2xl flex flex-col items-center justify-between h-full relative overflow-hidden">
      <div className="text-center mb-1">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">System Uptime Dial</span>
      </div>

      {/* Circular Speedometer Ring Gauge */}
      <div className="relative w-44 h-44 flex items-center justify-center my-2">
        <svg height={radius * 2.4} width={radius * 2.4} className="rotate-[-90deg]">
          <circle
            stroke="rgba(255, 255, 255, 0.06)"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius * 1.2}
            cy={radius * 1.2}
          />
          <circle
            stroke="url(#cyanBlueGrad)"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius * 1.2}
            cy={radius * 1.2}
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="cyanBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="flex items-baseline">
            <span className="text-4xl font-bold text-white font-mono tracking-tight">{healthScore}</span>
            <span className="text-xl font-semibold text-cyan-400 font-mono">%</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-medium tracking-wide flex items-center gap-1 mt-0.5">
            <ShieldCheck className="w-3 h-3" /> Operational
          </span>
        </div>
      </div>

      {/* Mode Preset Buttons */}
      <div className="w-full mt-2">
        <span className="text-[9px] uppercase font-semibold text-slate-400 tracking-wider block text-center mb-1.5">
          Ping Interval Preset
        </span>
        <div className="grid grid-cols-4 gap-1.5">
          {modes.map((mode) => {
            const Icon = mode.icon;
            const isActive = activeMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => onChangeMode && onChangeMode(mode.id)}
                title={`${mode.title} (${mode.label})`}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg border text-xs transition-all ${
                  isActive
                    ? 'bg-cyan-500/20 border-cyan-400/40 text-cyan-300 font-bold shadow-sm shadow-cyan-500/20'
                    : 'bg-slate-900/40 border-white/5 text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5 mb-0.5" />
                <span className="text-[10px] font-mono">{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
