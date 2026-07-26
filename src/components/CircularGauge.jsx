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
      <div className="text-center mb-1.5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 font-display">SYSTEM UPTIME</span>
      </div>

      {/* Circular Ring Gauge with Modern Gradient */}
      <div className="relative w-36 h-36 flex items-center justify-center my-1.5">
        <svg height={radius * 2.1} width={radius * 2.1} className="rotate-[-90deg]">
          <defs>
            <linearGradient id="sidebarGaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0891b2" />
              <stop offset="50%" stopColor="#059669" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
          </defs>
          <circle
            stroke="rgba(0, 0, 0, 0.04)"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius * 1.05}
            cy={radius * 1.05}
          />
          <circle
            stroke="url(#sidebarGaugeGradient)"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius * 1.05}
            cy={radius * 1.05}
            className="transition-all duration-1000 ease-out filter drop-shadow-[0_0_4px_rgba(5,150,105,0.2)]"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="flex items-baseline">
            <span className="text-4xl font-extrabold font-display text-zinc-950 tracking-tighter">{healthScore}</span>
            <span className="text-sm font-bold text-zinc-400 font-display ml-0.5">%</span>
          </div>
          <span className="text-[9px] text-emerald-700 font-bold tracking-wider uppercase flex items-center gap-1 mt-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-250/50 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5" /> Active
          </span>
        </div>
      </div>

      {/* Mode Preset Buttons - Apple Segmented Control Style */}
      <div className="w-full mt-3.5">
        <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest block text-center mb-2 font-display">
          PING PRESETS
        </span>
        <div className="grid grid-cols-4 gap-1 p-1 bg-zinc-100 border border-zinc-200/60 rounded-[20px]">
          {modes.map((mode) => {
            const Icon = mode.icon;
            const isActive = activeMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => onChangeMode && onChangeMode(mode.id)}
                title={`${mode.title} (${mode.label})`}
                className={`flex flex-col items-center justify-center py-2.5 rounded-[15px] text-[10px] transition-all duration-200 ${
                  isActive
                    ? 'bg-white border-zinc-200 text-zinc-950 font-bold shadow-[0_2px_6px_rgba(0,0,0,0.03)]'
                    : 'border-transparent text-zinc-500 hover:text-zinc-800'
                } border`}
              >
                <Icon className={`w-4 h-4 mb-0.5 transition-transform ${isActive ? 'scale-110 text-emerald-600' : ''}`} />
                <span className="text-[9px] font-mono font-semibold">{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
