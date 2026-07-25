import React from 'react';

export default function MetricCard({ title, value, unit = '', subtitle = '', icon: Icon, trend = null, color = 'blue' }) {
  const accentColors = {
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  };

  const selectedColor = accentColors[color] || accentColors.blue;

  return (
    <div className="glass-card p-5 rounded-2xl flex flex-col justify-between hover:scale-[1.02] transition-all">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className={`p-2 rounded-xl border backdrop-blur-md ${selectedColor}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-extrabold tracking-tight text-white">{value}</span>
        {unit && <span className="text-sm font-semibold text-slate-400">{unit}</span>}
      </div>

      {subtitle && (
        <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
          <span>{subtitle}</span>
          {trend && (
            <span className={`font-semibold ${trend > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {trend > 0 ? `+${trend}%` : `${trend}%`}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
