"use client";

import { Navigation } from "@/components/Navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";

interface AnalyticsData {
  overview: {
    totalUsers: number;
    totalPolls: number;
    totalVotes: number;
    activePolls: number;
    recentActivity: number;
  };
  topPolls: Array<{
    id: string;
    title: string;
    votes: number;
    createdAt: string;
  }>;
  growth: {
    newUsersLast30Days: number;
  };
}

export const dynamic = "force-dynamic";
export default function AnalyticsPage() {
  const { data: session } = useSession();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch("/api/admin/analytics", {
          cache: "no-store",
        });

        if (response.ok) {
          const data = await response.json();
          setAnalytics(data);
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);


  if (session?.user?.role !== "ADMIN") {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="mb-4">You need admin privileges to access this page.</p>
            
<Link href="/" className="btn btn-primary">Go Home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
          <Link href="/admin" className="inline-flex items-center px-4 py-2 border-2 border-gray-300 text-gray-700 dark:text-gray-300 dark:border-gray-600 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">Back to Dashboard</Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[50vh]">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : analytics ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 text-center">
                <div className="text-3xl mb-2">👥</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Total Users</h3>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{analytics.overview.totalUsers}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 text-center">
                <div className="text-3xl mb-2">📊</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Total Polls</h3>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{analytics.overview.totalPolls}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 text-center">
                <div className="text-3xl mb-2">🗳️</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Total Votes</h3>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{analytics.overview.totalVotes}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 text-center">
                <div className="text-3xl mb-2">✅</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Active Polls</h3>
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{analytics.overview.activePolls}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 text-center">
                <div className="text-3xl mb-2">📈</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">New Users (30d)</h3>
                <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{analytics.growth.newUsersLast30Days}</p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Top Polls by Votes</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Poll Title</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Total Votes</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Created Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.topPolls.map((poll, index) => (
                      <tr key={poll.id} className={`${index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'} border-b border-gray-200 dark:border-gray-700`}>
                          <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{poll.title}</td>
                        <td className="py-3 px-4 text-gray-900 dark:text-white">{poll.votes}</td>
                        <td className="py-3 px-4 text-gray-900 dark:text-white">{poll.createdAt ? new Date(poll.createdAt).toLocaleDateString() : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center">
            <p className="text-gray-900 dark:text-white">Failed to load analytics data.</p>
          </div>
        )}
      </main>
    </div>
  );
}