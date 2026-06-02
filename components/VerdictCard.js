"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Cinematic verdict reveal — the gatekeeper's ruling.
// Styling adapts to the decision: emerald + check for APPROVED,
// rose-red + cross for REJECTED.
export default function VerdictCard({
  status = "APPROVED",
  score = 87,
  reasoning = "",
  claim = "",
}) {
  const approved = String(status).toUpperCase() === "APPROVED";
  // Accent as an "r g b" triplet so we can compose alpha inline.
  const accent = approved ? "52 227 168" : "248 113 113"; // emerald / rose-red

  // Ring geometry
  const R = 54;
  const CIRC = 2 * Math.PI * R;

  const [display, setDisplay] = useState(0); // count-up score
  const [drawn, setDrawn] = useState(false); // triggers ring sweep

  // Sweep the ring shortly after mount for a dramatic reveal.
  useEffect(() => {
    const t = setTimeout(() => setDrawn(true), 200);
    return () => clearTimeout(t);
  }, []);

  // Count the trust score up from zero (eased).
  useEffect(() => {
    let raf;
    const duration = 1400;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(eased * score));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  const offset = drawn ? CIRC * (1 - score / 100) : CIRC;

  return (
    <div className="relative w-full max-w-lg">
      {/* Glow burst behind the card — tinted by the decision */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-16 h-64 w-64 -translate-x-1/2 animate-pulse rounded-full blur-2xl"
        style={{
          background: `radial-gradient(circle, rgb(${accent} / 0.35), transparent 70%)`,
        }}
      />

      <div
        className="panel relative flex flex-col items-center gap-6 p-6 text-center sm:p-8"
        style={{
          boxShadow: `0 0 0 1px rgb(${accent} / 0.34), 0 0 22px rgb(${accent} / 0.18), inset 0 0 28px rgb(${accent} / 0.05)`,
        }}
      >
        {/* ── Status seal ─────────────────────────────────────── */}
        <div className="animate-seal-in flex flex-col items-center gap-4">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full"
            style={{
              border: `1px solid rgb(${accent} / 0.5)`,
              backgroundColor: `rgb(${accent} / 0.1)`,
              boxShadow: `0 0 22px rgb(${accent} / 0.4)`,
              color: `rgb(${accent})`,
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" aria-hidden>
              {approved ? (
                <path
                  d="M5 13l4 4L19 7"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : (
                <path
                  d="M7 7l10 10M17 7L7 17"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </svg>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-[0.4em] text-muted">
              The gate has ruled
            </span>
            <span
              className="font-display text-4xl tracking-[0.25em] sm:text-5xl"
              style={{
                color: `rgb(${accent})`,
                textShadow: `0 0 8px rgb(${accent} / 0.45), 0 0 24px rgb(${accent} / 0.22)`,
              }}
            >
              {String(status).toUpperCase()}
            </span>
          </div>
        </div>

        {/* ── Trust score ring ────────────────────────────────── */}
        <div
          className="animate-fade-in-up relative h-36 w-36 sm:h-40 sm:w-40"
          style={{ animationDelay: "0.35s" }}
        >
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
            <defs>
              <linearGradient id="trust-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="var(--gold-bright)" />
                <stop offset="100%" stopColor={`rgb(${accent})`} />
              </linearGradient>
            </defs>
            {/* Track */}
            <circle
              cx="60"
              cy="60"
              r={R}
              fill="none"
              stroke="var(--border)"
              strokeWidth="6"
            />
            {/* Progress */}
            <circle
              cx="60"
              cy="60"
              r={R}
              fill="none"
              stroke="url(#trust-grad)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={offset}
              style={{
                transition: "stroke-dashoffset 1.4s cubic-bezier(0.22,1,0.36,1)",
                filter: `drop-shadow(0 0 6px rgb(${accent} / 0.5))`,
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-5xl text-glow-gold">
              {display}
            </span>
            <span className="mt-1 text-[0.65rem] uppercase tracking-[0.3em] text-muted">
              Trust Score
            </span>
          </div>
        </div>

        <hr className="rule-aurora w-full" />

        {/* ── AI reasoning ────────────────────────────────────── */}
        <div
          className="animate-fade-in-up flex flex-col gap-3"
          style={{ animationDelay: "0.55s" }}
        >
          <span
            className="font-mono text-xs uppercase tracking-[0.25em]"
            style={{ color: `rgb(${accent})` }}
          >
            Gatekeeper&rsquo;s reasoning
          </span>
          <p className="leading-relaxed text-muted">
            {reasoning ||
              "The Gatekeeper returned no reasoning for this submission."}
          </p>
          {claim && (
            <p className="mt-2 text-sm italic text-muted/70">
              &ldquo;{claim}&rdquo;
            </p>
          )}
        </div>

        {/* ── Return home ─────────────────────────────────────── */}
        <Link
          href="/"
          className="animate-fade-in-up glow-gold mt-2 flex h-12 items-center justify-center rounded-full bg-surface-elevated px-8 font-display text-sm uppercase tracking-[0.2em] text-gold-bright transition-all hover:scale-[1.03] hover:bg-surface"
          style={{ animationDelay: "0.75s" }}
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
