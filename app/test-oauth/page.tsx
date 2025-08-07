"use client";

import { signIn, getSession } from "next-auth/react";
import { useState } from "react";

export default function TestOAuthPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await signIn("google", { 
        callbackUrl: "https://55be90de8602.ngrok-free.app/",
        redirect: false 
      });
      
      console.log("Sign in result:", result);
      
      if (result?.error) {
        setError(result.error);
      }
    } catch (err) {
      console.error("Sign in error:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="card bg-base-100 shadow-xl p-8">
        <h1 className="text-2xl font-bold mb-6">OAuth Test Page</h1>
        
        <div className="space-y-4">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? "Loading..." : "Test Google Sign In"}
          </button>
          
          {error && (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          )}
          
          <div className="text-sm opacity-75">
            <p>Current URL: {typeof window !== 'undefined' ? window.location.href : 'N/A'}</p>
            <p>NEXTAUTH_URL: {process.env.NEXTAUTH_URL}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 