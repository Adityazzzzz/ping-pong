import React from 'react';

export default function StatusBadge({ status = 'online', label = '' }) {
  const config = {
    online: {
      color: 'bg-emerald-500',
      pulse: 'status-pulse-active',
      badgeBg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
      defaultLabel: 'Online',
    },
    degraded: {
      color: 'bg-amber-500',
      pulse: 'status-pulse-warning',
      badgeBg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
      defaultLabel: 'Degraded',
    },
    offline: {
      color: 'bg-rose-500',
      pulse: 'status-pulse-error',
      badgeBg: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
      defaultLabel: 'Offline',
    },
  };

  const current = config[status] || config.offline;

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-md ${current.badgeBg}`}
    >
      <span className={`w-2 h-2 rounded-full ${current.color} ${current.pulse}`} />
      <span>{label || current.defaultLabel}</span>
    </div>
  );
}
