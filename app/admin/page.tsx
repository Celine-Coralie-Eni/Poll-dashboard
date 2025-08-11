"use client";

import { Navigation } from "@/components/Navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/Button";
import { 
  Users, 
  BarChart3, 
  Vote, 
  TrendingUp, 
  Plus, 
  Download, 
  Settings, 
  Eye,
  Edit,
  Trash2,
  ArrowRight,
  Activity
} from "lucide-react";
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
  const { t } = useTranslations();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [deletePollId, setDeletePollId] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        } else {
          console.error('Failed to fetch admin stats');
          setStats({
            totalUsers: 0,
            totalPolls: 0,
            totalVotes: 0,
            recentPolls: [],
          });
        }
      } catch (error) {
        console.error('Error fetching admin stats:', error);
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

  const handleDeletePoll = async (pollId: string) => {
    try {
      const response = await fetch(`/api/polls/${pollId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Refresh stats after deletion
        const statsResponse = await fetch('/api/admin/stats');
        if (statsResponse.ok) {
          const updatedStats = await statsResponse.json();
          setStats(updatedStats);
        }
      } else {
        console.error('Failed to delete poll');
      }
    } catch (error) {
      console.error('Error deleting poll:', error);
    }
  };

  if (!session || session.user?.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('accessDenied', 'Access Denied')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              {t('adminAccessRequired', 'You need admin privileges to access this page.')}
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              {t('backToHome', 'Back to Home')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">{t('loading', 'Loading...')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('adminDashboard', 'Admin Dashboard')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {t('adminDashboardDesc', 'Manage your polling platform and monitor activity')}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t('totalUsers', 'Total Users')}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats?.totalUsers || 0}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t('totalPolls', 'Total Polls')}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats?.totalPolls || 0}
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Vote className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t('totalVotes', 'Total Votes')}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats?.totalVotes || 0}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t('activePolls', 'Active Polls')}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats?.recentPolls?.length || 0}
                </p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <Activity className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Polls Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('recentPolls', 'Recent Polls')}
            </h2>
            <Link
              href="/polls/create"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('createPoll', 'Create Poll')}
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('pollTitle', 'Poll Title')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('created', 'Created')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('votes', 'Votes')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('actions', 'Actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {stats?.recentPolls?.map((poll) => (
                    <tr key={poll.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {poll.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-300">
                          {new Date(poll.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                          {poll._count.votes}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => window.open(`/polls/${poll.id}`, '_blank')}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors duration-200"
                            title={t('viewPoll', 'View Poll')}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePoll(poll.id)}
                            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 transition-colors duration-200"
                            title={t('deletePoll', 'Delete Poll')}
                          >
                            <Trash2 className="w-4 h-4" />
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

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/admin/analytics"
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {t('analytics', 'Analytics')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('viewDetailedAnalytics', 'View detailed analytics and insights')}
                </p>
              </div>
              <ArrowRight className="w-6 h-6 text-gray-400" />
            </div>
          </Link>

          <Link
            href="/admin/users"
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {t('manageUsers', 'Manage Users')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('manageUserAccounts', 'Manage user accounts and permissions')}
                </p>
              </div>
              <ArrowRight className="w-6 h-6 text-gray-400" />
            </div>
          </Link>

          <Link
            href="/polls/create"
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {t('createPoll', 'Create Poll')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('createNewPoll', 'Create a new poll for your users')}
                </p>
              </div>
              <ArrowRight className="w-6 h-6 text-gray-400" />
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
