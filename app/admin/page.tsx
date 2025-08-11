"use client";

import { Navigation } from "@/components/Navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, easeOut } from "framer-motion";
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: easeOut
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: easeOut
    }
  },
  hover: {
    scale: 1.02,
    y: -5,
    transition: {
      duration: 0.2
    }
  }
};

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

  // Redirect if not admin
  if (session?.user?.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Navigation />
        <motion.div 
          className="container mx-auto px-4 py-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center max-w-md mx-auto">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Settings className="w-10 h-10 text-red-500" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('access_denied', 'Access Denied')}</h1>
            <p className="text-gray-600 mb-6">
              {t('admin_privileges_required', 'You need admin privileges to access this page.')}
            </p>
            <Link href="/">
              <Button className="inline-flex items-center">
                {t('go_home', 'Go Home')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Navigation />
        <motion.div 
          className="container mx-auto px-4 py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-center items-center min-h-[60vh]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full"
            />
          </div>
        </motion.div>
      </div>
    );
  }

  // Delete poll handler
  const handleDeletePoll = async (pollId: string) => {
    try {
      const res = await fetch(`/api/polls/${pollId}`, { method: 'DELETE' });
      if (res.ok) {
        setStats((prev) => prev ? { ...prev, recentPolls: prev.recentPolls.filter(p => p.id !== pollId) } : prev);
      }
    } catch (e) {
      // Optionally show error
    } finally {
      setDeletePollId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navigation />

      <motion.main 
        className="container mx-auto px-4 py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            {t('admin_dashboard', 'Admin Dashboard')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t('manage_platform_desc', 'Manage your poll platform, monitor user activity, and analyze engagement metrics')}
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
        >
          <motion.div
            variants={cardVariants}
            whileHover="hover"
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('total_users', 'Total Users')}</h3>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats?.totalUsers || 0}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{t('active_platform_users', 'Active platform users')}</p>
          </motion.div>

          <motion.div
            variants={cardVariants}
            whileHover="hover"
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('total_polls', 'Total Polls')}</h3>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats?.totalPolls || 0}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{t('created_polls', 'Created polls')}</p>
          </motion.div>

          <motion.div
            variants={cardVariants}
            whileHover="hover"
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center">
                <Vote className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('total_votes', 'Total Votes')}</h3>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats?.totalVotes || 0}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{t('cast_votes', 'Cast votes')}</p>
          </motion.div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants} className="mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <Activity className="w-6 h-6 mr-3 text-blue-600 dark:text-blue-400" />
              {t('quick_actions', 'Quick Actions')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/polls/create" className="block p-4 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-xl border border-blue-200 dark:border-blue-800 transition-colors duration-200 group">
                  <Plus className="w-8 h-8 text-blue-600 dark:text-blue-300 mb-3 group-hover:scale-110 transition-transform duration-200" />
                  <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-1">{t('create_poll', 'Create Poll')}</h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300/80">{t('start_new_poll', 'Start a new poll')}</p>
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" className="w-full text-left p-4 bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 rounded-xl border border-purple-200 dark:border-purple-800 group justify-start">
                  <div>
                    <Download className="w-8 h-8 text-purple-600 dark:text-purple-300 mb-3 group-hover:scale-110 transition-transform duration-200" />
                    <h3 className="font-semibold text-purple-900 dark:text-purple-200 mb-1">{t('export_results', 'Export Data')}</h3>
                    <p className="text-sm text-purple-700 dark:text-purple-300/80">{t('download_results', 'Download results')}</p>
                  </div>
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/admin/users" className="block p-4 bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 rounded-xl border border-green-200 dark:border-green-800 transition-colors duration-200 group">
                  <Users className="w-8 h-8 text-green-600 dark:text-green-300 mb-3 group-hover:scale-110 transition-transform duration-200" />
                  <h3 className="font-semibold text-green-900 dark:text-green-200 mb-1">{t('manage_users', 'Manage Users')}</h3>
                  <p className="text-sm text-green-700 dark:text-green-300/80">{t('user_administration', 'User administration')}</p>
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/admin/analytics" className="block p-4 bg-orange-50 dark:bg-orange-900/30 hover:bg-orange-100 dark:hover:bg-orange-900/50 rounded-xl border border-orange-200 dark:border-orange-800 transition-colors duration-200 group">
                  <BarChart3 className="w-8 h-8 text-orange-600 dark:text-orange-300 mb-3 group-hover:scale-110 transition-transform duration-200" />
                  <h3 className="font-semibold text-orange-900 dark:text-orange-200 mb-1">{t('analytics', 'Analytics')}</h3>
                  <p className="text-sm text-orange-700 dark:text-orange-300/80">{t('view_insights', 'View insights')}</p>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Recent Polls */}
        <motion.div variants={itemVariants}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-8 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                <BarChart3 className="w-6 h-6 mr-3 text-blue-600 dark:text-blue-400" />
                {t('recent_polls', 'Recent Polls')}
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">{t('title', 'Title')}</th>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">{t('created', 'Created')}</th>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">{t('votes', 'Votes')}</th>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">{t('actions', 'Actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  <AnimatePresence>
                    {stats?.recentPolls.map((poll, index) => (
                      <motion.tr
                        key={poll.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        className="transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <td className="px-8 py-4">
                          <div className="font-medium text-gray-900 dark:text-gray-100">{poll.title}</div>
                        </td>
                        <td className="px-8 py-4 text-gray-600 dark:text-gray-300">
                          {new Date(poll.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-8 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {poll._count.votes} votes
                          </span>
                        </td>
                        <td className="px-8 py-4">
                          <div className="flex space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors duration-200"
                              onClick={() => window.location.href = `/polls/${poll.id}`}
                              title={t('view_poll', 'View Poll')}
                            >
                              <Eye className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors duration-200"
                              onClick={() => setDeletePollId(poll.id)}
                              title={t('delete_poll', 'Delete Poll')}
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
              {(!stats?.recentPolls || stats.recentPolls.length === 0) && (
                <div className="text-center py-12">
                  <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">{t('no_polls_created_yet', 'No polls created yet')}</p>
                  <p className="text-gray-400">{t('create_your_first_poll', 'Create your first poll to get started')}</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.main>

      {/* Delete Confirmation Modal */}
      {deletePollId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{t('delete_poll_title', 'Delete Poll')}</h2>
            <p className="mb-6 text-gray-700 dark:text-gray-300">{t('delete_poll_confirmation', 'Are you sure you want to delete this poll? This action cannot be undone.')}</p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                onClick={() => setDeletePollId(null)}
              >
                {t('cancel', 'Cancel')}
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                onClick={() => handleDeletePoll(deletePollId)}
              >
                {t('delete', 'Delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
