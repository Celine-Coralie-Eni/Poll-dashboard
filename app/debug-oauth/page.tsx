"use client";

import { signIn, getProviders, useSession } from "next-auth/react";
import { useState, useEffect } from "react";

interface DebugInfo {
  result?: any;
  timestamp?: string;
  url?: string;
  success?: boolean;
  error?: any;
}

export default function DebugOAuthPage() {
  const { data: session, status } = useSession();
  const [providers, setProviders] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({});

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
    setDebugInfo({});
    
    try {
      console.log("Starting Google sign in...");
      
      const result = await signIn("google", { 
        callbackUrl: "/",
        redirect: false 
      });
      
      console.log("Sign in result:", result);
      setDebugInfo({
        result,
        timestamp: new Date().toISOString(),
        url: window.location.href
      });
      
      if (result?.error) {
        setError(result.error);
      } else if (result?.ok) {
        setDebugInfo((prev: DebugInfo) => ({ ...prev, success: true }));
      }
    } catch (err) {
      console.error("Sign in error:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
      setDebugInfo({ error: err });
    } finally {
      setLoading(false);
    }
  };

  const checkEnvironment = () => {
    const env = {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "Set" : "Not set",
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? "Set" : "Not set",
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? "Set" : "Not set",
      NODE_ENV: process.env.NODE_ENV,
    };
    
    const missing = Object.entries(env).filter(([key, value]) => 
      key !== 'NODE_ENV' && (value === "Not set" || !value)
    );
    
    return { env, missing };
  };

  const { env, missing } = checkEnvironment();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card bg-base-100 shadow-xl p-8 max-w-4xl w-full">
        <h1 className="text-2xl font-bold mb-6">OAuth Debug Page</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Environment Variables */}
          <div className="bg-base-200 p-4 rounded-lg">
            <h2 className="font-semibold mb-2">Environment Variables:</h2>
            <div className="text-sm space-y-1">
              {Object.entries(env).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="font-mono">{key}:</span>
                  <span className={value === "Not set" || !value ? "text-error" : "text-success"}>
                    {value || "Not set"}
                  </span>
                </div>
              ))}
            </div>
            
            {missing.length > 0 && (
              <div className="alert alert-warning mt-2">
                <span>⚠️ Missing: {missing.map(([key]) => key).join(", ")}</span>
              </div>
            )}
          </div>

          {/* Session Status */}
          <div className="bg-base-200 p-4 rounded-lg">
            <h2 className="font-semibold mb-2">Session Status:</h2>
            <div className="text-sm space-y-1">
              <div>Status: <span className="font-mono">{status}</span></div>
              <div>Authenticated: <span className={session ? "text-success" : "text-error"}>{session ? "Yes" : "No"}</span></div>
              {session && (
                <div className="mt-2">
                  <div>User: {session.user?.email}</div>
                  <div>Name: {session.user?.name}</div>
                </div>
              )}
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

          {/* Debug Info */}
          <div className="bg-base-200 p-4 rounded-lg">
            <h2 className="font-semibold mb-2">Debug Info:</h2>
            <div className="text-sm">
              <div>Current URL: {typeof window !== 'undefined' ? window.location.href : 'N/A'}</div>
              <div>User Agent: {typeof window !== 'undefined' ? window.navigator.userAgent : 'N/A'}</div>
              {debugInfo.timestamp && (
                <div>Last Test: {debugInfo.timestamp}</div>
              )}
            </div>
          </div>
        </div>

        {/* Test Button */}
        <div className="mt-6">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? "Testing..." : "Test Google Sign In"}
          </button>
        </div>
        
        {/* Error Display */}
        {error && (
          <div className="alert alert-error mt-4">
            <span>{error}</span>
          </div>
        )}

        {/* Debug Result */}
        {Object.keys(debugInfo).length > 0 && (
          <div className="mt-4 bg-base-200 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Debug Result:</h3>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
} 