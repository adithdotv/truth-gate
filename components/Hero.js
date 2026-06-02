import Link from "next/link";

// Landing hero — the threshold of the vault.
export default function Hero() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center gap-8 px-6 py-32 text-center">
      <span className="font-display text-sm uppercase tracking-[0.4em] text-glow-gold">
        TruthGate
      </span>

      <h1 className="font-display text-4xl font-semibold leading-tight sm:text-6xl">
        Convince the AI.
        <br />
        <span className="text-glow-emerald">Earn onchain trust.</span>
      </h1>

      <p className="max-w-md text-lg text-muted">
        An autonomous AI gatekeeper powered by Somnia Agents.
      </p>

      <Link
        href="/submit"
        className="glow-gold mt-2 flex h-12 items-center justify-center rounded-full bg-surface-elevated px-8 font-display text-sm uppercase tracking-widest text-gold-bright transition-colors hover:bg-surface"
      >
        Enter the Gate
      </Link>
    </section>
  );
}
