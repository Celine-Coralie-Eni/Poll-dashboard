import Link from "next/link";
import { dbUtils } from "@/lib/db-optimized";
import { Session } from "next-auth";

interface PollOption {
  id: string;
  text: string;
  _count: { votes: number };
}

interface Poll {
  id: string;
  title: string;
  options?: PollOption[];
  _count: { votes: number };
}

interface PollsListProps {
  session: Session | null;
}

export async function PollsList({ session }: PollsListProps) {
  const polls: Poll[] = await dbUtils.findManyPolls(20, 0);

  if (polls.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📊</div>
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">No polls found</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          No polls have been created yet. Be the first to create one!
        </p>
        {session ? (
          <Link href="/polls/create" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200">
            Create Your First Poll
          </Link>
        ) : (
          <Link href="/auth/login" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200">
            Login to Create Polls
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {polls.map((poll: Poll) => (
        <div key={poll.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-shadow duration-200">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{poll.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {poll.options?.length || 0} options
              {session && (
                <> • {poll._count.votes} votes</>
              )}
            </p>

            <div className="flex justify-end gap-3 pt-4">
              <Link
                href={`/polls/${poll.id}`}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Vote
              </Link>
              {session && poll._count.votes > 0 && (
                <Link
                  href={`/polls/${poll.id}/results`}
                  className="inline-flex items-center px-4 py-2 bg-gray-600 dark:bg-gray-700 text-white text-sm font-medium rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  View Results
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
