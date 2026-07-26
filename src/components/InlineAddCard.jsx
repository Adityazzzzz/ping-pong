import React, { useState } from 'react';
import { Button } from './ui/button';
import { Sparkles, X, Check } from 'lucide-react';

export default function InlineAddCard({ onAddTarget, onCancel }) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState('database');
  const [interval, setInterval] = useState(5);

  const presetTemplates = [
    { label: 'Supabase', name: 'Supabase DB', url: 'https://', type: 'database', interval: 5 },
    { label: 'Render', name: 'Render API', url: 'https://', type: 'api', interval: 5 },
    { label: 'Koyeb', name: 'Koyeb Web', url: 'https://', type: 'web', interval: 10 },
    { label: 'Vercel', name: 'Vercel App', url: 'https://', type: 'api', interval: 5 },
  ];

  const applyTemplate = (tpl) => {
    setName(tpl.name);
    setUrl(tpl.url);
    setType(tpl.type);
    setInterval(tpl.interval);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !url || url === 'https://') return;

    onAddTarget({
      name,
      url,
      type,
      interval: parseInt(interval, 10),
      method: 'GET',
    });
  };

  return (
    <div className="glass-card p-4 sm:p-5 rounded-3xl border border-zinc-200 shadow-lg h-full flex flex-col justify-between animate-fade-in min-h-[190px]">
      <form onSubmit={handleSubmit} className="space-y-2.5 flex-1 flex flex-col justify-between">
        
        {/* Title */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-600" /> New Keep-Alive Target
          </span>
          <button
            type="button"
            onClick={onCancel}
            className="text-zinc-400 hover:text-zinc-800 p-1 hover:bg-zinc-100 rounded-lg transition-all"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Inputs */}
        <div className="space-y-2">
          <div>
            <input
              type="text"
              required
              placeholder="Target Name (e.g., Supabase Production)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-zinc-100/60 border border-zinc-200 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 transition-all font-sans"
            />
          </div>

          <div>
            <input
              type="url"
              required
              placeholder="Endpoint URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-zinc-100/60 border border-zinc-200 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 transition-all font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-zinc-100/60 border border-zinc-200 text-xs text-zinc-700 focus:outline-none focus:border-zinc-400 transition-all font-sans"
            >
              <option value="database">Database</option>
              <option value="api">API / Backend</option>
              <option value="web">Web App</option>
            </select>

            <select
              value={interval}
              onChange={(e) => setInterval(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-zinc-100/60 border border-zinc-200 text-xs text-zinc-700 focus:outline-none focus:border-zinc-400 transition-all font-sans"
            >
              <option value={1}>1 Min (Turbo)</option>
              <option value={5}>5 Min (Eco)</option>
              <option value={10}>10 Min</option>
              <option value={14}>14 Min</option>
            </select>
          </div>
        </div>

        {/* Preset selections */}
        <div>
          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">QUICK TEMPLATES</span>
          <div className="grid grid-cols-4 gap-1">
            {presetTemplates.map((tpl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyTemplate(tpl)}
                className="py-1 px-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-[9px] text-zinc-600 hover:text-zinc-900 transition-all text-center"
              >
                {tpl.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Row */}
        <div className="flex items-center gap-2 pt-1.5 border-t border-zinc-100">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="flex-1 h-7 rounded-xl text-[11px] text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 h-7 rounded-xl text-[11px] bg-zinc-950 text-white font-semibold hover:bg-zinc-900 shadow-sm flex items-center justify-center gap-1"
          >
            <Check className="w-3 h-3" /> Save Target
          </Button>
        </div>

      </form>
    </div>
  );
}
