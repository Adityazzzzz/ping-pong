import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';
import { Plus, Database, Server, Globe, Sparkles } from 'lucide-react';

export default function AddMonitorModal({ isOpen, onClose, onAddTarget }) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState('database');
  const [interval, setInterval] = useState(5);
  const [method, setMethod] = useState('GET');

  const presetTemplates = [
    {
      label: 'Supabase DB',
      name: 'Supabase PostgreSQL Database',
      url: 'https://httpbin.org/status/200',
      type: 'database',
      interval: 5,
    },
    {
      label: 'Render API',
      name: 'Render Node.js Backend API',
      url: 'https://httpbin.org/delay/0',
      type: 'api',
      interval: 5,
    },
    {
      label: 'Koyeb Web',
      name: 'Koyeb React Web App',
      url: 'https://httpbin.org/get',
      type: 'web',
      interval: 10,
    },
    {
      label: 'Vercel App',
      name: 'Vercel Microservice',
      url: 'https://httpbin.org/status/200',
      type: 'api',
      interval: 5,
    },
  ];

  const applyTemplate = (tpl) => {
    setName(tpl.name);
    setUrl(tpl.url);
    setType(tpl.type);
    setInterval(tpl.interval);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !url) return;

    onAddTarget({
      name,
      url,
      type,
      interval: parseInt(interval, 10),
      method,
    });

    setName('');
    setUrl('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-white/10 text-white border border-white/20">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle>Add Monitored Endpoint Target</DialogTitle>
              <DialogDescription>
                Prevent free tier spin-down on Render, Supabase, Koyeb, Railway & Vercel
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Quick Presets */}
        <div className="my-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-white/60 flex items-center gap-1 mb-2">
            <Sparkles className="w-3 h-3 text-white" /> Quick Provider Presets
          </span>
          <div className="grid grid-cols-4 gap-2">
            {presetTemplates.map((tpl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyTemplate(tpl)}
                className="px-2.5 py-1.5 rounded-xl bg-black/40 hover:bg-white/10 border border-white/5 hover:border-white/20 text-[11px] font-semibold text-white/60 hover:text-white transition-all text-center"
              >
                {tpl.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs mt-2">
          <div>
            <label className="block text-white/80 font-semibold mb-1">Target Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Supabase Production PostgreSQL"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-all"
            />
          </div>

          <div>
            <label className="block text-white/80 font-semibold mb-1">Endpoint URL</label>
            <input
              type="url"
              required
              placeholder="https://my-app.onrender.com/health"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-all font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/80 font-semibold mb-1">Category</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-white/30 transition-all"
              >
                <option value="database">Database (Supabase/Neon)</option>
                <option value="api">API Backend (Render/Koyeb)</option>
                <option value="web">Web App (Vercel/Fly.io)</option>
              </select>
            </div>

            <div>
              <label className="block text-white/80 font-semibold mb-1">Interval</label>
              <select
                value={interval}
                onChange={(e) => setInterval(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-white/30 transition-all"
              >
                <option value={1}>Every 1 Minute (Turbo)</option>
                <option value={5}>Every 5 Minutes (Recommended)</option>
                <option value={10}>Every 10 Minutes</option>
                <option value={14}>Every 14 Minutes (Pre-Sleep)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/10">
            <Button type="button" variant="ghost" onClick={onClose} className="text-white/80 hover:text-white hover:bg-white/10">
              Cancel
            </Button>
            <Button type="submit" className="glass-button text-white shadow-sm">
              Add Target Endpoint
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
