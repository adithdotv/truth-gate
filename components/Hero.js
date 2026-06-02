import Link from "next/link";

// Cinematic landing hero — the threshold of the gate.
export default function Hero() {
  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] w-full items-center justify-center overflow-hidden px-6">
      {/* ── Animated background ─────────────────────────────────── */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {/* Drifting light orbs */}
        <div className="orb animate-drift left-1/2 top-[12%] h-72 w-72 -translate-x-1/2 bg-[radial-gradient(circle,rgba(244,217,123,0.55),transparent_70%)] sm:h-[28rem] sm:w-[28rem]" />
        <div className="orb animate-drift-slow left-[14%] bottom-[6%] h-64 w-64 bg-[radial-gradient(circle,rgba(52,227,168,0.5),transparent_70%)] sm:h-96 sm:w-96" />
        <div className="orb animate-drift right-[12%] top-[18%] h-56 w-56 bg-[radial-gradient(circle,rgba(244,217,123,0.4),transparent_70%)] sm:h-80 sm:w-80" />

        {/* The gate ring — slowly turning halo behind the title */}
        <div className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 sm:h-[44rem] sm:w-[44rem]">
          <div className="animate-spin-slow h-full w-full rounded-full border border-gold/15 [mask-image:radial-gradient(circle,transparent_55%,black_72%,transparent_78%)]" />
        </div>

        {/* Faint scanline grid for the sci-fi vibe */}
        <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      </div>

      {/* ── Content ─────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center gap-6 text-center sm:gap-8">
        <span className="font-display text-xs uppercase tracking-[0.5em] text-glow-emerald sm:text-sm">
          Somnia Oracle
        </span>

        <h1 className="text-gradient animate-shimmer font-display text-6xl font-bold leading-none sm:text-8xl">
          TruthGate
        </h1>

        <p className="max-w-xl font-display text-xl text-foreground sm:text-3xl">
          Convince the AI.{" "}
          <span className="text-glow-emerald">Earn onchain trust.</span>
        </p>

        <p className="max-w-md text-base text-muted sm:text-lg">
          An autonomous AI gatekeeper powered by Somnia Agents.
        </p>

        <Link
          href="/submit"
          className="pulse-glow group mt-4 flex h-12 items-center justify-center gap-2 rounded-full bg-surface-elevated px-8 font-display text-sm uppercase tracking-[0.2em] text-gold-bright transition-all hover:scale-[1.03] hover:bg-surface sm:h-14 sm:px-10 sm:text-base"
        >
          Enter the Gate
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </div>

      {/* Aurora seam anchoring the section to the page below */}
      <div aria-hidden className="rule-aurora absolute inset-x-0 bottom-0" />
    </section>
  );
}
