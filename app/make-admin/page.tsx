"use client";

import { useState } from "react";
import { Navigation } from "@/components/Navigation";

export default function MakeAdminPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleMakeAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/admin/make-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Failed to make user admin');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h1 className="card-title text-2xl justify-center mb-6">
                Make User Admin
              </h1>

              <form onSubmit={handleMakeAdmin} className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email Address</span>
                  </label>
                  <input
                    type="email"
                    placeholder="Enter user's email"
                    className="input input-bordered w-full"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-control mt-6">
                  <button
                    type="submit"
                    className="btn btn-primary w-full"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                      "Make Admin"
                    )}
                  </button>
                </div>
              </form>

              {error && (
                <div className="alert alert-error mt-4">
                  <span>{error}</span>
                </div>
              )}

              {result && (
                <div className="alert alert-success mt-4">
                  <span>{result.message}</span>
                  <div className="text-sm mt-2">
                    <p><strong>User:</strong> {result.user.name}</p>
                    <p><strong>Email:</strong> {result.user.email}</p>
                    <p><strong>Role:</strong> {result.user.role}</p>
                  </div>
                </div>
              )}

              <div className="text-center mt-4">
                <p className="text-sm opacity-75">
                  ⚠️ This is a temporary admin tool. Remove this page after use.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
