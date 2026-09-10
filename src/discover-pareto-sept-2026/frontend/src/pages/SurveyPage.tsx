import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { capture, capturePageview } from "../analytics.js";
import { apiClient } from "../api/client.js";
import { focusAreaOptions, type BinaryAnswer, type FeedbackSubmissionInput, type FocusArea } from "../types.js";

export function SurveyPage() {
  const [focusAreas, setFocusAreas] = useState<FocusArea[]>([]);
  const [membership, setMembership] = useState<BinaryAnswer | null>(null);
  const [communityName, setCommunityName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(() => focusAreas.length > 0 && membership !== null && (membership === "no" || communityName.trim().length > 0), [communityName, focusAreas.length, membership]);

  useEffect(() => {
    capturePageview();
  }, []);

  function toggleFocusArea(value: FocusArea) {
    setSubmitError("");
    const current = focusAreas;
    const selected = current.includes(value);
    const next = selected ? current.filter((item) => item !== value) : current.length >= 3 ? current : [...current, value];

    if (next !== current) {
      capture("discover_pareto_focus_area_toggled", {
        value,
        selected: !selected,
        selectedCount: next.length
      });
      setFocusAreas(next);
    }
  }

  function chooseMembership(answer: BinaryAnswer) {
    capture("discover_pareto_membership_selected", { answer });
    setMembership(answer);
    setSubmitError("");
  }

  async function submitSurvey(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit || !membership) {
      return;
    }

    const payload: FeedbackSubmissionInput = {
      focusAreas,
      hasCommunityMembership: membership,
      communityMembershipName: membership === "yes" ? communityName.trim() : null,
      email: email.trim() || null
    };

    setSubmitting(true);
    setSubmitError("");

    try {
      await apiClient.submitFeedback(payload);
      capture("discover_pareto_submitted", { ...payload });
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to submit feedback");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="page-shell">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">discoverpareto.com</p>
          <h1>Discover Pareto</h1>
          <p className="intro">
            A survey for people who care about model discovery, trace sharing, open model optimization, and GPU cloud comparison.
          </p>
        </div>
      </section>

      <form className="survey" onSubmit={submitSurvey}>
        <section className="panel">
          <div className="panel-head">
            <p className="section-label">Question 1</p>
            <h2>Would you join a community with following focus. Select top 3 most relevant for you.</h2>
            <p className="panel-note">{focusAreas.length}/3 selected</p>
          </div>

          <div className="focus-grid" role="group" aria-label="Community focus areas">
            {focusAreaOptions.map((option) => {
              const selected = focusAreas.includes(option.value);
              const locked = !selected && focusAreas.length >= 3;

              return (
                <button
                  key={option.value}
                  type="button"
                  className={selected ? "focus-card selected" : "focus-card"}
                  onClick={() => !locked && toggleFocusArea(option.value)}
                  aria-pressed={selected}
                  aria-disabled={locked}
                >
                  <span className="focus-title">{option.title}</span>
                  <span className="focus-description">{option.description}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="panel">
          <div className="panel-head">
            <p className="section-label">Question 2</p>
            <h2>Are you member of any such community already?</h2>
          </div>

          <div className="choice-row" role="group" aria-label="Membership status">
            <button
              type="button"
              className={membership === "yes" ? "choice selected" : "choice"}
              onClick={() => chooseMembership("yes")}
              aria-pressed={membership === "yes"}
            >
              Yes
            </button>
            <button
              type="button"
              className={membership === "no" ? "choice selected" : "choice"}
              onClick={() => chooseMembership("no")}
              aria-pressed={membership === "no"}
            >
              No
            </button>
          </div>

          {membership === "yes" ? (
            <div className="reveal visible">
              <label className="field">
                <span>Which one?</span>
                <input
                  type="text"
                  value={communityName}
                  onChange={(event) => setCommunityName(event.target.value)}
                  placeholder="Tell us the community name"
                />
              </label>
            </div>
          ) : null}
        </section>

        <section className="panel submit-panel">
          <label className="field">
            <span>Email <small>(optional)</small></span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </label>

          <div className="actions">
            <button className="submit-button" type="submit" disabled={!canSubmit || submitting}>
              {submitting ? "Submitting..." : "Submit"}
            </button>
            <p className={submitted || submitError ? "status visible" : "status"} role="status">
              {submitError || "Thanks. Your feedback was recorded."}
            </p>
          </div>
        </section>
      </form>
    </main>
  );
}
