"use client";

import { Navigation } from "@/components/Navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { motion, easeOut } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  ArrowRight, 
  BarChart3, 
  Users, 
  Shield, 
  Zap, 
  Star,
  CheckCircle,
  TrendingUp
} from "lucide-react";
import { useTranslations } from "@/lib/tolgee-optimized";

const features = [
  {
    icon: BarChart3,
    titleKey: "create_polls",
    descriptionKey: "create_polls_desc",
    color: "blue"
  },
  {
    icon: Zap,
    titleKey: "real_time_results",
    descriptionKey: "real_time_results_desc",
    color: "purple"
  },
  {
    icon: Shield,
    titleKey: "secure_voting",
    descriptionKey: "secure_voting_desc",
    color: "green"
  }
];

const stats = [
  { labelKey: "active_users", value: "Loading...", icon: Users, key: "users" },
  { labelKey: "polls_created", value: "Loading...", icon: BarChart3, key: "polls" },
  { labelKey: "votes_cast", value: "Loading...", icon: TrendingUp, key: "votes" }
];

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
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
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
      duration: 0.5,
      ease: easeOut
    }
  },
  hover: {
    scale: 1.05,
    y: -10,
    transition: {
      duration: 0.2
    }
  }
};

export default function HomePage() {
  const { t } = useTranslations();
  const { data: session } = useSession();
  const [realStats, setRealStats] = useState(stats);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    // Check if this is the initial page load (not navigation from other pages)
    const hasVisited = sessionStorage.getItem('hasVisitedHome');
    
    if (hasVisited) {
      // User has been here before, no animations
      setIsInitialLoad(false);
    } else {
      // First time visiting, mark as visited and show animations
      sessionStorage.setItem('hasVisitedHome', 'true');
      setIsInitialLoad(true);
    }
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats');
        if (response.ok) {
          const data = await response.json();
          setRealStats([
            { ...stats[0], value: `${data.totalUsers}+` },
            { ...stats[1], value: `${data.totalPolls}+` },
            { ...stats[2], value: `${data.totalVotes}+` }
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        // Keep the loading state if fetch fails
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation />
      
      <motion.main
        className="container mx-auto px-4 py-8"
        variants={isInitialLoad ? containerVariants : undefined}
        initial={isInitialLoad ? "hidden" : "visible"}
        animate="visible"
      >
        {/* Hero Section */}
        <motion.section 
          variants={isInitialLoad ? itemVariants : undefined}
          className="text-center mb-20"
        >
          <motion.div
            initial={isInitialLoad ? { scale: 0.8, opacity: 0 } : { scale: 1, opacity: 1 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={isInitialLoad ? { duration: 0.8, ease: easeOut } : { duration: 0 }}
            className="mb-8"
          >
            <h1 className="text-6xl md:text-7xl font-bold text-center mb-6 leading-relaxed">
              <div className="flex flex-col items-center justify-center gap-2">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-blue-400 dark:via-purple-400 dark:to-blue-600 bg-clip-text text-transparent leading-tight">
                  {t('create_manage_polls')}
                </span>
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent leading-tight pb-2">
                  {t('polls')}
                </span>
              </div>
            </h1>
          </motion.div>
          
          <motion.p
            initial={isInitialLoad ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={isInitialLoad ? { delay: 0.3, duration: 0.6 } : { duration: 0 }}
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            {t('build_polls', 'Build engaging polls with real-time results, beautiful visualizations, and secure voting. Perfect for teams, events, and community engagement.')}
          </motion.p>
          
          <motion.div
            initial={isInitialLoad ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={isInitialLoad ? { delay: 0.5, duration: 0.6 } : { duration: 0 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            {session ? (
              <Link
                href="/polls/create"
                className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 flex items-center"
              >
                {t('create_your_first_poll', 'Create Your First Poll')}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/register"
                  className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 flex items-center"
                >
                  {t('get_started', 'Get Started')}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
                <Link
                  href="/auth/login"
                  className="px-8 py-4 rounded-2xl font-semibold text-lg border-2 border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600 transition-all duration-300"
                >
                  {t('sign_in', 'Sign In')}
                </Link>
              </>
            )}
          </motion.div>
        </motion.section>

        {/* Stats Section */}
        <motion.section 
          variants={isInitialLoad ? itemVariants : undefined}
          className="mb-20"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {realStats.map((stat, index) => (
              <motion.div
                key={stat.labelKey}
                variants={isInitialLoad ? cardVariants : undefined}
                whileHover="hover"
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 dark:border-gray-700/20 shadow-lg"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</h3>
                <p className="text-gray-600 dark:text-gray-300 font-medium">{t(stat.labelKey)}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section 
          variants={isInitialLoad ? itemVariants : undefined}
          className="mb-20"
        >
          <motion.div
            initial={isInitialLoad ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={isInitialLoad ? { delay: 0.8, duration: 0.6 } : { duration: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {t('why_choose_pollvault')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('built_with_modern_technology')}
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.titleKey}
                variants={isInitialLoad ? cardVariants : undefined}
                whileHover="hover"
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20 dark:border-gray-700/20 shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className={`w-16 h-16 bg-gradient-to-br from-${feature.color}-100 to-${feature.color}-200 dark:from-${feature.color}-900 dark:to-${feature.color}-800 rounded-2xl flex items-center justify-center mb-6`}>
                  <feature.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t(feature.titleKey)}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{t(feature.descriptionKey)}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          variants={isInitialLoad ? itemVariants : undefined}
          className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white"
        >
          <motion.div
            initial={isInitialLoad ? { scale: 0.9, opacity: 0 } : { scale: 1, opacity: 1 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={isInitialLoad ? { delay: 1, duration: 0.6 } : { duration: 0 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              {t('ready_to_get_started')}
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto text-white">
              {t('join_thousands_of_users')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {session ? (
                <Link
                  href="/polls/create"
                  className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 flex items-center"
                >
                  {t('create_poll_now')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/auth/register"
                    className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 flex items-center"
                  >
                    {t('start_creating_polls')}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                  <Link
                    href="/polls"
                    className="border-2 border-white text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300"
                  >
                    {t('browse_polls')}
                  </Link>
                </>
              )}
        </div>
          </motion.div>
        </motion.section>
      </motion.main>
    </div>
  );
}
