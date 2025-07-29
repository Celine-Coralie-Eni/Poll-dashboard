"use client";

import { Navigation } from "@/components/Navigation";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

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
    <div className="min-h-screen">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h1 className="card-title text-3xl justify-center mb-8">
                Profile
              </h1>

              <div className="space-y-6">
                {/* Profile Information */}
                <div className="bg-base-200 p-6 rounded-lg">
                  <h2 className="text-xl font-semibold mb-4">
                    Account Information
                  </h2>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Name:</span>
                      <span>{session.user?.name || "Not provided"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Email:</span>
                      <span>{session.user?.email}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Role:</span>
                      <span className="badge badge-primary">
                        {(session as any)?.user?.role || "User"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Account Status:</span>
                      <span className="badge badge-success">Active</span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-base-200 p-6 rounded-lg">
                  <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => router.push("/polls")}
                      className="btn btn-primary"
                    >
                      View Polls
                    </button>
                    <button
                      onClick={() => router.push("/polls/create")}
                      className="btn btn-secondary"
                    >
                      Create Poll
                    </button>
                    {(session as any)?.user?.role === "ADMIN" && (
                      <button
                        onClick={() => router.push("/admin")}
                        className="btn btn-accent"
                      >
                        Admin Dashboard
                      </button>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="btn btn-outline btn-error"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>

                {/* Account Statistics */}
                <div className="bg-base-200 p-6 rounded-lg">
                  <h2 className="text-xl font-semibold mb-4">
                    Account Statistics
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="stat bg-base-100 rounded-lg">
                      <div className="stat-title">Polls Created</div>
                      <div className="stat-value text-primary">0</div>
                    </div>
                    <div className="stat bg-base-100 rounded-lg">
                      <div className="stat-title">Votes Cast</div>
                      <div className="stat-value text-secondary">0</div>
                    </div>
                    <div className="stat bg-base-100 rounded-lg">
                      <div className="stat-title">Member Since</div>
                      <div className="stat-value text-accent text-lg">
                        {new Date().toLocaleDateString()}
                      </div>
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
