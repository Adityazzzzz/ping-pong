import React from 'react';
import TargetCard from './TargetCard';
import { Plus } from 'lucide-react';

export default function TargetGrid({ monitors, onToggleActive, onPingNow, onDelete, onOpenAddModal, pingingIds = [] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {monitors.map((monitor) => (
        <TargetCard
          key={monitor.id}
          monitor={monitor}
          onToggleActive={onToggleActive}
          onPingNow={onPingNow}
          onDelete={onDelete}
          isPinging={pingingIds.includes(monitor.id)}
        />
      ))}

      {/* Add New Card Button matching reference UI + pill tab */}
      <button
        onClick={onOpenAddModal}
        className="glass-card p-5 rounded-2xl border border-dashed border-white/20 hover:border-cyan-400/50 flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-cyan-300 transition-all duration-300 group min-h-[170px]"
      >
        <div className="p-3 rounded-full bg-white/5 group-hover:bg-cyan-500/20 text-slate-300 group-hover:text-cyan-300 transition-all">
          <Plus className="w-5 h-5" />
        </div>
        <span className="text-xs font-semibold">Add New Target URL</span>
      </button>
    </div>
  );
}
