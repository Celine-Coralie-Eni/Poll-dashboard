"use client";

import { Navigation } from "@/components/Navigation";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function CreatePollPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState(["React", "Vue", "Angular", "Svelte"]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not authenticated
  if (!session) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
            <p className="mb-4">You need to be logged in to create polls.</p>
            <Link href="/auth/login" className="btn btn-primary">
              Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Poll title is required");
      return;
    }

    const validOptions = options.filter((option) => option.trim());
    if (validOptions.length < 2) {
      setError("At least 2 options are required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/polls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          options: validOptions,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create poll");
      }

      const poll = await response.json();
      router.push(`/polls/${poll.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create poll");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="card bg-base-100 shadow-xl">
            {/* Header Section */}
            <div className="bg-primary px-8 py-6 rounded-t-2xl">
              <h1 className="text-3xl font-bold text-primary-content mb-2">
                Create New Poll
              </h1>
              <p className="text-primary-content/90 text-lg">
                Create a new poll and start collecting responses from your
                audience.
              </p>
            </div>

            {/* Form Section */}
            <div className="card-body">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Poll Title */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Poll Title</span>
                  </label>
                  <input
                    type="text"
                    placeholder="What's your question?"
                    className="input input-bordered input-primary w-full"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                {/* Description */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Description (Optional)</span>
                  </label>
                  <textarea
                    placeholder="Add more context to your poll..."
                    className="textarea textarea-bordered textarea-primary resize-none"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {/* Poll Options */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Poll Options</span>
                  </label>
                  <div className="space-y-3">
                    {options.map((option, index) => (
                      <div key={index} className="flex gap-3">
                        <input
                          type="text"
                          placeholder="Enter option text..."
                          className="input input-bordered input-primary flex-1"
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                          required
                        />
                        {options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removeOption(index)}
                            className="btn btn-outline btn-error"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Add New Option */}
                  <div className="flex gap-3 mt-3">
                    <input
                      type="text"
                      placeholder="Add new option..."
                      className="input input-bordered input-primary flex-1"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const value = (
                            e.target as HTMLInputElement
                          ).value.trim();
                          if (value) {
                            setOptions([...options, value]);
                            (e.target as HTMLInputElement).value = "";
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.querySelector(
                          'input[placeholder="Add new option..."]'
                        ) as HTMLInputElement;
                        const value = input?.value.trim();
                        if (value) {
                          setOptions([...options, value]);
                          input.value = "";
                        }
                      }}
                      className="btn btn-circle btn-primary"
                    >
                      +
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="alert alert-error">
                    <span>{error}</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6">
                  <button
                    type="submit"
                    className="btn btn-primary flex-1"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Creating...
                      </>
                    ) : (
                      "Create Poll"
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary flex-1"
                    onClick={() => {
                      // Save as draft functionality (placeholder)
                      console.log("Save as draft clicked");
                    }}
                  >
                    Save as Draft
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
