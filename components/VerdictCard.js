"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Cinematic verdict reveal — the gatekeeper's ruling.
// TODO: receive the real status/score/reasoning from the Somnia Agent.
export default function VerdictCard({
  status = "APPROVED",
  score = 87,
  reasoning = "",
  claim = "",
}) {
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
      {/* Success glow burst behind the card */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-16 h-64 w-64 -translate-x-1/2 animate-pulse rounded-full bg-[radial-gradient(circle,rgba(52,227,168,0.35),transparent_70%)] blur-2xl"
      />

      <div className="panel glow-emerald relative flex flex-col items-center gap-6 p-6 text-center sm:p-8">
        {/* ── Status seal ─────────────────────────────────────── */}
        <div className="animate-seal-in flex flex-col items-center gap-4">
          <div className="pulse-glow flex h-16 w-16 items-center justify-center rounded-full border border-emerald/50 bg-emerald/10">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-8 w-8 text-emerald-bright"
              aria-hidden
            >
              <path
                d="M5 13l4 4L19 7"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-[0.4em] text-muted">
              The gate has ruled
            </span>
            <span className="font-display text-4xl tracking-[0.25em] text-glow-emerald sm:text-5xl">
              {status.toUpperCase()}
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
                <stop offset="100%" stopColor="var(--emerald-bright)" />
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
                filter: "drop-shadow(0 0 6px rgba(52,227,168,0.5))",
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
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-emerald-bright">
            Gatekeeper&rsquo;s reasoning
          </span>
          <p className="leading-relaxed text-muted">
            {reasoning ||
              "The submission demonstrates a coherent vision, verifiable public artifacts, and credible technical signal. The Gatekeeper finds sufficient grounds to extend onchain trust."}
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
