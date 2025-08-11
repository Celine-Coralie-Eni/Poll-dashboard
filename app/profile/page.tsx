"use client";

import { Navigation } from "@/components/Navigation";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userStats, setUserStats] = useState({
    pollsCreated: 0,
    votesCast: 0,
    createdAt: null as string | null,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch(`/api/admin/users/${session.user.id}`);
          if (response.ok) {
            const data = await response.json();
            setUserStats({
              pollsCreated: data.pollsCreated || 0,
              votesCast: data.votesCast || 0,
              createdAt: data.createdAt || null,
            });
          }
        } catch (error) {
          console.error('Failed to fetch user stats:', error);
        }
      }
    };
    fetchUserStats();
  }, [session]);

  // Helper to refetch stats (can be called after poll/vote creation)
  const refetchUserStats = async () => {
    if (session?.user?.id) {
      try {
        const response = await fetch(`/api/admin/users/${session.user.id}`);
        if (response.ok) {
          const data = await response.json();
          setUserStats({
            pollsCreated: data.pollsCreated || 0,
            votesCast: data.votesCast || 0,
            createdAt: data.createdAt || null,
          });
        }
      } catch (error) {
        console.error('Failed to refetch user stats:', error);
      }
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
            <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
              Profile
            </h1>

            <div className="space-y-6">
              {/* Profile Information */}
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Account Information
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Name:</span>
                    <span className="text-gray-900 dark:text-white">{session.user?.name || "Not provided"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Email:</span>
                    <span className="text-gray-900 dark:text-white">{session.user?.email}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Role:</span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {(session as any)?.user?.role || "User"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Account Status:</span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Active
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => router.push("/polls")}
                    className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    View Polls
                  </button>
                  <button
                    onClick={() => router.push("/polls/create")}
                    className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Create Poll
                  </button>
                  {(session as any)?.user?.role === "ADMIN" && (
                    <button
                      onClick={() => router.push("/admin")}
                      className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      Admin Dashboard
                    </button>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors duration-200"
                  >
                    Sign Out
                  </button>
                </div>
              </div>

              {/* Account Statistics */}
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Account Statistics
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Polls Created</div>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{userStats.pollsCreated}</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Votes Cast</div>
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{userStats.votesCast}</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Member Since</div>
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">
                      {userStats.createdAt ? new Date(userStats.createdAt).toLocaleDateString() : "-"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
