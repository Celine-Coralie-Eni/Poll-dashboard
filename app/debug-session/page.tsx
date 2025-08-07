"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";

export default function DebugSessionPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signIn("google", { 
        callbackUrl: "http://localhost:3001/debug-session",
        redirect: false 
      });
      console.log("Google sign in result:", result);
    } catch (error) {
      console.error("Google sign in error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubSignIn = async () => {
    setLoading(true);
    try {
      const result = await signIn("github", { 
        callbackUrl: "http://localhost:3001/debug-session",
        redirect: false 
      });
      console.log("GitHub sign in result:", result);
    } catch (error) {
      console.error("GitHub sign in error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card bg-base-100 shadow-xl p-8 max-w-2xl w-full">
        <h1 className="text-2xl font-bold mb-6">Session Debug Page</h1>
        
        <div className="space-y-6">
          {/* Session Status */}
          <div className="bg-base-200 p-4 rounded-lg">
            <h2 className="font-semibold mb-2">Session Status:</h2>
            <div className="text-sm space-y-2">
              <p>Status: <span className="badge badge-primary">{status}</span></p>
              {session ? (
                <div>
                  <p>✅ Logged in as: {session.user?.name || session.user?.email}</p>
                  <p>User ID: {session.user?.id}</p>
                  <p>Role: {session.user?.role}</p>
                </div>
              ) : (
                <p>❌ Not logged in</p>
              )}
            </div>
          </div>

          {/* Test Buttons */}
          <div className="space-y-4">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? "Testing..." : "Test Google Sign In"}
            </button>
            
            <button
              onClick={handleGitHubSignIn}
              disabled={loading}
              className="btn btn-secondary w-full"
            >
              {loading ? "Testing..." : "Test GitHub Sign In"}
            </button>

            {session && (
              <button
                onClick={() => signOut()}
                className="btn btn-outline w-full"
              >
                Sign Out
              </button>
            )}
          </div>

          {/* Environment Check */}
          <div className="bg-base-200 p-4 rounded-lg">
            <h2 className="font-semibold mb-2">Environment Check:</h2>
            <div className="text-sm space-y-1">
              <p>NEXTAUTH_URL: {process.env.NEXTAUTH_URL || 'Not set'}</p>
              <p>NEXTAUTH_SECRET: {process.env.NEXTAUTH_SECRET ? 'Set' : 'Not set'}</p>
              <p>GOOGLE_CLIENT_ID: {process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Not set'}</p>
              <p>GITHUB_CLIENT_ID: {process.env.GITHUB_CLIENT_ID ? 'Set' : 'Not set'}</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="text-sm opacity-75">
            <p>1. Click a sign-in button above</p>
            <p>2. Complete the OAuth flow</p>
            <p>3. Check if session appears below</p>
            <p>4. Check browser console for errors</p>
          </div>
        </div>
      </div>
    </div>
  );
} 