"use client";

import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import Reveal from "@/components/Reveal";
import RichText from "@/components/RichText";
import { getTrustTier, parseTechStack } from "@/lib/contract";
import { shortenAddress } from "@/lib/wallet";

// The Founder Passport — TruthGate's shareable, onchain-verified identity card.
const TIER_ACCENT = {
  verified: "52 227 168", // emerald
  moderate: "244 217 123", // gold
  low: "248 113 113", // rose-red
};

const SEAL_LABEL = {
  verified: "VERIFIED BUILDER",
  moderate: "TRUSTED FOUNDER",
  low: "EMERGING BUILDER",
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Eased count-up for any numeric value.
function useCountUp(target, duration = 1500) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

function SectionLabel({ accent, children }) {
  return (
    <span
      className="font-mono text-xs uppercase tracking-[0.3em]"
      style={{ color: `rgb(${accent})` }}
    >
      {children}
    </span>
  );
}

function StatCard({ label, value, accent }) {
  const v = useCountUp(value, 1200);
  return (
    <div className="panel flex flex-1 flex-col items-center gap-1 p-5 transition-all duration-300 hover:-translate-y-1">
      <span
        className="font-display text-3xl"
        style={{
          color: `rgb(${accent})`,
          textShadow: `0 0 14px rgb(${accent} / 0.35)`,
        }}
      >
        {v}
      </span>
      <span className="text-[0.6rem] uppercase tracking-[0.25em] text-muted">
        {label}
      </span>
    </div>
  );
}

function BreakdownBar({ label, weight, value, accent }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setW(value), 200);
    return () => clearTimeout(t);
  }, [value]);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between text-sm">
        <span className="text-foreground">{label}</span>
        <span className="font-mono text-xs text-muted">{weight}% weight</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full"
          style={{
            width: `${w}%`,
            background: `linear-gradient(90deg, var(--gold-bright), rgb(${accent}))`,
            boxShadow: `0 0 12px rgb(${accent} / 0.5)`,
            transition: "width 1.1s cubic-bezier(0.22,1,0.36,1)",
          }}
        />
      </div>
    </div>
  );
}

const clamp = (n) => Math.max(8, Math.min(100, Math.round(n)));

export default function PassportCard({ reputation, address = "" }) {
  const {
    username = "",
    bio = "",
    startupIdea = "",
    portfolioSummary = "",
    detectedTechStack = "",
    aiVerdict = "",
    followers = 0,
    following = 0,
    publicRepos = 0,
    truthScore = 0,
  } = reputation ?? {};

  const { tier, label } = getTrustTier(truthScore);
  const accent = TIER_ACCENT[tier];
  const tech = parseTechStack(detectedTechStack);

  // Score ring + count-up
  const R = 54;
  const CIRC = 2 * Math.PI * R;
  const display = useCountUp(truthScore);
  const [drawn, setDrawn] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDrawn(true), 250);
    return () => clearTimeout(t);
  }, []);
  const offset = drawn ? CIRC * (1 - Math.min(truthScore, 100) / 100) : CIRC;

  // Passport metadata
  const passportId = `TG-${address.slice(2, 8).toUpperCase() || "000000"}-${truthScore}`;
  const shareUrl = `https://truth-gate-opal.vercel.app/passport/${address}`;

  // Client-only component (rendered after the fetch), so a lazy initializer
  // is safe and avoids an effect just to stamp the issue date.
  const [issued] = useState(() => {
    const d = new Date();
    return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  });

  const [copied, setCopied] = useState(false);
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }
  async function sharePassport() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "TruthGate Founder Passport",
          text: `Verified onchain — Truth Score ${truthScore} (${label}).`,
          url: shareUrl,
        });
      } catch {
        /* user cancelled */
      }
    } else {
      copyLink();
    }
  }

  // Frontend-generated score breakdown (visual explanation only).
  const breakdown = [
    { label: "GitHub Activity", weight: 25, value: clamp(followers + publicRepos * 2) },
    { label: "Portfolio Presence", weight: 20, value: portfolioSummary ? clamp(55 + portfolioSummary.length / 20) : 20 },
    { label: "Technical Depth", weight: 20, value: clamp(tech.length * 12) },
    { label: "Founder Signals", weight: 15, value: startupIdea ? clamp(45 + startupIdea.length / 8) : 25 },
    { label: "AI Assessment", weight: 20, value: clamp(truthScore) },
  ];

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      {/* glow burst */}
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 animate-pulse rounded-full blur-3xl"
          style={{ background: `radial-gradient(circle, rgb(${accent} / 0.3), transparent 70%)` }}
        />

        {/* ════════ PASSPORT HEADER ════════ */}
        <div
          className="panel animate-seal-in relative flex flex-col gap-6 overflow-hidden p-6 sm:p-8"
          style={{
            boxShadow: `0 0 0 1px rgb(${accent} / 0.3), 0 0 26px rgb(${accent} / 0.16), inset 0 0 30px rgb(${accent} / 0.05)`,
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <span className="font-display text-xs uppercase tracking-[0.45em] text-glow-gold">
                TruthGate Passport
              </span>
              <span className="font-display text-2xl text-foreground sm:text-3xl">
                {username ? `@${username}` : "Unknown Founder"}
              </span>
              <span className="font-mono text-xs text-muted">
                {shortenAddress(address)}
              </span>
            </div>
            {/* Verified seal stamp */}
            <div
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-center"
              style={{
                border: `1px solid rgb(${accent} / 0.5)`,
                backgroundColor: `rgb(${accent} / 0.08)`,
                boxShadow: `0 0 20px rgb(${accent} / 0.35)`,
                color: `rgb(${accent})`,
              }}
            >
              <span className="px-1 text-[0.5rem] font-semibold uppercase leading-tight tracking-widest">
                Somnia Verified
              </span>
            </div>
          </div>

          <hr className="rule-aurora w-full" />

          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm sm:grid-cols-3">
            <div className="flex flex-col">
              <dt className="text-[0.6rem] uppercase tracking-[0.2em] text-muted">Passport ID</dt>
              <dd className="font-mono text-foreground">{passportId}</dd>
            </div>
            <div className="flex flex-col">
              <dt className="text-[0.6rem] uppercase tracking-[0.2em] text-muted">Issued</dt>
              <dd className="text-foreground">{issued || "—"}</dd>
            </div>
            <div className="flex flex-col">
              <dt className="text-[0.6rem] uppercase tracking-[0.2em] text-muted">Network</dt>
              <dd className="text-foreground">Somnia Testnet</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* ════════ TRUTH SCORE + SEAL ════════ */}
      <div className="panel flex flex-col items-center gap-6 p-6 text-center sm:p-8">
        <div className="animate-fade-in-up relative h-44 w-44">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
            <defs>
              <linearGradient id="passport-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="var(--gold-bright)" />
                <stop offset="100%" stopColor={`rgb(${accent})`} />
              </linearGradient>
            </defs>
            <circle cx="60" cy="60" r={R} fill="none" stroke="var(--border)" strokeWidth="6" />
            <circle
              cx="60"
              cy="60"
              r={R}
              fill="none"
              stroke="url(#passport-grad)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={offset}
              style={{
                transition: "stroke-dashoffset 1.5s cubic-bezier(0.22,1,0.36,1)",
                filter: `drop-shadow(0 0 6px rgb(${accent} / 0.5))`,
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-5xl text-glow-gold">{display}</span>
            <span className="mt-1 text-[0.65rem] uppercase tracking-[0.3em] text-muted">
              Truth Score
            </span>
          </div>
        </div>

        {/* Certificate seal */}
        <div className="flex flex-col items-center gap-2">
          <span
            className="rounded-full px-6 py-2 font-display text-sm uppercase tracking-[0.3em]"
            style={{
              border: `1px solid rgb(${accent} / 0.5)`,
              color: `rgb(${accent})`,
              backgroundColor: `rgb(${accent} / 0.07)`,
              textShadow: `0 0 12px rgb(${accent} / 0.4)`,
            }}
          >
            {SEAL_LABEL[tier]}
          </span>
          <span className="text-xs uppercase tracking-[0.25em] text-muted">
            {label} · Trust Tier
          </span>
        </div>
      </div>

      {/* ════════ ORACLE VERDICT (centerpiece) ════════ */}
      <Reveal as="section" className="panel flex flex-col gap-4 p-6 sm:p-8">
        <SectionLabel accent={accent}>Oracle Verdict</SectionLabel>
        {aiVerdict ? (
          <div className="relative">
            <span
              aria-hidden
              className="absolute left-0 top-0 h-full w-px rounded"
              style={{ background: `rgb(${accent} / 0.5)` }}
            />
            <RichText text={aiVerdict} className="pl-5 text-base text-foreground/90" />
          </div>
        ) : (
          <p className="text-sm italic text-muted">No AI verdict generated</p>
        )}
      </Reveal>

      {/* ════════ STARTUP VISION ════════ */}
      <Reveal as="section" className="panel flex flex-col gap-3 p-6 sm:p-8">
        <SectionLabel accent={accent}>Startup Vision</SectionLabel>
        {startupIdea ? (
          <p className="whitespace-pre-wrap text-base leading-relaxed text-foreground/90">
            {startupIdea}
          </p>
        ) : (
          <p className="text-sm italic text-muted">No startup idea available</p>
        )}
      </Reveal>

      {/* ════════ PORTFOLIO ANALYSIS ════════ */}
      <Reveal as="section" className="panel flex flex-col gap-3 p-6 sm:p-8">
        <SectionLabel accent={accent}>Portfolio Analysis</SectionLabel>
        {portfolioSummary ? (
          <RichText text={portfolioSummary} className="text-base text-foreground/90" />
        ) : (
          <p className="text-sm italic text-muted">No portfolio summary available</p>
        )}
      </Reveal>

      {/* ════════ DETECTED STACK ════════ */}
      <Reveal as="section" className="panel flex flex-col gap-4 p-6 sm:p-8">
        <SectionLabel accent={accent}>Detected Stack</SectionLabel>
        {tech.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {tech.map((item) => (
              <span
                key={item}
                className="flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3.5 py-1.5 font-mono text-xs tracking-wide text-foreground transition-all duration-300 hover:border-emerald/50 hover:text-glow-emerald hover:shadow-[0_0_16px_rgba(52,227,168,0.18)]"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-gold-bright shadow-[0_0_8px_rgba(244,217,123,0.8)]" />
                {item}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm italic text-muted">No technical signals detected</p>
        )}
      </Reveal>

      {/* ════════ GITHUB METRICS ════════ */}
      <Reveal as="section" className="flex flex-col gap-4">
        <SectionLabel accent={accent}>GitHub Metrics</SectionLabel>
        <div className="flex gap-4">
          <StatCard label="Followers" value={followers} accent={accent} />
          <StatCard label="Following" value={following} accent={accent} />
          <StatCard label="Repositories" value={publicRepos} accent={accent} />
        </div>
        {bio && (
          <p className="text-center text-sm leading-relaxed text-muted">{bio}</p>
        )}
      </Reveal>

      {/* ════════ SCORE BREAKDOWN ════════ */}
      <Reveal as="section" className="panel flex flex-col gap-5 p-6 sm:p-8">
        <SectionLabel accent={accent}>Score Breakdown</SectionLabel>
        <div className="flex flex-col gap-5">
          {breakdown.map((b) => (
            <BreakdownBar key={b.label} {...b} accent={accent} />
          ))}
        </div>
        <p className="text-[0.65rem] italic text-muted/60">
          Breakdown is an illustrative weighting of the onchain signals.
        </p>
      </Reveal>

      {/* ════════ QR + SHARE ════════ */}
      <Reveal as="section" className="panel flex flex-col items-center gap-5 p-6 text-center sm:p-8">
        <SectionLabel accent={accent}>Verify This Passport</SectionLabel>
        <div className="rounded-2xl bg-white p-4 shadow-[0_0_24px_rgba(244,217,123,0.2)]">
          <QRCode value={shareUrl} size={144} bgColor="#ffffff" fgColor="#0b0d0e" />
        </div>
        <span className="text-xs uppercase tracking-[0.2em] text-muted">
          Scan to verify founder passport
        </span>

        <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={copyLink}
            className="flex h-11 items-center justify-center rounded-full border border-border px-6 font-display text-sm uppercase tracking-[0.2em] text-foreground transition-all hover:border-emerald/50 hover:text-glow-emerald"
          >
            {copied ? "Copied!" : "Copy Passport Link"}
          </button>
          <button
            type="button"
            onClick={sharePassport}
            className="glow-gold flex h-11 items-center justify-center rounded-full bg-surface-elevated px-6 font-display text-sm uppercase tracking-[0.2em] text-gold-bright transition-all hover:scale-[1.03] hover:bg-surface"
          >
            Share Passport
          </button>
        </div>
      </Reveal>

      {/* ════════ CTA / BRANDING ════════ */}
      <Reveal as="section" className="flex flex-col items-center gap-2 py-4 text-center">
        <hr className="rule-aurora mb-2 w-full" />
        <span className="text-xs uppercase tracking-[0.3em] text-muted">
          Verified Onchain via Somnia
        </span>
        <span className="font-display text-lg tracking-[0.15em]">
          <span className="text-glow-gold">TruthGate</span>
          <span className="text-muted"> × </span>
          <span className="text-glow-emerald">Somnia</span>
        </span>
      </Reveal>
    </div>
  );
}
