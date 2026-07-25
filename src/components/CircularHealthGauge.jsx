import React from 'react';
import { ShieldCheck, Flame, Leaf, Wind, Snowflake } from 'lucide-react';

export default function CircularHealthGauge({ healthScore = 98.4, activeMode = 'eco', onChangeMode }) {
  const radius = 65;
  const strokeWidth = 10;
  const normalizedRadius = radius - strokeWidth * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (healthScore / 100) * circumference;

  const modes = [
    { id: 'turbo', label: 'Turbo', icon: Flame, desc: '1m Pings' },
    { id: 'eco', label: 'Eco', icon: Leaf, desc: '5m Pings' },
    { id: 'standard', label: 'Standard', icon: Wind, desc: '10m Pings' },
    { id: 'passive', label: 'Passive', icon: Snowflake, desc: '14m Pings' },
  ];

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* Clock Display Header */}
      <div className="text-center mb-4">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Overall Health Score</span>
      </div>

      {/* Circular Speedometer Gauge */}
      <div className="relative w-48 h-48 flex items-center justify-center my-2">
        <svg height={radius * 2.5} width={radius * 2.5} className="rotate-[-90deg]">
          {/* Background circle track */}
          <circle
            stroke="rgba(255, 255, 255, 0.08)"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius * 1.25}
            cy={radius * 1.25}
          />
          {/* Progress circle arc */}
          <circle
            stroke="url(#blueCyanGradient)"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius * 1.25}
            cy={radius * 1.25}
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="blueCyanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="flex items-baseline">
            <span className="text-4xl font-black text-white tracking-tighter">{healthScore}</span>
            <span className="text-xl font-bold text-cyan-400">%</span>
          </div>
          <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider flex items-center gap-1 mt-0.5">
            <ShieldCheck className="w-3 h-3 text-emerald-400" /> Operational
          </span>
        </div>
      </div>

      {/* Mode Buttons Row (Matching Hot, Eco, Fan, Cold icons in thermostat design) */}
      <div className="grid grid-cols-4 gap-2 w-full mt-4">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isActive = activeMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => onChangeMode && onChangeMode(mode.id)}
              className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all duration-200 ${
                isActive
                  ? 'bg-blue-500/20 border-cyan-400/50 text-cyan-300 shadow-md shadow-cyan-500/20 scale-105'
                  : 'bg-slate-900/40 border-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="w-4 h-4 mb-1" />
              <span className="text-[10px] font-semibold">{mode.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
