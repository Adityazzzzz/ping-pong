import React, { useState } from 'react';
import { X, Plus, Globe, Database, Server } from 'lucide-react';

export default function AddMonitorModal({ isOpen, onClose, onAddTarget }) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState('database');
  const [interval, setInterval] = useState(5);
  const [method, setMethod] = useState('GET');

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-fade-in">
      <div className="glass-panel w-full max-w-lg p-6 rounded-3xl border border-white/15 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-blue-500/20 text-cyan-400 border border-cyan-400/30">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-white">Add New Target URL</h3>
            <p className="text-xs text-slate-400">Keep-alive monitor for free tier apps & databases</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Target Name */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Project / Service Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Supabase Production Database"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all"
            />
          </div>

          {/* Target URL */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Target Endpoint URL</label>
            <input
              type="url"
              required
              placeholder="https://my-app.onrender.com/health"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all font-mono"
            />
          </div>

          {/* Type & Interval Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Target Category</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-white/10 text-white focus:outline-none focus:border-cyan-400 transition-all"
              >
                <option value="database">Database (Supabase/Neon)</option>
                <option value="api">API / Backend (Render/Koyeb)</option>
                <option value="web">Web App (Vercel/Fly.io)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Ping Interval</label>
              <select
                value={interval}
                onChange={(e) => setInterval(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-white/10 text-white focus:outline-none focus:border-cyan-400 transition-all"
              >
                <option value={1}>Every 1 Minute (Turbo)</option>
                <option value={5}>Every 5 Minutes (Recommended)</option>
                <option value={10}>Every 10 Minutes</option>
                <option value={14}>Every 14 Minutes (Pre-Sleep Limit)</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 font-semibold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold shadow-lg shadow-cyan-500/25 transition-all hover:scale-105"
            >
              Add Target
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
