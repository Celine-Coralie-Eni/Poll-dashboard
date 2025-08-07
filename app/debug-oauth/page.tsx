"use client";

import { signIn, getProviders } from "next-auth/react";
import { useState, useEffect } from "react";

export default function DebugOAuthPage() {
  const [providers, setProviders] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProviders = async () => {
      const providers = await getProviders();
      setProviders(providers);
    };
    loadProviders();
  }, []);

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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card bg-base-100 shadow-xl p-8 max-w-2xl w-full">
        <h1 className="text-2xl font-bold mb-6">OAuth Debug Page</h1>
        
        <div className="space-y-6">
          {/* Environment Variables */}
          <div className="bg-base-200 p-4 rounded-lg">
            <h2 className="font-semibold mb-2">Environment Variables:</h2>
            <div className="text-sm space-y-1">
              <p>NEXTAUTH_URL: {process.env.NEXTAUTH_URL || 'Not set'}</p>
              <p>GOOGLE_CLIENT_ID: {process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Not set'}</p>
              <p>GOOGLE_CLIENT_SECRET: {process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Not set'}</p>
              <p>NEXTAUTH_SECRET: {process.env.NEXTAUTH_SECRET ? 'Set' : 'Not set'}</p>
            </div>
          </div>

          {/* Available Providers */}
          <div className="bg-base-200 p-4 rounded-lg">
            <h2 className="font-semibold mb-2">Available Providers:</h2>
            {providers ? (
              <div className="text-sm">
                {Object.keys(providers).map((provider) => (
                  <div key={provider} className="flex items-center gap-2">
                    <span>✅ {provider}</span>
                    <span className="opacity-75">({providers[provider].name})</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm opacity-75">Loading providers...</p>
            )}
          </div>

          {/* Test Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? "Testing..." : "Test Google Sign In"}
          </button>
          
          {/* Error Display */}
          {error && (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          )}
          
          {/* Current URL */}
          <div className="text-sm opacity-75">
            <p>Current URL: {typeof window !== 'undefined' ? window.location.href : 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 