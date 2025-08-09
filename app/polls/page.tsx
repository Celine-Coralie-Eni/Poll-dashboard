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
          <h1 className="text-4xl font-bold">{t('polls', 'Polls')}</h1>
          {session && (
            <Link href="/polls/create" className="btn btn-primary">
              {t('create_poll', 'Create Poll')}
            </Link>
          )}
        </div>

        {polls.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-bold mb-4">{t('no_polls_found', 'No polls found')}</h2>
            <p className="text-lg opacity-75 mb-8">
              {t('no_polls_created_yet', 'No polls have been created yet. Be the first to create one!')}
            </p>
            {session ? (
              <Link href="/polls/create" className="btn btn-primary">
                {t('create_your_first_poll', 'Create Your First Poll')}
              </Link>
            ) : (
              <Link href="/auth/login" className="btn btn-primary">
                {t('login_to_create_polls', 'Login to Create Polls')}
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {polls.map((poll) => (
              <div key={poll.id} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title">{poll.title}</h3>
                  <p className="text-sm opacity-75">
                    {poll.options.length} {t('options', 'options')} • {poll._count.votes} {t('votes', 'votes')}
                  </p>

                  {/* Show top 3 options with percentages */}
                  <div className="space-y-2 mt-4">
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
                          className="flex items-center gap-2"
                        >
                          <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1">
                              <span>{option.text}</span>
                              <span>{percentage}%</span>
                            </div>
                            <div className="w-full bg-base-200 rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {poll.options.length > 3 && (
                      <p className="text-sm opacity-75">
                        +{poll.options.length - 3} {t('more_options', 'more options')}
                      </p>
                    )}
                  </div>

                  <div className="card-actions justify-end mt-4">
                    <Link
                      href={`/polls/${poll.id}`}
                      className="btn btn-primary btn-sm"
                    >
                      {t('vote', 'Vote')}
                    </Link>
                    {poll._count.votes > 0 && (
                      <Link
                        href={`/polls/${poll.id}/results`}
                        className="btn btn-secondary btn-sm"
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
 