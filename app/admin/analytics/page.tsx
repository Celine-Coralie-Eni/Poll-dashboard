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

export default function AnalyticsPage() {
  const { data: session } = useSession();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/admin/analytics');
        if (response.ok) {
          const data = await response.json();
          setAnalytics(data);
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
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
    <div className="min-h-screen">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Analytics Dashboard</h1>
          <Link href="/admin" className="btn btn-outline">Back to Dashboard</Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[50vh]">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : analytics ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body text-center">
                  <div className="text-3xl mb-2">👥</div>
                  <h3 className="card-title justify-center">Total Users</h3>
                  <p className="text-3xl font-bold text-primary">{analytics.overview.totalUsers}</p>
                </div>
              </div>
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body text-center">
                  <div className="text-3xl mb-2">📊</div>
                  <h3 className="card-title justify-center">Total Polls</h3>
                  <p className="text-3xl font-bold text-primary">{analytics.overview.totalPolls}</p>
                </div>
              </div>
              <div className="card bg
-base-100 shadow-xl">
                <div className="card-body text-center">
                  <div className="text-3xl mb-2">🗳️</div>
                  <h3 className="card-title justify-center">Total Votes</h3>
                  <p className="text-3xl font-bold text-primary">{analytics.overview.totalVotes}</p>
                </div>
              </div>
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body text-center">
                  <div className="text-3xl mb-2">✅</div>
                  <h3 className="card-title justify-center">Active Polls</h3>
                  <p className="text-3xl font-bold text-primary">{analytics.overview.activePolls}</p>
                </div>
              </div>
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body text-center">
                  <div className="text-3xl mb-2">📈</div>
                  <h3 className="card-title justify-center">New Users (30d)</h3>
                  <p className="text-3xl font-bold text-primary">{analytics.growth.newUsersLast30Days}</p>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-6">Top Polls by Votes</h2>
                <div className="overflow-x-auto">
                  <table className="table table-zebra">
                    <thead>
                      <tr>
                        <th>Poll Title</th>
                        <th>Total Votes
</th>
                        <th>Created Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.topPolls.map((poll) => (
                        <tr key={poll.id}>
                          <td className="font-medium">{poll.title}</td>
                          <td>{poll.votes}</td>
                          <td>{new Date(poll.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center">
            <p>Failed to load analytics data.</p>
          </div>
        )}
      </main>
    </div>
  );
}