import Link from "next/link";

// Minimal transparent navbar for TruthGate.
// TODO: wire the connect button to the wallet / Somnia Agent session.
export default function Navbar() {
  return (
    <nav className="absolute inset-x-0 top-0 z-50 h-16">
      <div className="mx-auto flex h-full max-w-5xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          href="/"
          className="font-display text-lg font-semibold tracking-[0.15em] text-glow-gold"
        >
          TruthGate
        </Link>

        {/* Links + wallet */}
        <div className="flex items-center gap-8">
          <div className="hidden items-center gap-8 text-sm tracking-wide text-muted sm:flex">
            <Link href="/about" className="transition-colors hover:text-foreground">
              About
            </Link>
            <Link href="/submit" className="transition-colors hover:text-foreground">
              Submit
            </Link>
          </div>

          <button
            type="button"
            className="flex h-9 items-center rounded-full border border-emerald/40 bg-emerald/5 px-4 text-sm tracking-wide text-emerald-bright transition-all hover:border-emerald hover:bg-emerald/10 hover:text-glow-emerald"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    </nav>
  );
}
