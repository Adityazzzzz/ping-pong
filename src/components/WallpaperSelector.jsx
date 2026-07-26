import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Image, Check } from 'lucide-react';

export default function WallpaperSelector({ isOpen, onClose, currentWallpaper, onSelectWallpaper }) {
  const presetWallpapers = [
    {
      name: 'Moody Snow Peak Lake',
      url: '/scenery_landscape.jpg',
      thumb: '/scenery_landscape.jpg',
    },
    {
      name: 'Cyberpunk Neon Horizon',
      url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1600&auto=format&fit=crop',
      thumb: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=300&auto=format&fit=crop',
    },
    {
      name: 'Serene Alpine Twilight',
      url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1600&auto=format&fit=crop',
      thumb: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=300&auto=format&fit=crop',
    },
    {
      name: 'Deep Space Aurora',
      url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop',
      thumb: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=300&auto=format&fit=crop',
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-white/10 text-white border border-white/20">
              <Image className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle>Select Scenery Backdrop</DialogTitle>
              <DialogDescription>
                Customize the glassmorphic wallpaper atmosphere
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 my-2">
          {presetWallpapers.map((wp) => {
            const isSelected = currentWallpaper === wp.url;
            return (
              <div
                key={wp.url}
                onClick={() => onSelectWallpaper(wp.url)}
                className={`relative h-32 rounded-2xl overflow-hidden border-2 cursor-pointer transition-all duration-300 group ${
                  isSelected ? 'border-white scale-[1.02] shadow-xl shadow-black/50' : 'border-white/10 hover:border-white/30'
                }`}
              >
                <img
                  src={wp.thumb}
                  alt={wp.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent p-3 flex flex-col justify-end">
                  <span className="text-xs font-bold text-white">{wp.name}</span>
                </div>
                {isSelected && (
                  <div className="absolute top-3 right-3 p-1.5 rounded-full bg-white text-black shadow-lg">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
