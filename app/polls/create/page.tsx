"use client";

import { Navigation } from "@/components/Navigation";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTranslations } from "@/lib/tolgee-optimized";
import Link from "next/link";
import { Button } from "@/components/Button";

export default function CreatePollPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { t } = useTranslations();
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
            <h1 className="text-2xl font-bold mb-4">{t('authentication_required', 'Authentication Required')}</h1>
            <p className="mb-4">{t('need_login_create_polls', 'You need to be logged in to create polls.')}</p>
            <Link href="/auth/login">
              <Button>{t('login', 'Login')}</Button>
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
      setError(t('poll_title_required', 'Poll title is required'));
      return;
    }

    const validOptions = options.filter((option) => option.trim());
    if (validOptions.length < 2) {
      setError(t('at_least_2_options', 'At least 2 options are required'));
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
        throw new Error(errorData.error || t('failed_to_create_poll', 'Failed to create poll'));
      }

      const poll = await response.json();
      router.push(`/polls/${poll.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('failed_to_create_poll', 'Failed to create poll'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="card bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700">
            {/* Header Section */}
            <div className="bg-blue-600 px-8 py-6 rounded-t-2xl">
              <h1 className="text-3xl font-bold text-white mb-2">
                {t('create_new_poll', 'Create New Poll')}
              </h1>
              <p className="text-white/90 text-lg">
                {t('create_new_poll_desc', 'Create a new poll and start collecting responses from your audience.')}
              </p>
            </div>

            {/* Form Section */}
            <div className="card-body text-gray-900 dark:text-white">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Poll Title */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold text-gray-700 dark:text-gray-300">{t('poll_title_label', 'Poll Title')}</span>
                  </label>
                  <input
                    type="text"
                    placeholder={t('poll_title_placeholder', "What's your question?")}
                    className="input input-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                {/* Description */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold text-gray-700 dark:text-gray-300">{t('description_optional', 'Description (Optional)')}</span>
                  </label>
                  <textarea
                    placeholder={t('description_placeholder', 'Add more context to your poll...')}
                    className="textarea textarea-bordered resize-none bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {/* Poll Options */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold text-gray-700 dark:text-gray-300">{t('poll_options', 'Poll Options')}</span>
                  </label>
                  <div className="space-y-3">
                    {options.map((option, index) => (
                      <div key={index} className="flex gap-3">
                        <input
                          type="text"
                          placeholder={t('option_placeholder', 'Enter option text...')}
                          className="input input-bordered flex-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                          required
                        />
                        {options.length > 2 && (
                          <Button
                            type="button"
                            onClick={() => removeOption(index)}
                            variant="danger"
                            size="sm"
                          >
                            {t('remove', 'Remove')}
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Add New Option */}
                  <div className="flex gap-3 mt-3">
                    <input
                      type="text"
                      placeholder={t('add_new_option_placeholder', 'Add new option...')}
                      className="input input-bordered flex-1 add-new-option-input bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
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
                          '.add-new-option-input'
                        ) as HTMLInputElement;
                        const value = input?.value.trim();
                        if (value) {
                          setOptions([...options, value]);
                          input.value = "";
                        }
                      }}
                      className="w-12 h-12 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
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
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        {t('creating', 'Creating...')}
                      </>
                    ) : (
                      t('create_poll', 'Create Poll')
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex-1"
                    onClick={() => {
                      // Save as draft functionality (placeholder)
                      console.log("Save as draft clicked");
                    }}
                  >
                    {t('save_as_draft', 'Save as Draft')}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
