import React from 'react';
import { ShieldCheck, Flame, Leaf, Wind, Snowflake } from 'lucide-react';

export default function CircularGauge({ healthScore = 99.4, activeMode = 'eco', onChangeMode }) {
  const radius = 68;
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
    <div className="flex flex-col items-center justify-between w-full p-2 relative overflow-hidden">
      <div className="text-center mb-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">SYSTEM KEEP-ALIVE DIAL</span>
      </div>

      {/* Circular Ring Gauge with Modern Gradient */}
      <div className="relative w-40 h-40 flex items-center justify-center my-2">
        <svg height={radius * 2.2} width={radius * 2.2} className="rotate-[-90deg]">
          <defs>
            <linearGradient id="sidebarGaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" /> {/* Cyan */}
              <stop offset="50%" stopColor="#10b981" /> {/* Emerald */}
              <stop offset="100%" stopColor="#3b82f6" /> {/* Blue */}
            </linearGradient>
          </defs>
          {/* Background circle */}
          <circle
            stroke="rgba(255, 255, 255, 0.03)"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius * 1.1}
            cy={radius * 1.1}
          />
          {/* Active progress circle */}
          <circle
            stroke="url(#sidebarGaugeGradient)"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius * 1.1}
            cy={radius * 1.1}
            className="transition-all duration-1000 ease-out filter drop-shadow-[0_0_6px_rgba(16,185,129,0.3)]"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="flex items-baseline">
            <span className="text-4xl font-extralight text-white tracking-tight">{healthScore}</span>
            <span className="text-sm font-medium text-white/50 font-mono ml-0.5">%</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-semibold tracking-wider uppercase flex items-center gap-1 mt-1 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5" /> Active
          </span>
        </div>
      </div>

      {/* Mode Preset Buttons - Apple Segmented Control Style */}
      <div className="w-full mt-3">
        <span className="text-[10px] uppercase font-bold text-white/30 tracking-widest block text-center mb-2">
          PING PRESETS
        </span>
        <div className="grid grid-cols-4 gap-1 p-1 bg-black/40 border border-white/5 rounded-2xl">
          {modes.map((mode) => {
            const Icon = mode.icon;
            const isActive = activeMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => onChangeMode && onChangeMode(mode.id)}
                title={`${mode.title} (${mode.label})`}
                className={`flex flex-col items-center justify-center py-2 rounded-xl text-[10px] transition-all duration-200 ${
                  isActive
                    ? 'bg-white/10 border-white/10 text-white font-medium shadow-md'
                    : 'border-transparent text-white/40 hover:text-white/70'
                } border`}
              >
                <Icon className={`w-3.5 h-3.5 mb-0.5 transition-transform ${isActive ? 'scale-110 text-emerald-400' : ''}`} />
                <span className="text-[10px] font-mono font-medium">{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
