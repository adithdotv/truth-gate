"use client";

import { useState } from "react";

// Submission form — present your case to the gatekeeper.
// TODO: wire onSubmit to the Somnia Agent pipeline and add real validation.
const FIELD =
  "w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-base text-foreground placeholder:text-muted/60 outline-none transition-all duration-300 focus:border-gold/60 focus:bg-surface focus:shadow-[0_0_0_1px_rgba(244,217,123,0.25),0_0_22px_rgba(244,217,123,0.12)]";

export default function SubmissionForm({ onSubmit }) {
  const [idea, setIdea] = useState("");
  const [github, setGithub] = useState("");
  const [website, setWebsite] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    if (!idea.trim()) return;
    // TODO: replace with real submission logic.
    onSubmit?.({
      idea: idea.trim(),
      github: github.trim(),
      website: website.trim(),
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="panel mx-auto flex w-full max-w-xl flex-col gap-6 p-6 sm:p-8"
    >
      {/* Startup Idea */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="idea"
          className="text-xs uppercase tracking-[0.2em] text-muted"
        >
          Startup Idea
        </label>
        <textarea
          id="idea"
          value={idea}
          onChange={(event) => setIdea(event.target.value)}
          rows={5}
          required
          placeholder="Describe the idea you bring before the gate…"
          className={`${FIELD} resize-none`}
        />
      </div>

      {/* GitHub URL */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="github"
          className="text-xs uppercase tracking-[0.2em] text-muted"
        >
          GitHub URL
        </label>
        <input
          id="github"
          type="url"
          inputMode="url"
          value={github}
          onChange={(event) => setGithub(event.target.value)}
          placeholder="https://github.com/you/project"
          className={FIELD}
        />
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
          onChange={(event) => setWebsite(event.target.value)}
          placeholder="https://yourportfolio.com"
          className={FIELD}
        />
      </div>

      <button
        type="submit"
        disabled={!idea.trim()}
        className="glow-gold mt-2 flex h-12 items-center justify-center rounded-full bg-surface-elevated font-display text-sm uppercase tracking-[0.2em] text-gold-bright transition-all hover:scale-[1.02] hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
      >
        Face the Gatekeeper
      </button>
    </form>
  );
}
