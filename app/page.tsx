"use client";

import { Navigation } from "@/components/Navigation";

export default function HomePage() {
  console.log('HomePage rendering - minimal version');

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Home Page Test
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-4">
          If you can see this, the basic rendering is working.
        </p>
      </div>
    </div>
  );
}
