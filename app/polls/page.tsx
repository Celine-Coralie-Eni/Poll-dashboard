"use client";

import { Navigation } from "@/components/Navigation";
import { useTranslations } from "@/lib/tolgee-optimized";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface Poll {
  id: string;
  title: string;
  isActive: boolean;
  createdAt: string;
  options: Array<{
    id: string;
    text: string;
    _count: {
      votes: number;
    };
  }>;
  _count: {
    votes: number;
  };
}

export default function PollsPage() {
  const { data: session } = useSession();
  const { t } = useTranslations();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/polls");
      if (!response.ok) {
        throw new Error(t('failed_to_fetch_polls', 'Failed to fetch polls'));
      }
      const data = await response.json();
      setPolls(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('an_error_occurred', 'An error occurred'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[50vh]">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="alert alert-error">
            <span>{error}</span>
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
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{t('polls', 'Polls')}</h1>
          {session && (
            <Link href="/polls/create" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200">
              {t('create_poll', 'Create Poll')}
            </Link>
          )}
        </div>

        {polls.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{t('no_polls_found', 'No polls found')}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              {t('no_polls_created_yet', 'No polls have been created yet. Be the first to create one!')}
            </p>
            {session ? (
              <Link href="/polls/create" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200">
                {t('create_your_first_poll', 'Create Your First Poll')}
              </Link>
            ) : (
              <Link href="/auth/login" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200">
                {t('login_to_create_polls', 'Login to Create Polls')}
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {polls.map((poll) => (
              <div key={poll.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-shadow duration-200">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{poll.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {poll.options.length} {t('options', 'options')}
                    {session && (
                      <> • {poll._count.votes} {t('votes', 'votes')}</>
                    )}
                  </p>

                  {/* Show top 3 options with percentages only for logged-in users */}
                  {session && (
                    <div className="space-y-3">
                      {poll.options.slice(0, 3).map((option) => {
                        const percentage =
                          poll._count.votes > 0
                            ? Math.round(
                                (option._count.votes / poll._count.votes) * 100
                              )
                            : 0;

                        return (
                          <div
                            key={option.id}
                            className="space-y-2"
                          >
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-900 dark:text-white">{option.text}</span>
                              <span className="text-gray-600 dark:text-gray-400 font-medium">{percentage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}

                      {poll.options.length > 3 && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          +{poll.options.length - 3} {t('more_options', 'more options')}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex justify-end gap-3 pt-4">
                    <Link
                      href={`/polls/${poll.id}`}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      {t('vote', 'Vote')}
                    </Link>
                    {session && poll._count.votes > 0 && (
                      <Link
                        href={`/polls/${poll.id}/results`}
                        className="inline-flex items-center px-4 py-2 bg-gray-600 dark:bg-gray-700 text-white text-sm font-medium rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors duration-200"
                      >
                        {t('view_results', 'View Results')}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
 