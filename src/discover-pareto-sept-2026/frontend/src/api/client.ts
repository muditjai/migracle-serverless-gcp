import type { FeedbackSubmissionInput } from "../types.js";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

async function json<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    }
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json() as Promise<T>;
}

export const apiClient = {
  async submitFeedback(input: FeedbackSubmissionInput): Promise<void> {
    await json("/api/feedback", {
      method: "POST",
      body: JSON.stringify(input)
    });
  }
};
