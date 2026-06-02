"use client";

import { useState } from "react";

// Placeholder: form for submitting a claim to the oracle.
// TODO: wire onSubmit to the agent/contract pipeline and handle validation.
export default function SubmissionForm({ onSubmit }) {
  const [claim, setClaim] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    if (!claim.trim()) return;
    // TODO: replace with real submission logic.
    onSubmit?.(claim.trim());
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-xl flex-col gap-4 px-6"
    >
      <label htmlFor="claim" className="text-sm font-medium">
        Your claim
      </label>
      <textarea
        id="claim"
        value={claim}
        onChange={(event) => setClaim(event.target.value)}
        rows={5}
        placeholder="Enter the statement you want judged…"
        className="rounded-lg border border-black/[.08] bg-transparent p-3 text-base outline-none focus:border-foreground dark:border-white/[.145]"
      />
      <button
        type="submit"
        className="flex h-12 items-center justify-center rounded-full bg-foreground px-6 text-background transition-colors hover:opacity-90 disabled:opacity-50"
        disabled={!claim.trim()}
      >
        Submit to oracle
      </button>
    </form>
  );
}
