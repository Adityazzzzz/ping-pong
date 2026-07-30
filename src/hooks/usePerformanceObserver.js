import { useState, useEffect } from 'react';

export function usePerformanceObserver(maxEntries = 5) {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.PerformanceObserver) {
      return;
    }

    const parseEntry = (entry) => {
      // We only care about our API requests
      if (!entry.name.includes('/api/')) return null;

      // Extract endpoint shorthand (e.g. /api/monitors or /api/ping/123)
      let urlPath = entry.name;
      try {
        const urlObj = new URL(entry.name, window.location.origin);
        urlPath = urlObj.pathname;
      } catch (e) {
        // Fallback to name if URL parsing fails
      }

      // Performance timings (all in ms)
      const dns = Math.max(0, entry.domainLookupEnd - entry.domainLookupStart);
      const connect = Math.max(0, entry.connectEnd - entry.connectStart);
      
      // Calculate TTFB (Waiting time)
      // If responseStart is 0, fallback to duration minus download time
      const requestStart = entry.requestStart || entry.connectEnd;
      const responseStart = entry.responseStart || requestStart;
      const ttfb = Math.max(0, responseStart - requestStart);
      
      // Download duration
      const download = Math.max(0, entry.responseEnd - responseStart);

      return {
        id: `${entry.startTime}-${entry.name}`,
        name: urlPath,
        method: 'GET', // Default assumed HTTP method for resource fetches
        dns: Math.round(dns * 10) / 10,
        connect: Math.round(connect * 10) / 10,
        ttfb: Math.round(ttfb * 10) / 10,
        download: Math.round(download * 10) / 10,
        duration: Math.round(entry.duration),
        size: entry.transferSize || 0,
        timestamp: new Date().toISOString(),
      };
    };

    // Pull initial entries that occurred before the observer was mounted
    const initialEntries = window.performance.getEntriesByType('resource');
    const parsedInitials = initialEntries
      .map(parseEntry)
      .filter(Boolean)
      .slice(-maxEntries);
    setLogs(parsedInitials);

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const parsed = entries.map(parseEntry).filter(Boolean);
      
      if (parsed.length > 0) {
        setLogs((prev) => {
          const combined = [...prev, ...parsed];
          return combined.slice(-maxEntries);
        });
      }
    });

    try {
      observer.observe({ type: 'resource', buffered: true });
    } catch (e) {
      // Fallback for older browsers
      observer.observe({ entryTypes: ['resource'] });
    }

    return () => {
      observer.disconnect();
    };
  }, [maxEntries]);

  return logs;
}
