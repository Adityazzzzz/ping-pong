import React from 'react';
import { LayoutDashboard, Activity, BarChart2, PlusCircle, Settings, Image } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onOpenAddModal, onOpenWallpaperModal }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'monitors', label: 'Monitors', icon: Activity },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  ];

  return (
    <aside className="fixed left-6 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-6 p-3 rounded-3xl bg-slate-900/60 backdrop-blur-2xl border border-white/10 shadow-2xl">
      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/30">
        <Activity className="w-5 h-5 text-white" />
      </div>

      <div className="w-8 h-px bg-white/10" />

      <nav className="flex flex-col items-center gap-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={item.label}
              className={`p-3 rounded-2xl transition-all duration-300 relative group ${
                isActive
                  ? 'bg-blue-500/20 text-cyan-400 border border-cyan-400/30 shadow-lg shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="w-5 h-5" />
              {isActive && (
                <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="w-8 h-px bg-white/10" />

      <div className="flex flex-col items-center gap-3">
        <button
          onClick={onOpenAddModal}
          title="Add New Target"
          className="p-3 rounded-2xl bg-blue-600/80 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-105 active:scale-95"
        >
          <PlusCircle className="w-5 h-5" />
        </button>

        <button
          onClick={onOpenWallpaperModal}
          title="Change Scenery Wallpaper"
          className="p-3 rounded-2xl text-slate-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <Image className="w-5 h-5" />
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          title="Settings"
          className={`p-3 rounded-2xl transition-all ${
            activeTab === 'settings'
              ? 'bg-blue-500/20 text-cyan-400 border border-cyan-400/30'
              : 'text-slate-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
}
