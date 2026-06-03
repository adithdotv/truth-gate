import Link from "next/link";
import Navbar from "@/components/Navbar";
import Reveal from "@/components/Reveal";

export const metadata = {
  title: "About · TruthGate",
  description:
    "TruthGate is a decentralized AI reputation protocol on Somnia — verifying developer trust directly from onchain-analyzed GitHub activity.",
};

// TODO: point this at the real repository.
const GITHUB_URL = "https://github.com/adithdotv/truth-gate";

const PROBLEMS = [
  {
    title: "Fabricated reputation",
    body: "Followers, stars, and endorsements are trivially bought. Surface metrics no longer signal real credibility.",
  },
  {
    title: "Centralized trust",
    body: "A handful of platforms own every reputation graph. They can gate, edit, or erase your standing at will.",
  },
  {
    title: "Unverifiable credentials",
    body: "Résumés and profiles are self-reported. There is no cryptographic way to prove what someone actually built.",
  },
  {
    title: "Anonymous scams",
    body: "Throwaway accounts impersonate builders and drain communities. Identity carries no provable history.",
  },
  {
    title: "Hiring is guesswork",
    body: "Teams spend weeks manually vetting contributors with no portable, trustworthy signal to rely on.",
  },
  {
    title: "Trust isn't portable",
    body: "Reputation earned on one platform can't travel. It dies the moment you leave the walled garden.",
  },
];

const SOLUTIONS = [
  {
    title: "Onchain reputation",
    body: "Every verdict is written to Somnia — a permanent, tamper-proof record no platform can revoke.",
  },
  {
    title: "AI-powered scoring",
    body: "Autonomous agents weigh real signals — contribution depth, account history, network — into a single Truth Score.",
  },
  {
    title: "Decentralized verification",
    body: "No central authority decides who's credible. A validator subcommittee reaches consensus on the result.",
  },
  {
    title: "Transparent signals",
    body: "The score, its inputs, and the reasoning are all public and auditable — trust you can independently verify.",
  },
];

const STEPS = [
  {
    title: "Enter a GitHub username",
    body: "A developer presents their handle at the gate — the only input the protocol needs.",
  },
  {
    title: "Somnia agents fetch live data",
    body: "Onchain AI agents pull followers, repositories, network, bio, and account age straight from the source.",
  },
  {
    title: "AI analyzes reputation",
    body: "LLM inference weighs the evidence, separating organic credibility from inflated vanity metrics.",
  },
  {
    title: "Truth Score is generated",
    body: "A 0–100 score and trust tier — Low, Moderate, or Verified Builder — are computed by consensus.",
  },
  {
    title: "Reputation is stored onchain",
    body: "The verdict is committed to Somnia, becoming a portable, permanent credential anyone can read.",
  },
];

const AGENTS = [
  {
    tag: "AGENT // 01",
    title: "JSON API Request",
    body: "Queries structured endpoints to pull verifiable GitHub data — followers, repos, following, account age — as live onchain input.",
  },
  {
    tag: "AGENT // 02",
    title: "LLM Inference",
    body: "Reasons over the gathered signals, detecting authenticity patterns and synthesizing them into a defensible Truth Score.",
  },
  {
    tag: "AGENT // 03",
    title: "Website Parsing",
    body: "Reads public profile surfaces directly, corroborating identity and enriching the reputation picture beyond raw numbers.",
  },
];

const VISION = [
  {
    title: "Decentralized hiring",
    body: "Teams hire against portable, provable reputation instead of unverifiable résumés.",
  },
  {
    title: "Onchain developer identity",
    body: "A credential you own — not rented from a platform that can revoke it.",
  },
  {
    title: "Trustless contributor reputation",
    body: "DAOs and protocols reward real contribution backed by verifiable signal.",
  },
  {
    title: "AI-native verification",
    body: "Autonomous agents become the default arbiters of digital trust.",
  },
];

const TECH = [
  "Somnia",
  "Solidity",
  "Next.js",
  "ethers.js",
  "AI Agents",
  "GitHub API",
];

// ── Small presentational helpers ────────────────────────────────
function Eyebrow({ children, tone = "emerald" }) {
  const cls = tone === "gold" ? "text-glow-gold" : "text-glow-emerald";
  return (
    <span className={`font-display text-xs uppercase tracking-[0.4em] ${cls}`}>
      {children}
    </span>
  );
}

function SectionHeading({ children }) {
  return (
    <h2 className="font-display text-3xl leading-tight sm:text-5xl">
      {children}
    </h2>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-emerald-bright" aria-hidden>
      <path
        d="M5 13l4 4L19 7"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const CARD =
  "panel p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-[0_0_28px_rgba(244,217,123,0.12)]";

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main className="flex flex-1 flex-col">
        {/* ════════ 1 · HERO ════════ */}
        <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden px-6 pt-24">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="orb animate-drift left-1/2 top-[10%] h-72 w-72 -translate-x-1/2 bg-[radial-gradient(circle,rgba(244,217,123,0.5),transparent_70%)] sm:h-[26rem] sm:w-[26rem]" />
            <div className="orb animate-drift-slow left-[12%] bottom-[6%] h-64 w-64 bg-[radial-gradient(circle,rgba(52,227,168,0.45),transparent_70%)] sm:h-96 sm:w-96" />
            <div className="orb animate-drift right-[10%] top-[24%] h-56 w-56 bg-[radial-gradient(circle,rgba(244,217,123,0.35),transparent_70%)] sm:h-80 sm:w-80" />
            <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
          </div>

          <Reveal className="relative z-10 flex max-w-3xl flex-col items-center gap-6 text-center">
            <Eyebrow>Decentralized AI Reputation Protocol</Eyebrow>
            <h1 className="text-gradient animate-shimmer font-display text-4xl font-bold leading-[1.05] sm:text-7xl">
              Building the Trust Layer for the Internet
            </h1>
            <p className="max-w-xl text-lg text-muted sm:text-xl">
              TruthGate uses decentralized AI agents on Somnia to verify
              developer reputation directly from GitHub activity — turning real
              work into a portable, onchain Truth Score.
            </p>
            <div className="mt-4 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/submit"
                className="glow-gold flex h-12 items-center justify-center rounded-full bg-surface-elevated px-8 font-display text-sm uppercase tracking-[0.2em] text-gold-bright transition-all hover:scale-[1.03] hover:bg-surface"
              >
                Analyze Reputation
              </Link>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 items-center justify-center rounded-full border border-border px-8 font-display text-sm uppercase tracking-[0.2em] text-foreground transition-all hover:border-emerald/50 hover:text-glow-emerald"
              >
                View GitHub
              </a>
            </div>
          </Reveal>
        </section>

        {/* ════════ 2 · THE PROBLEM ════════ */}
        <section className="mx-auto w-full max-w-5xl px-6 py-24">
          <Reveal className="flex flex-col items-center gap-4 text-center">
            <Eyebrow tone="gold">The Problem</Eyebrow>
            <SectionHeading>Online trust is broken</SectionHeading>
            <p className="max-w-2xl text-muted">
              Reputation today is performative, centralized, and impossible to
              prove. The signals we rely on can be bought, faked, or revoked.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PROBLEMS.map((p, i) => (
              <Reveal key={p.title} delay={i * 70}>
                <div className={CARD}>
                  <span className="font-mono text-sm text-[rgb(248_113_113)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 font-display text-xl">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {p.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <div className="rule-aurora mx-auto w-full max-w-5xl" />

        {/* ════════ 3 · THE SOLUTION ════════ */}
        <section className="mx-auto w-full max-w-5xl px-6 py-24">
          <Reveal className="flex flex-col items-center gap-4 text-center">
            <Eyebrow>The Solution</Eyebrow>
            <SectionHeading>
              Reputation, <span className="text-glow-emerald">verified onchain</span>
            </SectionHeading>
            <p className="max-w-2xl text-muted">
              TruthGate replaces vanity metrics with cryptographic truth — an
              AI-scored, decentralized credential that belongs to you.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-5 sm:grid-cols-2">
            {SOLUTIONS.map((s, i) => (
              <Reveal key={s.title} delay={i * 80}>
                <div className={`${CARD} flex gap-4`}>
                  <div className="glow-emerald mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald/10">
                    <CheckIcon />
                  </div>
                  <div>
                    <h3 className="font-display text-xl">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {s.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <div className="rule-aurora mx-auto w-full max-w-5xl" />

        {/* ════════ 4 · HOW IT WORKS ════════ */}
        <section className="mx-auto w-full max-w-3xl px-6 py-24">
          <Reveal className="flex flex-col items-center gap-4 text-center">
            <Eyebrow tone="gold">How It Works</Eyebrow>
            <SectionHeading>From handle to onchain verdict</SectionHeading>
          </Reveal>

          <ol className="mt-14 flex flex-col">
            {STEPS.map((step, i) => (
              <Reveal key={step.title} delay={i * 90} as="li">
                <div className="flex gap-5">
                  {/* Node + connecting line */}
                  <div className="flex flex-col items-center">
                    <span className="glow-gold flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-elevated font-display text-gold-bright">
                      {i + 1}
                    </span>
                    {i < STEPS.length - 1 && (
                      <span className="my-1 w-px flex-1 bg-gradient-to-b from-gold/50 to-emerald/30" />
                    )}
                  </div>
                  <div className="pb-10">
                    <h3 className="font-display text-xl">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {step.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </section>

        {/* ════════ 5 · SOMNIA AGENTS ════════ */}
        <section className="relative overflow-hidden px-6 py-24">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(52,227,168,0.08),transparent_70%)] blur-3xl"
          />
          <div className="relative mx-auto w-full max-w-5xl">
            <Reveal className="flex flex-col items-center gap-4 text-center">
              <Eyebrow>Powered by Somnia Agents</Eyebrow>
              <SectionHeading>Three agents, one verdict</SectionHeading>
              <p className="max-w-2xl text-muted">
                TruthGate orchestrates autonomous onchain agents on Somnia. Each
                request fans out to a validator subcommittee that reaches
                consensus before anything is written to chain.
              </p>
            </Reveal>

            <div className="mt-14 grid gap-5 lg:grid-cols-3">
              {AGENTS.map((a, i) => (
                <Reveal key={a.title} delay={i * 90}>
                  <div className={`${CARD} h-full`}>
                    <span className="font-mono text-xs tracking-[0.2em] text-emerald-bright">
                      {a.tag}
                    </span>
                    <h3 className="mt-3 font-display text-2xl text-glow-gold">
                      {a.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted">
                      {a.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <div className="rule-aurora mx-auto w-full max-w-5xl" />

        {/* ════════ 6 · WHY IT MATTERS ════════ */}
        <section className="mx-auto w-full max-w-5xl px-6 py-24">
          <Reveal className="flex flex-col items-center gap-4 text-center">
            <Eyebrow tone="gold">Why It Matters</Eyebrow>
            <SectionHeading>
              A <span className="text-gradient">trust-native</span> internet
            </SectionHeading>
            <p className="max-w-2xl text-muted">
              Reputation is the missing primitive of the open web. TruthGate is
              the first layer where it becomes provable, portable, and yours.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VISION.map((v, i) => (
              <Reveal key={v.title} delay={i * 80}>
                <div className={`${CARD} h-full`}>
                  <h3 className="font-display text-lg text-glow-emerald">
                    {v.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {v.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ════════ 7 · TECH STACK ════════ */}
        <section className="mx-auto w-full max-w-5xl px-6 py-24">
          <Reveal className="flex flex-col items-center gap-4 text-center">
            <Eyebrow>Built With</Eyebrow>
            <SectionHeading>A modern onchain-AI stack</SectionHeading>
          </Reveal>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            {TECH.map((name, i) => (
              <Reveal key={name} delay={i * 60}>
                <span className="panel flex items-center gap-2 px-5 py-3 font-mono text-sm tracking-wide text-foreground transition-all duration-300 hover:border-emerald/50 hover:text-glow-emerald hover:shadow-[0_0_22px_rgba(52,227,168,0.15)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold-bright shadow-[0_0_8px_rgba(244,217,123,0.8)]" />
                  {name}
                </span>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ════════ 8 · FINAL CTA ════════ */}
        <section className="relative overflow-hidden px-6 py-32">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="orb animate-drift left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,rgba(244,217,123,0.4),transparent_70%)] sm:h-96 sm:w-96" />
            <div className="orb animate-drift-slow right-[20%] top-[30%] h-56 w-56 bg-[radial-gradient(circle,rgba(52,227,168,0.35),transparent_70%)]" />
          </div>

          <Reveal className="relative z-10 mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
            <h2 className="text-gradient animate-shimmer font-display text-4xl font-bold leading-tight sm:text-6xl">
              Verify Reputation Onchain
            </h2>
            <p className="max-w-md text-lg text-muted">
              Step through the gate. Let the autonomous agents render their
              verdict — and mint your Truth Score on Somnia.
            </p>
            <Link
              href="/submit"
              className="pulse-glow mt-2 flex h-14 items-center justify-center gap-2 rounded-full bg-surface-elevated px-10 font-display text-base uppercase tracking-[0.2em] text-gold-bright transition-all hover:scale-[1.03] hover:bg-surface"
            >
              Launch TruthGate
              <span aria-hidden>→</span>
            </Link>
          </Reveal>
        </section>
      </main>
    </>
  );
}
