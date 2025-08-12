"use client";

import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage?: number;
  networkRequests: number;
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    const startTime = performance.now();
    let requestCount = 0;

    // Monitor network requests
    const originalFetch = window.fetch.bind(window);
    const wrappedFetch: typeof window.fetch = (...args) => {
      requestCount++;
      return originalFetch(...(args as [RequestInfo, RequestInit?]));
    };
    window.fetch = wrappedFetch;

    // Measure page load time
    const measureLoadTime = () => {
      const loadTime = performance.now() - startTime;
      const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
      const renderTime = navEntry?.domContentLoadedEventEnd ?? 0;
      
      setMetrics({
        loadTime: Math.round(loadTime),
        renderTime: Math.round(renderTime),
        memoryUsage: (performance as any).memory?.usedJSHeapSize,
        networkRequests: requestCount,
      });
    };

    // Wait for page to fully load
    if (document.readyState === 'complete') {
      measureLoadTime();
    } else {
      window.addEventListener('load', measureLoadTime);
    }

    // Toggle visibility with Ctrl+Shift+P
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        setIsVisible((v) => !v);
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('load', measureLoadTime);
      document.removeEventListener('keydown', handleKeyPress);
      window.fetch = originalFetch;
    };
  }, []);

  if (!isVisible || !metrics) return null;

  const getPerformanceColor = (time: number) => {
    if (time < 1000) return 'text-green-500';
    if (time < 2000) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg text-sm font-mono z-50 max-w-xs">
      <div className="font-bold mb-2">Performance Monitor</div>
      <div className="space-y-1">
        <div>Load Time: <span className={getPerformanceColor(metrics.loadTime)}>{metrics.loadTime}ms</span></div>
        <div>Render Time: <span className={getPerformanceColor(metrics.renderTime)}>{metrics.renderTime}ms</span></div>
        <div>Network Requests: {metrics.networkRequests}</div>
        {metrics.memoryUsage && (
          <div>Memory: {Math.round(metrics.memoryUsage / 1024 / 1024)}MB</div>
        )}
      </div>
      <div className="text-xs text-gray-400 mt-2">
        Press Ctrl+Shift+P to toggle
      </div>
    </div>
  );
}

