import React from 'react';
import { X, Image, Check } from 'lucide-react';

export default function WallpaperSelector({ isOpen, onClose, currentWallpaper, onSelectWallpaper }) {
  if (!isOpen) return null;

  const presetWallpapers = [
    {
      name: 'Moody Mountain Lake',
      url: '/scenery_landscape.jpg',
      thumb: '/scenery_landscape.jpg',
    },
    {
      name: 'Cyberpunk Neon City',
      url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1600&auto=format&fit=crop',
      thumb: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=300&auto=format&fit=crop',
    },
    {
      name: 'Serene Alpine Twilight',
      url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1600&auto=format&fit=crop',
      thumb: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=300&auto=format&fit=crop',
    },
    {
      name: 'Deep Space Nebula',
      url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop',
      thumb: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=300&auto=format&fit=crop',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-fade-in">
      <div className="glass-panel w-full max-w-2xl p-6 rounded-3xl border border-white/15 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-400/30">
            <Image className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-white">Select Background Scenery Wallpaper</h3>
            <p className="text-xs text-slate-400">Customize the visual backdrop for your VisionOS glass dashboard</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 my-4">
          {presetWallpapers.map((wp) => {
            const isSelected = currentWallpaper === wp.url;
            return (
              <div
                key={wp.url}
                onClick={() => onSelectWallpaper(wp.url)}
                className={`relative h-32 rounded-2xl overflow-hidden border-2 cursor-pointer transition-all duration-300 group ${
                  isSelected ? 'border-cyan-400 scale-[1.02] shadow-xl shadow-cyan-500/20' : 'border-white/10 hover:border-white/30'
                }`}
              >
                <img src={wp.thumb} alt={wp.name} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent p-3 flex flex-col justify-end">
                  <span className="text-xs font-bold text-white">{wp.name}</span>
                </div>
                {isSelected && (
                  <div className="absolute top-3 right-3 p-1.5 rounded-full bg-cyan-400 text-slate-950 shadow-lg">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
