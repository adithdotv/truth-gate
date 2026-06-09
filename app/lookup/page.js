"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { isAddress } from "ethers";
import Navbar from "@/components/Navbar";
import { useWallet } from "@/components/WalletProvider";
import { shortenAddress } from "@/lib/wallet";

const FIELD =
  "w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-base text-foreground placeholder:text-muted/60 outline-none transition-all duration-300 focus:border-gold/60 focus:bg-surface focus:shadow-[0_0_0_1px_rgba(244,217,123,0.25),0_0_22px_rgba(244,217,123,0.12)]";

// Lookup — view an existing onchain verdict by wallet address.
export default function LookupPage() {
  const router = useRouter();
  const { isConnected, address, connect, connecting } = useWallet();
  const [value, setValue] = useState("");
  const [error, setError] = useState(null);

  function view(addr) {
    if (!isAddress(addr)) {
      setError("Enter a valid wallet address (0x…).");
      return;
    }
    router.push(`/verdict?address=${addr}`);
  }

  function handleSubmit(event) {
    event.preventDefault();
    view(value.trim());
  }

  return (
    <>
      <Navbar />
      <main className="flex min-h-[100svh] flex-1 flex-col items-center justify-center px-6 py-28">
        <div className="panel animate-fade-in-up flex w-full max-w-md flex-col gap-6 p-6 sm:p-8">
          <header className="flex flex-col gap-2 text-center">
            <span className="font-display text-xs uppercase tracking-[0.4em] text-glow-emerald">
              View Result
            </span>
            <h1 className="font-display text-2xl text-glow-gold sm:text-3xl">
              Find a Founder Passport
            </h1>
            <p className="text-sm text-muted">
              Look up an existing onchain verdict by wallet address.
            </p>
          </header>

          {isConnected ? (
            <button
              type="button"
              onClick={() => view(address)}
              className="glow-gold flex h-12 items-center justify-center rounded-full bg-surface-elevated px-6 font-display text-sm uppercase tracking-[0.2em] text-gold-bright transition-all hover:scale-[1.02] hover:bg-surface"
            >
              View My Passport · {shortenAddress(address)}
            </button>
          ) : (
            <button
              type="button"
              onClick={connect}
              disabled={connecting}
              className="flex h-12 items-center justify-center rounded-full border border-emerald/40 bg-emerald/5 px-6 font-display text-sm uppercase tracking-[0.2em] text-emerald-bright transition-all hover:border-emerald hover:bg-emerald/10 hover:text-glow-emerald disabled:opacity-50"
            >
              {connecting ? "Connecting…" : "Connect Wallet to View Yours"}
            </button>
          )}

          {/* divider */}
          <div className="flex items-center gap-3">
            <span className="rule-aurora flex-1" />
            <span className="text-[0.6rem] uppercase tracking-[0.3em] text-muted">
              or
            </span>
            <span className="rule-aurora flex-1" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              autoComplete="off"
              value={value}
              onChange={(event) => {
                setValue(event.target.value);
                if (error) setError(null);
              }}
              placeholder="0x… wallet address"
              aria-invalid={!!error}
              className={FIELD}
            />
            {error && (
              <span className="text-xs text-[rgb(248_113_113)]">{error}</span>
            )}
            <button
              type="submit"
              disabled={!value.trim()}
              className="flex h-12 items-center justify-center rounded-full border border-border px-6 font-display text-sm uppercase tracking-[0.2em] text-foreground transition-all hover:border-gold/50 hover:text-glow-gold disabled:cursor-not-allowed disabled:opacity-40"
            >
              View Passport
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
