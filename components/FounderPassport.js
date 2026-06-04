"use client";

import { forwardRef } from "react";
import { getTrustTier } from "@/lib/contract";
import { summarizeVerdict } from "@/lib/share";

// A compact, image-export-friendly founder credential.
// Uses explicit inline colors (no backdrop-filter / background-clip text) so
// html-to-image renders it faithfully as a PNG.
const TIER_ACCENT = {
  verified: { rgb: "52 227 168", hex: "#34e3a8" },
  moderate: { rgb: "244 217 123", hex: "#f4d97b" },
  low: { rgb: "248 113 113", hex: "#f87171" },
};

const FounderPassport = forwardRef(function FounderPassport(
  { username = "", truthScore = 0, trustTier = "", startupIdea = "", aiVerdict = "" },
  ref,
) {
  const { tier, label } = getTrustTier(truthScore);
  const tierLabel = trustTier || label;
  const accent = TIER_ACCENT[tier];

  // Static score ring (exported as-is, always full).
  const R = 50;
  const CIRC = 2 * Math.PI * R;
  const offset = CIRC * (1 - Math.min(truthScore, 100) / 100);

  const summary = summarizeVerdict(aiVerdict, 180);

  return (
    <div
      ref={ref}
      className="relative w-full max-w-[400px] overflow-hidden rounded-2xl"
      style={{
        background:
          "linear-gradient(160deg, #14120e 0%, #0b0d0e 55%, #060708 100%)",
        border: "1px solid rgb(201 162 39 / 0.5)",
        boxShadow:
          "0 0 0 1px rgb(244 217 123 / 0.12), 0 0 44px rgb(244 217 123 / 0.12)",
        padding: "28px",
        color: "#eceae3",
      }}
    >
      {/* Subtle background pattern + accent glow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          opacity: 0.04,
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "-30%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "20rem",
          height: "20rem",
          borderRadius: "9999px",
          background: `radial-gradient(circle, rgb(${accent.rgb} / 0.18), transparent 70%)`,
        }}
      />

      <div className="relative flex flex-col items-center gap-5 text-center">
        {/* Header */}
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* Seal icon */}
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full"
              style={{
                border: "1px solid rgb(201 162 39 / 0.6)",
                background: "rgb(244 217 123 / 0.08)",
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
                <path
                  d="M12 3l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4L4.2 8.7l5.4-.8L12 3z"
                  stroke="#f4d97b"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                  fill="rgb(244 217 123 / 0.12)"
                />
              </svg>
            </span>
            <div className="flex flex-col items-start leading-tight">
              <span
                className="font-display text-xs uppercase tracking-[0.3em]"
                style={{ color: "#f4d97b" }}
              >
                TruthGate
              </span>
              <span className="text-[0.55rem] uppercase tracking-[0.25em] text-muted">
                Founder Passport
              </span>
            </div>
          </div>
          <span
            className="rounded-full px-2.5 py-1 text-[0.5rem] uppercase tracking-[0.2em]"
            style={{
              border: `1px solid rgb(${accent.rgb} / 0.5)`,
              color: accent.hex,
              background: `rgb(${accent.rgb} / 0.08)`,
            }}
          >
            {tierLabel}
          </span>
        </div>

        {/* Score ring */}
        <div className="relative h-36 w-36">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
            <defs>
              <linearGradient id="passport-card-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#f4d97b" />
                <stop offset="100%" stopColor={accent.hex} />
              </linearGradient>
            </defs>
            <circle cx="60" cy="60" r={R} fill="none" stroke="#23282b" strokeWidth="7" />
            <circle
              cx="60"
              cy="60"
              r={R}
              fill="none"
              stroke="url(#passport-card-grad)"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={offset}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="font-display text-5xl"
              style={{ color: "#f4d97b", textShadow: "0 0 16px rgb(244 217 123 / 0.4)" }}
            >
              {truthScore}
            </span>
            <span className="text-[0.6rem] uppercase tracking-[0.25em] text-muted">
              / 100 Truth Score
            </span>
          </div>
        </div>

        {/* Founder */}
        <div className="flex flex-col gap-0.5">
          <span className="text-[0.55rem] uppercase tracking-[0.3em] text-muted">
            Founder
          </span>
          <span className="font-display text-xl" style={{ color: "#eceae3" }}>
            @{username || "unknown"}
          </span>
        </div>

        {/* Startup vision */}
        {startupIdea && (
          <div className="flex w-full flex-col gap-1">
            <span className="text-[0.55rem] uppercase tracking-[0.3em]" style={{ color: accent.hex }}>
              Startup Vision
            </span>
            <p
              className="text-sm leading-relaxed"
              style={{
                color: "rgb(236 234 227 / 0.85)",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {startupIdea}
            </p>
          </div>
        )}

        {/* AI verdict summary */}
        {summary && (
          <div className="flex w-full flex-col gap-1">
            <span className="text-[0.55rem] uppercase tracking-[0.3em]" style={{ color: accent.hex }}>
              AI Verdict
            </span>
            <p className="text-xs italic leading-relaxed" style={{ color: "rgb(139 144 136 / 1)" }}>
              {summary}
            </p>
          </div>
        )}

        {/* Footer */}
        <div
          className="mt-1 flex w-full items-center justify-between border-t pt-4 text-[0.55rem] uppercase tracking-[0.2em]"
          style={{ borderColor: "#23282b" }}
        >
          <span className="text-muted">
            Verified on <span style={{ color: "#34e3a8" }}>Somnia</span>
          </span>
          <span className="text-muted">AI Reputation Credential</span>
        </div>
      </div>
    </div>
  );
});

export default FounderPassport;
