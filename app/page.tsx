"use client";

import { Navigation } from "@/components/Navigation";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-4">Poll Dashboard</h1>
        <p className="mb-6 text-base-content/80">
          Create polls and collect votes in real time.
        </p>
        <div className="flex gap-4">
          <Link href="/polls" className="btn btn-primary">
            Browse Polls
          </Link>
          <Link href="/polls/create" className="btn btn-secondary">
            Create Poll
          </Link>
        </div>
      </main>
    </div>
  );
}
