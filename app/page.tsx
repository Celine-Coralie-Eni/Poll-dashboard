"use client";

import { Navigation } from "@/components/Navigation";
import { useTranslations } from "@/lib/tolgee-optimized";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HomePage() {
  const { t } = useTranslations();
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        duration: 0.8, 
        staggerChildren: 0.2 
      } 
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" as const }
    },
  };

  const buttonVariants = {
    hover: { 
      scale: 1.05, 
      boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 },
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section - Enhanced */}
      <section className="hero min-h-[80vh] bg-gradient-to-br from-primary via-primary to-primary-focus relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="hero-content text-center text-primary-content relative z-10">
          <motion.div 
            className="max-w-3xl"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Logo/Icon */}
            <motion.div 
              className="mb-8"
              variants={itemVariants}
            >
              <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 rounded-full backdrop-blur-sm border border-white/30">
                <span className="text-4xl">📊</span>
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.h1 
              className="text-6xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent"
              variants={itemVariants}
            >
              {t('poll_dashboard', 'Poll Dashboard')}
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              className="text-xl md:text-2xl mb-12 opacity-90 leading-relaxed"
              variants={itemVariants}
            >
              {t('create_manage_polls', 'Create and manage polls with real-time results')}
            </motion.p>

            {/* Action Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              variants={itemVariants}
            >
              <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                <Link href="/polls/create" className="btn btn-secondary btn-lg px-8 py-4 text-lg font-semibold shadow-lg">
                  <span className="mr-2">🚀</span>
                  {t('get_started', 'Get Started')}
                </Link>
              </motion.div>
              
              <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                <Link href="/polls" className="btn btn-outline btn-lg px-8 py-4 text-lg font-semibold border-2 border-white/50 text-white hover:bg-white hover:text-primary backdrop-blur-sm">
                  <span className="mr-2">👁️</span>
                  {t('view_polls', 'View Polls')}
                </Link>
              </motion.div>
            </motion.div>

            {/* Feature Highlights */}
            <motion.div 
              className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
              variants={itemVariants}
            >
              <div className="flex flex-col items-center p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
                <div className="text-3xl mb-2">⚡</div>
                <h3 className="font-semibold mb-1">Real-time Results</h3>
                <p className="text-sm opacity-80 text-center">See votes update instantly</p>
              </div>
              
              <div className="flex flex-col items-center p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
                <div className="text-3xl mb-2">🔒</div>
                <h3 className="font-semibold mb-1">Secure Voting</h3>
                <p className="text-sm opacity-80 text-center">Protected against duplicates</p>
              </div>
              
              <div className="flex flex-col items-center p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
                <div className="text-3xl mb-2">📱</div>
                <h3 className="font-semibold mb-1">Mobile Friendly</h3>
                <p className="text-sm opacity-80 text-center">Works on all devices</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
