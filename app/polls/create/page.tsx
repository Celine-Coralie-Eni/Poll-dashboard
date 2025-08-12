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

  // Show login prompt for non-authenticated users but allow them to continue
  const showLoginPrompt = !session;

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

      <main className="container mx-auto px-4 py-4 sm:py-8">
        <div className="max-w-3xl mx-auto">
          <div className="card bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700">
            {/* Header Section */}
            <div className="bg-blue-600 px-4 sm:px-8 py-4 sm:py-6 rounded-t-2xl">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                {t('create_new_poll', 'Create New Poll')}
              </h1>
              <p className="text-white/90 text-base sm:text-lg">
                {t('create_new_poll_desc', 'Create a new poll and start collecting responses from your audience.')}
              </p>
            </div>

            {/* Form Section */}
            <div className="card-body text-gray-900 dark:text-white px-4 sm:px-8">
              {showLoginPrompt && (
                <div className="alert alert-info mb-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-3">
                    <div>
                      <h3 className="font-semibold">{t('create_poll_anonymously', 'Create Poll Anonymously')}</h3>
                      <p className="text-sm">{t('login_to_save_poll', 'Login to save your poll and track results')}</p>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Link href="/auth/login" className="btn btn-primary btn-sm flex-1 sm:flex-none">
                        {t('login', 'Login')}
                      </Link>
                      <Link href="/auth/register" className="btn btn-secondary btn-sm flex-1 sm:flex-none">
                        {t('sign_up', 'Sign Up')}
                      </Link>
                    </div>
                  </div>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
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
                      <div key={index} className="flex flex-col sm:flex-row gap-2 sm:gap-3">
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
                            className="w-full sm:w-auto"
                          >
                            {t('remove', 'Remove')}
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Add New Option */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-3">
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
                      className="w-full sm:w-12 h-12 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
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
                <div className="flex gap-4 pt-4 sm:pt-6">
                  <Button
                    type="submit"
                    className="w-full"
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
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
