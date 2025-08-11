"use client";

import { Navigation } from "@/components/Navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "@/lib/tolgee-optimized";

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

export default function PollPage() {
  const { data: session } = useSession();
  const params = useParams();
  const pollId = params.id as string;
  const { t } = useTranslations();

  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchPoll();
  }, [pollId, session?.user?.id]);

  const fetchPoll = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/polls/${pollId}`);
      if (!response.ok) {
        throw new Error("Poll not found");
      }
      const data = await response.json();
      setPoll(data);

      // Check if current user has already voted for this poll
      if (session?.user?.id) {
        const voteCheckResponse = await fetch(`/api/polls/${pollId}/vote-check`);
        if (voteCheckResponse.ok) {
          const voteData = await voteCheckResponse.json();
          setHasVoted(voteData.hasVoted);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch poll");
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async () => {
    if (!selectedOption) {
      setError("Please select an option");
      return;
    }

    setVoting(true);
    setError(null);

    try {
      const response = await fetch(`/api/polls/${pollId}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          optionId: selectedOption,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit vote");
      }

      setHasVoted(true);
      // Refresh poll data to show updated results
      await fetchPoll();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit vote");
    } finally {
      setVoting(false);
    }
  };

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

  if (error || !poll) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold mb-4">Poll Not Found</h1>
            <p className="mb-4">
              {error || "The poll you're looking for doesn't exist."}
            </p>
            <Link href="/polls" className="btn btn-primary">
              Back to Polls
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const totalVotes = poll._count.votes;

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Poll Header */}
          <div className="mb-8">
            <Link href="/polls" className="btn btn-ghost mb-4">
              ← Back to Polls
            </Link>
            <h1 className="text-4xl font-bold mb-4">{poll.title}</h1>
            <div className="flex items-center gap-4 text-sm opacity-75">
              <span>
                Created: {new Date(poll.createdAt).toLocaleDateString()}
              </span>
              <span>•</span>
              <span>{poll.options.length} options</span>
              {session && (
                <>
                  <span>•</span>
                  <span>{totalVotes} votes</span>
                </>
              )}
            </div>
          </div>

          {error && (
            <div className="alert alert-error mb-6">
              <span>{error}</span>
            </div>
          )}

          {/* Voting Interface */}
          {!hasVoted && poll.isActive && (
            <div className="card bg-base-100 shadow-xl mb-8">
              <div className="card-body">
                <h2 className="card-title text-xl mb-4">Cast Your Vote</h2>
                <div className="space-y-3">
                  {poll.options.map((option) => (
                    <label
                      key={option.id}
                      className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-base-200 transition-colors"
                    >
                      <input
                        type="radio"
                        name="vote"
                        value={option.id}
                        checked={selectedOption === option.id}
                        onChange={(e) => setSelectedOption(e.target.value)}
                        className="radio radio-primary"
                      />
                      <span className="flex-1">{option.text}</span>
                    </label>
                  ))}
                </div>
                <div className="card-actions justify-end mt-6">
                  <button
                    onClick={handleVote}
                    disabled={!selectedOption || voting}
                    className="btn btn-primary"
                  >
                    {voting ? (
                      <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                      "Submit Vote"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              {!session ? (
                <div className="text-center py-8">
                  <h2 className="card-title text-xl mb-4">{t('results_restricted', 'Results Restricted')}</h2>
                  <p className="text-lg mb-4">{t('login_to_see_results', 'Login to see poll results and insights')}</p>
                  <div className="flex gap-4 justify-center">
                    <Link href="/auth/login" className="btn btn-primary">
                      {t('login', 'Login')}
                    </Link>
                    <Link href="/auth/register" className="btn btn-secondary">
                      {t('sign_up', 'Sign Up')}
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="card-title text-xl mb-6">
                    {hasVoted ? "Results" : "Current Results"}
                  </h2>

                  <div className="space-y-4">
                    {poll.options.map((option) => {
                      const percentage =
                        totalVotes > 0
                          ? Math.round((option._count.votes / totalVotes) * 100)
                          : 0;

                      return (
                        <div key={option.id} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{option.text}</span>
                            <span className="text-sm opacity-75">
                              {option._count.votes} votes ({percentage}%)
                            </span>
                          </div>
                          <div className="w-full bg-base-200 rounded-full h-3">
                            <div
                              className="bg-primary h-3 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {session && (
                <div className="mt-6 pt-6 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm opacity-75">
                      Total votes: {totalVotes}
                    </span>
                    <div className="flex gap-2">
                      {totalVotes > 0 && (
                        <Link
                          href={`/polls/${pollId}/results`}
                          className="btn btn-secondary btn-sm"
                        >
                          View Full Results
                        </Link>
                      )}
                      {session?.user?.role === "ADMIN" && (
                        <>
                          <button
                            className="btn btn-error btn-sm"
                            onClick={() => setShowDeleteModal(true)}
                          >
                            Delete Poll
                          </button>
                          {showDeleteModal && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg w-full max-w-md">
                                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Delete Poll</h2>
                                <p className="mb-6 text-gray-700 dark:text-gray-300">Are you sure you want to delete this poll? This action cannot be undone.</p>
                                <div className="flex justify-end space-x-4">
                                  <button
                                    className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                                    onClick={() => setShowDeleteModal(false)}
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                                    onClick={async () => {
                                      const res = await fetch(`/api/polls/${pollId}`, { method: "DELETE" });
                                      if (res.ok) {
                                        window.location.href = "/polls";
                                      } else {
                                        alert("Failed to delete poll.");
                                      }
                                    }}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
 