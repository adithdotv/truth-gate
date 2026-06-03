"use client";

import { useState } from "react";

// Submission form — present your case to the gatekeeper.
// The oracle analyzes both the GitHub profile and the portfolio website.
const FIELD =
  "w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-base text-foreground placeholder:text-muted/60 outline-none transition-all duration-300 focus:border-gold/60 focus:bg-surface focus:shadow-[0_0_0_1px_rgba(244,217,123,0.25),0_0_22px_rgba(244,217,123,0.12)]";

const FIELD_ERROR =
  "border-[rgb(248_113_113_/_0.6)] focus:border-[rgb(248_113_113_/_0.7)] focus:shadow-[0_0_0_1px_rgba(248,113,113,0.3),0_0_22px_rgba(248,113,113,0.12)]";

export default function SubmissionForm({ onSubmit }) {
  const [idea, setIdea] = useState("");
  const [github, setGithub] = useState("");
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState({});

  function validate() {
    const next = {};
    if (!github.trim()) {
      next.github = "Enter a GitHub username or profile URL.";
    }
    const url = website.trim();
    if (!url) {
      next.website = "A portfolio URL is required for website analysis.";
    } else if (!/^https:\/\//i.test(url)) {
      next.website = "Portfolio URL must start with https://";
    }
    return next;
  }

  function handleSubmit(event) {
    event.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    onSubmit?.({
      idea: idea.trim(),
      github: github.trim(),
      website: website.trim(),
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="panel mx-auto flex w-full max-w-xl flex-col gap-6 p-6 sm:p-8"
    >
      {/* Startup Idea (optional context) */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="idea"
          className="text-xs uppercase tracking-[0.2em] text-muted"
        >
          Startup Idea <span className="text-muted/50">· optional</span>
        </label>
        <textarea
          id="idea"
          value={idea}
          onChange={(event) => setIdea(event.target.value)}
          rows={4}
          placeholder="Describe the idea you bring before the gate…"
          className={`${FIELD} resize-none`}
        />
      </div>

      {/* GitHub Username */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="github"
          className="text-xs uppercase tracking-[0.2em] text-muted"
        >
          GitHub Username
        </label>
        <input
          id="github"
          type="text"
          autoComplete="off"
          value={github}
          onChange={(event) => {
            setGithub(event.target.value);
            if (errors.github) setErrors((e) => ({ ...e, github: undefined }));
          }}
          placeholder="torvalds  ·  or https://github.com/torvalds"
          aria-invalid={!!errors.github}
          className={`${FIELD} ${errors.github ? FIELD_ERROR : ""}`}
        />
        {errors.github && (
          <span className="text-xs text-[rgb(248_113_113)]">
            {errors.github}
          </span>
        )}
      </div>

      {/* Portfolio Website URL */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="website"
          className="text-xs uppercase tracking-[0.2em] text-muted"
        >
          Portfolio Website URL
        </label>
        <input
          id="website"
          type="url"
          inputMode="url"
          value={website}
          onChange={(event) => {
            setWebsite(event.target.value);
            if (errors.website) setErrors((e) => ({ ...e, website: undefined }));
          }}
          placeholder="https://yourportfolio.com"
          aria-invalid={!!errors.website}
          className={`${FIELD} ${errors.website ? FIELD_ERROR : ""}`}
        />
        {errors.website && (
          <span className="text-xs text-[rgb(248_113_113)]">
            {errors.website}
          </span>
        )}
      </div>

      <button
        type="submit"
        disabled={!github.trim() || !website.trim()}
        className="glow-gold mt-2 flex h-12 items-center justify-center rounded-full bg-surface-elevated font-display text-sm uppercase tracking-[0.2em] text-gold-bright transition-all hover:scale-[1.02] hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
      >
        Face the Gatekeeper
      </button>
    </form>
  );
}
