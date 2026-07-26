import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Shadcn cn helper combining clsx and tailwind-merge
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format relative time string
 */
export function formatRelativeTime(dateString) {
  if (!dateString) return "Never";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 30) return "Just now";
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
}

/**
 * Get latency badge styling class
 */
export function getLatencyBadge(ms) {
  if (!ms || ms === 0) return "bg-slate-800 text-slate-400 border-slate-700";
  if (ms < 150) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
  if (ms < 350) return "bg-amber-500/10 text-amber-400 border-amber-500/20";
  return "bg-rose-500/10 text-rose-400 border-rose-500/20";
}
