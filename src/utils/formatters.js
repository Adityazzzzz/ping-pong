/**
 * Format timestamp into relative time string (e.g. "2 mins ago")
 */
export function formatRelativeTime(dateString) {
  if (!dateString) return 'Never';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 30) return 'Just now';
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
}

/**
 * Format time to 12-hour clock (e.g. "10:02 PM")
 */
export function formatClockTime(date = new Date()) {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Format latency status color class
 */
export function getLatencyColor(ms) {
  if (ms === 0) return 'text-slate-400';
  if (ms < 150) return 'text-emerald-400';
  if (ms < 350) return 'text-amber-400';
  return 'text-rose-400';
}
