"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getTrustTier } from "@/lib/contract";

// Cinematic verdict reveal — the gatekeeper's onchain ruling.
// Styling adapts to the trust tier:
//   verified → emerald · moderate → gold · low → rose-red
const TIER_ACCENT = {
  verified: "52 227 168", // emerald
  moderate: "244 217 123", // gold
  low: "248 113 113", // rose-red
};

function TierIcon({ tier }) {
  if (tier === "verified") {
    return (
      <path
        d="M5 13l4 4L19 7"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    );
  }
  if (tier === "low") {
    return (
      <path
        d="M7 7l10 10M17 7L7 17"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    );
  }
  // moderate
  return (
    <path
      d="M6 12h12"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  );
}

function Stat({ label, value }) {
  return (
    <div className="flex flex-1 flex-col items-center gap-1">
      <span className="font-display text-2xl text-foreground">{value}</span>
      <span className="text-[0.6rem] uppercase tracking-[0.25em] text-muted">
        {label}
      </span>
    </div>
  );
}

export default function VerdictCard({ reputation }) {
  const {
    username = "",
    bio = "",
    createdAt = "",
    followers = 0,
    following = 0,
    publicRepos = 0,
    truthScore = 0,
  } = reputation ?? {};

  const { tier, label } = getTrustTier(truthScore);
  const accent = TIER_ACCENT[tier];

  // Ring geometry
  const R = 54;
  const CIRC = 2 * Math.PI * R;

  const [display, setDisplay] = useState(0); // count-up score
  const [drawn, setDrawn] = useState(false); // triggers ring sweep

  useEffect(() => {
    const t = setTimeout(() => setDrawn(true), 200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    let raf;
    const duration = 1400;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(eased * truthScore));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [truthScore]);

  const offset = drawn ? CIRC * (1 - Math.min(truthScore, 100) / 100) : CIRC;

  return (
    <div className="relative w-full max-w-lg">
      {/* Glow burst behind the card — tinted by the tier */}
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
        {/* ── Identity + tier seal ────────────────────────────── */}
        <div className="animate-seal-in flex flex-col items-center gap-4">
          {/* Tier seal inside a glowing ring */}
          <div
            className="flex h-20 w-20 items-center justify-center rounded-full"
            style={{
              border: `1px solid rgb(${accent} / 0.55)`,
              backgroundColor: `rgb(${accent} / 0.08)`,
              boxShadow: `0 0 24px rgb(${accent} / 0.4)`,
              color: `rgb(${accent})`,
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-9 w-9" aria-hidden>
              <TierIcon tier={tier} />
            </svg>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-[0.4em] text-muted">
              The gate has ruled
            </span>
            <span
              className="font-display text-3xl tracking-[0.18em] sm:text-4xl"
              style={{
                color: `rgb(${accent})`,
                textShadow: `0 0 8px rgb(${accent} / 0.45), 0 0 24px rgb(${accent} / 0.22)`,
              }}
            >
              {label.toUpperCase()}
            </span>
            {username && (
              <span className="font-mono text-sm text-foreground/80">
                @{username}
              </span>
            )}
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
            <circle
              cx="60"
              cy="60"
              r={R}
              fill="none"
              stroke="var(--border)"
              strokeWidth="6"
            />
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
              Truth Score
            </span>
          </div>
        </div>

        <hr className="rule-aurora w-full" />

        {/* ── On-chain stats ──────────────────────────────────── */}
        <div
          className="animate-fade-in-up flex w-full items-stretch"
          style={{ animationDelay: "0.5s" }}
        >
          <Stat label="Followers" value={followers} />
          <div className="w-px bg-border" />
          <Stat label="Following" value={following} />
          <div className="w-px bg-border" />
          <Stat label="Repos" value={publicRepos} />
        </div>

        {/* ── Profile / reasoning ─────────────────────────────── */}
        <div
          className="animate-fade-in-up flex flex-col gap-2"
          style={{ animationDelay: "0.6s" }}
        >
          <span
            className="font-mono text-xs uppercase tracking-[0.25em]"
            style={{ color: `rgb(${accent})` }}
          >
            Gatekeeper&rsquo;s reading
          </span>
          <p className="leading-relaxed text-muted">
            {bio ||
              `The Gatekeeper analyzed @${username || "this account"} onchain and assigned a trust score of ${truthScore}.`}
          </p>
          {createdAt && (
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted/70">
              On GitHub since {createdAt}
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
