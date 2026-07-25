import React from 'react';
import { Plus } from 'lucide-react';

export default function CategoryTabs({ activeCategory, onChangeCategory, onOpenAddModal }) {
  const categories = [
    { id: 'all', label: 'All Targets' },
    { id: 'database', label: 'Databases' },
    { id: 'api', label: 'APIs & Services' },
    { id: 'web', label: 'Web Apps' },
  ];

  return (
    <div className="flex items-center justify-center my-6">
      <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-slate-900/70 backdrop-blur-2xl border border-white/10 shadow-xl">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onChangeCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 ${
                isActive
                  ? 'bg-blue-600/90 text-white shadow-lg shadow-blue-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat.label}
            </button>
          );
        })}

        <button
          onClick={onOpenAddModal}
          className="p-2 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-lg shadow-cyan-500/30 transition-all hover:scale-105 active:scale-95 ml-1"
          title="Add New Target"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
