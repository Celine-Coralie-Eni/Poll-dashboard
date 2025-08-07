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
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www
