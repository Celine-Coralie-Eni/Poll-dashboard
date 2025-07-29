"use client";

import { Navigation } from "@/components/Navigation";
import Link from "next/link";
import { useTranslations } from "@/lib/tolgee-optimized";

export default function HomePage() {
  const { t } = useTranslations();

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="hero min-h-[60vh] bg-primary">
        <div className="hero-content text-center text-primary-content">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-6">
              {t('heroTitle')}
            </h1>
            <p className="text-xl mb-8 opacity-90">
              {t('heroSubtitle')}
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/polls/create" className="btn btn-secondary btn-lg">
                {t('getStarted')}
              </Link>
              <Link href="/polls" className="btn btn-outline btn-lg text-primary-content border-primary-content hover:bg-primary-content hover:text-primary">
                {t('viewPolls')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-base-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t('features')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body text-center">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="card-title justify-center">{t('createPolls')}</h3>
                <p>Create engaging polls with multiple options and real-time results</p>
              </div>
            </div>
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body text-center">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="card-title justify-center">{t('realTimeResults')}</h3>
                <p>See results update instantly as votes come in with beautiful visualizations</p>
              </div>
            </div>
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body text-center">
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="card-title justify-center">{t('secureVoting')}</h3>
                <p>Secure voting system with duplicate vote prevention and session tracking</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
          <p className="text-lg mb-8 opacity-75">
            Create your first poll and start collecting responses from your audience.
          </p>
          <Link href="/polls/create" className="btn btn-primary btn-lg">
            {t('createPoll')}
          </Link>
        </div>
      </section>
    </div>
  );
}
