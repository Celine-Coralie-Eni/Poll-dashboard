"use client";

import { Navigation } from "@/components/Navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "@/lib/tolgee-optimized";

interface Stats {
  totalUsers: number;
  totalPolls: number;
  totalVotes: number;
  recentPolls: Array<{
    id: string;
    title: string;
    createdAt: string;
    _count: { votes: number };
  }>;
}

export default function AdminPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslations();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        } else {
          console.error('Failed to fetch admin stats');
          // Fallback to empty stats if API fails
          setStats({
            totalUsers: 0,
            totalPolls: 0,
            totalVotes: 0,
            recentPolls: [],
          });
        }
      } catch (error) {
        console.error('Error fetching admin stats:', error);
        // Fallback to empty stats if API fails
        setStats({
          totalUsers: 0,
          totalPolls: 0,
          totalVotes: 0,
          recentPolls: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Redirect if not admin
  if (session?.user?.role !== "ADMIN") {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">{t("access_denied")}</h1>
            <p className="mb-4">
              {t("need_admin_privileges")}
            </p>
            <Link href="/" className="btn btn-primary">
              {t("go_home")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[50vh]">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">{t("admin_dashboard")}</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body text-center">
              <div className="text-4xl mb-2">👥</div>
              <h3 className="card-title justify-center">{t("total_users")}</h3>
              <p className="text-3xl font-bold text-primary">
                {stats?.totalUsers}
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body text-center">
              <div className="text-4xl mb-2">📊</div>
              <h3 className="card-title justify-center">{t("total_polls")}</h3>
              <p className="text-3xl font-bold text-primary">
                {stats?.totalPolls}
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body text-center">
              <div className="text-4xl mb-2">🗳️</div>
              <h3 className="card-title justify-center">{t("total_votes")}</h3>
              <p className="text-3xl font-bold text-primary">
                {stats?.totalVotes}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-6">{t("quick_actions")}</h2>
            <div className="flex flex-wrap gap-4">
              <Link href="/polls/create" className="btn btn-primary">
                {t("create_new_poll")}
              </Link>
              <button
                className="btn btn-outline"
                onClick={() => window.open('/api/admin/api/export?format=csv', '_blank')}
              >
                {t("export_results")}
              </button>
              <Link href="/admin/users" className="btn btn-outline">
                {t("manage_users")}
              </Link>
              <Link href="/admin/analytics" className="btn btn-outline">
                {t("view_analytics")}
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Polls */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-6">{t("recent_polls")}</h2>
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>{t("title")}</th>
                    <th>{t("created")}</th>
                    <th>{t("votes")}</th>
                    <th>{t("actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentPolls.map((poll) => (
                    <tr key={poll.id}>
                      <td className="font-medium">{poll.title}</td>
                      <td>{new Date(poll.createdAt).toLocaleDateString()}</td>
                      <td>{poll._count.votes}</td>
                      <td>
                        <div className="flex gap-2">
                          <Link
                            href={`/polls/${poll.id}`}
                            className="btn btn-sm btn-outline"
                          >
                            {t("view")}
                          </Link>
                          <button className="btn btn-sm btn-outline">
                            {t("edit")}
                          </button>
                          <button className="btn btn-sm btn-error">
                            {t("delete")}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
