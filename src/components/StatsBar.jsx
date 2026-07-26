import React from 'react';
import { Card } from './ui/card';
import { ShieldCheck, Zap, Activity, AlertCircle } from 'lucide-react';

export default function StatsBar({ totalCount, activeCount, avgLatency, healthScore }) {
  const stats = [
    {
      label: 'Active Monitored Targets',
      value: `${activeCount}/${totalCount}`,
      subtitle: 'Online Endpoints',
      icon: Activity,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    },
    {
      label: 'Overall System Health',
      value: `${healthScore}%`,
      subtitle: 'Operational Score',
      icon: ShieldCheck,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      label: 'Average Response Latency',
      value: `${avgLatency} ms`,
      subtitle: 'HTTP Telemetry',
      icon: Zap,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    },
    {
      label: 'Downtime Incidents',
      value: totalCount - activeCount,
      subtitle: 'Active Alerts',
      icon: AlertCircle,
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <Card key={idx} className="flex items-center justify-between p-4 hover:border-white/20 transition-all">
            <div>
              <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400 block mb-1">
                {stat.label}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-white tracking-tight">{stat.value}</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">{stat.subtitle}</span>
            </div>
            <div className={`p-3 rounded-2xl border backdrop-blur-md ${stat.color}`}>
              <Icon className="w-5 h-5" />
            </div>
          </Card>
        );
      })}
    </div>
  );
}
