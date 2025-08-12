import { Navigation } from "@/components/Navigation";
import Link from "next/link";
import { Suspense } from "react";
import { PollsList } from "./PollsList";
import { getServerSession } from "next-auth";
import { getAuthOptions } from "@/lib/auth";
import { PollCardSkeleton } from "@/components/LoadingSkeleton";

export default async function PollsPage() {
  const authOptions = await getAuthOptions();
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Polls</h1>
          {session && (
            <Link href="/polls/create" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200">
              Create Poll
            </Link>
          )}
        </div>

        <Suspense fallback={<PollCardSkeleton />}>
          <PollsList session={session} />
        </Suspense>
      </main>
    </div>
  );
}
 