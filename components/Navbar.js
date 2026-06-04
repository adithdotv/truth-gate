"use client";

import Link from "next/link";
import { useWallet } from "@/components/WalletProvider";
import { shortenAddress } from "@/lib/wallet";

// Minimal transparent navbar for TruthGate.
export default function Navbar() {
  const { isConnected, isCorrectNetwork, address, connecting, connect, switchNetwork } =
    useWallet();

  function renderWalletButton() {
    if (isConnected && !isCorrectNetwork) {
      return (
        <button
          type="button"
          onClick={switchNetwork}
          className="flex h-9 items-center rounded-full border border-[rgb(248_113_113_/_0.5)] bg-[rgb(248_113_113_/_0.08)] px-4 text-sm tracking-wide text-[rgb(248_113_113)] transition-all hover:bg-[rgb(248_113_113_/_0.15)]"
        >
          Wrong Network
        </button>
      );
    }

    if (isConnected) {
      return (
        <span className="flex h-9 items-center rounded-full border border-emerald/40 bg-emerald/5 px-4 font-mono text-sm tracking-wide text-emerald-bright">
          {shortenAddress(address)}
        </span>
      );
    }

    return (
      <button
        type="button"
        onClick={connect}
        disabled={connecting}
        className="flex h-9 items-center rounded-full border border-emerald/40 bg-emerald/5 px-4 text-sm tracking-wide text-emerald-bright transition-all hover:border-emerald hover:bg-emerald/10 hover:text-glow-emerald disabled:opacity-50"
      >
        {connecting ? "Connecting…" : "Connect Wallet"}
      </button>
    );
  }

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
            <Link href="/#about" className="transition-colors hover:text-foreground">
              About
            </Link>
            <Link href="/submit" className="transition-colors hover:text-foreground">
              Submit
            </Link>
          </div>

          {renderWalletButton()}
        </div>
      </div>
    </nav>
  );
}
