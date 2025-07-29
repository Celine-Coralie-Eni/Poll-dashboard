"use client";

import { Navigation } from "@/components/Navigation";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Poll {
  id: string;
  title: string;
  description?: string;
  options: {
    id: string;
    text: string;
    _count: {
      votes: number;
    };
  }[];
  _count: {
    votes: number;
  };
}

export default function PollResultsPage() {
  const params = useParams();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pollId = params.id as string;

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const response = await fetch(`/api/polls/${pollId}`);
        if (!response.ok) {
          throw new Error("Poll not found");
        }
        const data = await response.json();
        setPoll(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch poll");
      } finally {
        setLoading(false);
      }
    };

    if (pollId) {
      fetchPoll();
    }
  }, [pollId]);

  const getOptionColor = (index: number) => {
    const colors = [
      "bg-primary",
      "bg-secondary",
      "bg-accent",
      "bg-info",
      "bg-success",
      "bg-warning",
      "bg-error",
      "bg-neutral",
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center">
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
    <div className="min-h-screen bg-base-200">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Navigation */}
          <Link href="/polls" className="btn btn-ghost mb-6">
            ← Back to Polls
          </Link>

          {/* Page Title */}
          <h1 className="text-3xl font-bold mb-8">
            Live Poll Results
          </h1>

          {/* Main Results Card */}
          <div className="card bg-base-100 shadow-xl">
            {/* Poll Header */}
            <div className="bg-primary px-8 py-6 rounded-t-2xl">
              <h2 className="text-2xl font-bold text-primary-content mb-2">
                {poll.title}
              </h2>
              <p className="text-primary-content/90">
                Total votes: {totalVotes} • Updated in real-time
              </p>
            </div>

            {/* Poll Results */}
            <div className="card-body">
              <div className="space-y-6">
                {poll.options.map((option, index) => {
                  const voteCount = option._count.votes;
                  const percentage =
                    totalVotes > 0
                      ? Math.round((voteCount / totalVotes) * 100)
                      : 0;
                  const colorClass = getOptionColor(index);

                  return (
                    <div key={option.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">{option.text}</span>
                        <span className="text-sm opacity-75">
                          {voteCount} votes ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-base-200 rounded-full h-4">
                        <div
                          className={`${colorClass} h-4 rounded-full transition-all duration-500 progress-animate`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t">
                <button
                  onClick={() => {
                    // Export functionality
                    const csvContent = [
                      "Option,Votes,Percentage",
                      ...poll.options.map((option) => {
                        const voteCount = option._count.votes;
                        const percentage =
                          totalVotes > 0
                            ? Math.round((voteCount / totalVotes) * 100)
                            : 0;
                        return `${option.text},${voteCount},${percentage}%`;
                      }),
                    ].join("\n");

                    const blob = new Blob([csvContent], { type: "text/csv" });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${poll.title
                      .replace(/[^a-z0-9]/gi, "_")
                      .toLowerCase()}_results.csv`;
                    a.click();
                    window.URL.revokeObjectURL(url);
                  }}
                  className="btn btn-primary flex-1"
                >
                  Export Results
                </button>
                <button
                  onClick={() => {
                    // Share functionality
                    navigator
                      .share?.({
                        title: poll.title,
                        text: `Check out this poll: ${poll.title}`,
                        url: window.location.href,
                      })
                      .catch(() => {
                        // Fallback: copy to clipboard
                        navigator.clipboard.writeText(window.location.href);
                        alert("Link copied to clipboard!");
                      });
                  }}
                  className="btn btn-secondary flex-1"
                >
                  Share Poll
                </button>
                <Link
                  href={`/polls/${pollId}`}
                  className="btn btn-accent flex-1"
                >
                  Back to Poll
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
