import React from 'react';
import { Card } from './ui/card';
import { ShieldCheck, Zap, Flame, Leaf, Wind, Snowflake } from 'lucide-react';

export default function CircularGauge({ healthScore = 99.4, activeMode = 'eco', onChangeMode }) {
  const radius = 70;
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
    <Card className="flex flex-col items-center justify-between p-6 h-full relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="text-center mb-2">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">System Keep-Alive Health</span>
      </div>

      {/* Circular Speedometer Gauge */}
      <div className="relative w-52 h-52 flex items-center justify-center my-2">
        <svg height={radius * 2.6} width={radius * 2.6} className="rotate-[-90deg]">
          <circle
            stroke="rgba(255, 255, 255, 0.08)"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius * 1.3}
            cy={radius * 1.3}
          />
          <circle
            stroke="url(#cyanBlueGrad)"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius * 1.3}
            cy={radius * 1.3}
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
            <span className="text-5xl font-black text-white tracking-tighter">{healthScore}</span>
            <span className="text-2xl font-extrabold text-cyan-400">%</span>
          </div>
          <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-1 mt-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <ShieldCheck className="w-3 h-3" /> All Systems Operational
          </span>
        </div>
      </div>

      {/* Mode Selectors */}
      <div className="w-full mt-4">
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block text-center mb-2">
          Ping Frequency Preset
        </span>
        <div className="grid grid-cols-4 gap-2">
          {modes.map((mode) => {
            const Icon = mode.icon;
            const isActive = activeMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => onChangeMode && onChangeMode(mode.id)}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all duration-200 ${
                  isActive
                    ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300 shadow-md shadow-cyan-500/20 font-bold scale-105'
                    : 'bg-slate-900/40 border-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4 mb-1" />
                <span className="text-[10px]">{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
