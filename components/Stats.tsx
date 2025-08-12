"use client";

import { useEffect, useState, useRef, memo } from "react";
import { Users, BarChart3, TrendingUp } from "lucide-react";

interface StatsData {
  totalUsers: number;
  totalPolls: number;
  totalVotes: number;
}

// Global cache to prevent duplicate requests
let statsCache: { data: StatsData | null; timestamp: number } = {
  data: null,
  timestamp: 0,
};

const CACHE_DURATION = 60000; // 60 seconds - increased for better performance

const Stats = memo(function Stats() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      // Check cache first
      const now = Date.now();
      if (statsCache.data && (now - statsCache.timestamp) < CACHE_DURATION) {
        setStats(statsCache.data);
        setLoading(false);
        return;
      }

      // Cancel previous request if it exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/stats', {
          signal: abortControllerRef.current.signal,
          headers: {
            'Cache-Control': 'max-age=60',
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        
        const data = await response.json();
        
        // Update cache
        statsCache = {
          data,
          timestamp: now,
        };
        
        setStats(data);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return; // Request was cancelled
        }
        
        console.error('Error fetching stats:', err);
        setError('Failed to load statistics');
        
        // Use cached data if available, even if expired
        if (statsCache.data) {
          setStats(statsCache.data);
        } else {
          setStats({
            totalUsers: 0,
            totalPolls: 0,
            totalVotes: 0,
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M+`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K+`;
    } else {
      return `${num}+`;
    }
  };

  if (loading) {
    return (
      <section className="mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 dark:border-gray-700/20 shadow-lg animate-pulse">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-2xl mx-auto mb-4"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 dark:border-gray-700/20 shadow-lg">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {stats ? formatNumber(stats.totalUsers) : "0+"}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 font-medium">Active Users</p>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 dark:border-gray-700/20 shadow-lg">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {stats ? formatNumber(stats.totalPolls) : "0+"}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 font-medium">Polls Created</p>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 dark:border-gray-700/20 shadow-lg">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {stats ? formatNumber(stats.totalVotes) : "0+"}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 font-medium">Votes Cast</p>
        </div>
      </div>
      
      {error && (
        <div className="text-center mt-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">{error}</p>
        </div>
      )}
    </section>
  );
});

export { Stats };
