"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Reveal from "@/components/Reveal";
import RichText from "@/components/RichText";
import { getTrustTier, parseTechStack } from "@/lib/contract";

// Cinematic verdict reveal — the gatekeeper's onchain ruling.
// Styling adapts to the trust tier:
//   verified → emerald · moderate → gold · low → rose-red
const TIER_ACCENT = {
  verified: "52 227 168", // emerald
  moderate: "244 217 123", // gold
  low: "248 113 113", // rose-red
};

const TIER_BLURB = {
  verified: "Strong, credible onchain signal. The gate opens.",
  moderate: "Promising signal, with room left to prove.",
  low: "Insufficient signal to vouch for this builder yet.",
};

// Categorize comma-separated tech tokens into sensible buckets.
const TECH_BUCKETS = [
  {
    category: "Frontend",
    match: ["react", "next", "vue", "angular", "svelte", "tailwind", "css", "html", "javascript", "typescript", "redux", "vite", "webpack", "sass", "bootstrap", "remix"],
  },
  {
    category: "Backend",
    match: ["node", "express", "django", "flask", "rails", "spring", "fastapi", "graphql", "postgres", "mysql", "mongo", "redis", "python", "java", "golang", "go", "rust", "php", "ruby", "laravel", ".net", "c#", "nest", "prisma", "sql", "supabase", "firebase"],
  },
  {
    category: "Web3",
    match: ["solidity", "ethers", "web3", "hardhat", "foundry", "wagmi", "viem", "ethereum", "somnia", "evm", "smart contract", "blockchain", "truffle", "ipfs", "chainlink"],
  },
  {
    category: "Tools",
    match: ["docker", "kubernetes", "k8s", "git", "github", "gitlab", "aws", "gcp", "azure", "vercel", "netlify", "jest", "cypress", "figma", "linux", "nginx", "ci"],
  },
];

function categorizeTech(tokens) {
  const groups = new Map();
  for (const token of tokens) {
    const lower = token.toLowerCase();
    const bucket = TECH_BUCKETS.find((b) =>
      b.match.some((m) => lower.includes(m) || m.includes(lower)),
    );
    const key = bucket ? bucket.category : "Other";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(token);
  }
  // Stable order: known buckets first, then Other.
  const order = [...TECH_BUCKETS.map((b) => b.category), "Other"];
  return order
    .filter((c) => groups.has(c))
    .map((category) => ({ category, items: groups.get(category) }));
}

function TierIcon({ tier }) {
  if (tier === "verified") {
    return <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />;
  }
  if (tier === "low") {
    return <path d="M7 7l10 10M17 7L7 17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />;
  }
  return <path d="M6 12h12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />;
}

function Stat({ label, value }) {
  return (
    <div className="flex flex-1 flex-col items-center gap-1">
      <span className="font-display text-2xl text-foreground sm:text-3xl">
        {value}
      </span>
      <span className="text-[0.6rem] uppercase tracking-[0.25em] text-muted">
        {label}
      </span>
    </div>
  );
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

export default function VerdictCard({ reputation }) {
  const {
    username = "",
    bio = "",
    createdAt = "",
    portfolioUrl = "",
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
  const techGroups = categorizeTech(parseTechStack(detectedTechStack));

  // Ring geometry
  const R = 54;
  const CIRC = 2 * Math.PI * R;

  const [display, setDisplay] = useState(0);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDrawn(true), 200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    let raf;
    const duration = 1600;
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
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      {/* ════════ TRUTH SCORE HERO ════════ */}
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-10 h-64 w-64 -translate-x-1/2 animate-pulse rounded-full blur-2xl"
          style={{ background: `radial-gradient(circle, rgb(${accent} / 0.35), transparent 70%)` }}
        />

        <div
          className="panel relative flex flex-col items-center gap-6 p-6 text-center sm:p-8"
          style={{
            boxShadow: `0 0 0 1px rgb(${accent} / 0.34), 0 0 22px rgb(${accent} / 0.18), inset 0 0 28px rgb(${accent} / 0.05)`,
          }}
        >
          {/* Tier seal + identity */}
          <div className="animate-seal-in flex flex-col items-center gap-4">
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

          {/* Score ring */}
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
              <circle cx="60" cy="60" r={R} fill="none" stroke="var(--border)" strokeWidth="6" />
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
                  transition: "stroke-dashoffset 1.6s cubic-bezier(0.22,1,0.36,1)",
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

          {/* Builder status */}
          <div
            className="animate-fade-in-up flex flex-col items-center gap-1"
            style={{ animationDelay: "0.5s" }}
          >
            <span
              className="rounded-full px-4 py-1 text-xs uppercase tracking-[0.25em]"
              style={{
                border: `1px solid rgb(${accent} / 0.4)`,
                color: `rgb(${accent})`,
                backgroundColor: `rgb(${accent} / 0.06)`,
              }}
            >
              Builder Status · {label}
            </span>
            <p className="mt-1 max-w-xs text-sm text-muted">{TIER_BLURB[tier]}</p>
          </div>
        </div>
      </div>

      {/* ════════ AI FOUNDER VERDICT ════════ */}
      <Reveal as="section" className="panel flex flex-col gap-4 p-6 sm:p-8">
        <SectionLabel accent={accent}>AI Founder Verdict</SectionLabel>
        <h3 className="font-display text-xl text-glow-gold sm:text-2xl">
          TruthGate AI Verdict
        </h3>
        {aiVerdict ? (
          <div className="relative">
            <span
              aria-hidden
              className="absolute left-0 top-0 h-full w-px rounded"
              style={{ background: `rgb(${accent} / 0.5)` }}
            />
            <RichText
              text={aiVerdict}
              className="pl-5 text-base text-foreground/90"
            />
          </div>
        ) : (
          <p className="text-sm italic text-muted">No AI verdict generated</p>
        )}
      </Reveal>

      {/* ════════ STARTUP VISION ════════ */}
      <Reveal as="section" className="panel flex flex-col gap-4 p-6 sm:p-8">
        <SectionLabel accent={accent}>Startup Idea</SectionLabel>
        <h3 className="font-display text-xl text-glow-gold sm:text-2xl">
          Startup Vision
        </h3>
        {startupIdea ? (
          <p className="whitespace-pre-wrap text-base leading-relaxed text-foreground/90">
            {startupIdea}
          </p>
        ) : (
          <p className="text-sm italic text-muted">No startup idea available</p>
        )}
      </Reveal>

      {/* ════════ PORTFOLIO SUMMARY ════════ */}
      <Reveal as="section" className="panel flex flex-col gap-4 p-6 sm:p-8">
        <SectionLabel accent={accent}>Portfolio Intelligence</SectionLabel>
        <h3 className="font-display text-xl text-glow-gold sm:text-2xl">
          Portfolio Summary
        </h3>
        {portfolioSummary ? (
          <div className="relative">
            <span
              aria-hidden
              className="absolute left-0 top-0 h-full w-px rounded"
              style={{ background: `rgb(${accent} / 0.5)` }}
            />
            <RichText
              text={portfolioSummary}
              className="pl-5 text-base text-foreground/90"
            />
          </div>
        ) : (
          <p className="text-sm italic text-muted">
            No portfolio summary available
          </p>
        )}
        {portfolioUrl && (
          <a
            href={portfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs tracking-wide text-muted underline-offset-4 transition-colors hover:text-glow-emerald hover:underline"
          >
            {portfolioUrl}
          </a>
        )}
      </Reveal>

      {/* ════════ DETECTED TECH STACK ════════ */}
      <Reveal as="section" className="panel flex flex-col gap-5 p-6 sm:p-8">
        <SectionLabel accent={accent}>Detected Tech Stack</SectionLabel>
        {techGroups.length > 0 ? (
          <div className="flex flex-col gap-5">
            {techGroups.map((group) => (
              <div key={group.category} className="flex flex-col gap-3">
                <span className="text-xs uppercase tracking-[0.2em] text-muted">
                  {group.category}
                </span>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3.5 py-1.5 font-mono text-xs tracking-wide text-foreground transition-all duration-300 hover:border-emerald/50 hover:text-glow-emerald hover:shadow-[0_0_16px_rgba(52,227,168,0.18)]"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-gold-bright shadow-[0_0_8px_rgba(244,217,123,0.8)]" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm italic text-muted">
            No technical signals were detected from the portfolio.
          </p>
        )}
      </Reveal>

      {/* ════════ GITHUB METRICS ════════ */}
      <Reveal as="section" className="panel flex flex-col gap-5 p-6 sm:p-8">
        <SectionLabel accent={accent}>GitHub Metrics</SectionLabel>
        <div className="flex items-stretch">
          <Stat label="Followers" value={followers} />
          <div className="w-px bg-border" />
          <Stat label="Following" value={following} />
          <div className="w-px bg-border" />
          <Stat label="Repositories" value={publicRepos} />
        </div>
        {bio && <p className="text-sm leading-relaxed text-muted">{bio}</p>}
        {createdAt && (
          <p className="text-xs uppercase tracking-[0.2em] text-muted/70">
            On GitHub since {createdAt}
          </p>
        )}
      </Reveal>

      {/* ════════ FINAL VERDICT ════════ */}
      <Reveal as="section" className="flex flex-col items-center gap-5 py-4 text-center">
        <hr className="rule-aurora w-full" />
        <p className="max-w-md font-display text-lg text-foreground">
          The autonomous Gatekeeper has rendered its verdict —{" "}
          <span style={{ color: `rgb(${accent})` }}>{label}</span>, recorded
          onchain.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/submit"
            className="flex h-12 items-center justify-center rounded-full border border-border px-8 font-display text-sm uppercase tracking-[0.2em] text-foreground transition-all hover:border-emerald/50 hover:text-glow-emerald"
          >
            Analyze Another
          </Link>
          <Link
            href="/"
            className="glow-gold flex h-12 items-center justify-center rounded-full bg-surface-elevated px-8 font-display text-sm uppercase tracking-[0.2em] text-gold-bright transition-all hover:scale-[1.03] hover:bg-surface"
          >
            Return Home
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
