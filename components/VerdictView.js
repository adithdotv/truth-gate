"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import VerdictCard from "@/components/VerdictCard";
import LoadingGate from "@/components/LoadingGate";
import { fetchReputation } from "@/lib/contract";

// Client wrapper that reads the on-chain reputation for `address` and hands
// it to the (visual, unchanged) VerdictCard. Read uses a plain RPC provider,
// so it works on refresh even without a connected wallet.
export default function VerdictView({ address }) {
  const [reputation, setReputation] = useState(null);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    if (!address) return;
    let mounted = true;
    fetchReputation({ address })
      .then((rep) => mounted && setReputation(rep))
      .catch(() => mounted && setLoadError("Couldn't load onchain reputation."));
    return () => {
      mounted = false;
    };
  }, [address]);

  // Missing address is a derived condition, not effect state.
  const error = !address ? "No wallet address was provided." : loadError;

  if (error) {
    return (
      <div className="panel animate-fade-in-up flex w-full max-w-md flex-col items-center gap-5 p-8 text-center">
        <span className="font-display text-2xl text-[rgb(248_113_113)]">
          Nothing to reveal
        </span>
        <p className="text-muted">{error}</p>
        <Link
          href="/submit"
          className="glow-gold flex h-11 items-center justify-center rounded-full bg-surface-elevated px-7 font-display text-sm uppercase tracking-[0.2em] text-gold-bright transition-all hover:scale-[1.03] hover:bg-surface"
        >
          Approach the Gate
        </Link>
      </div>
    );
  }

  if (!reputation) {
    return <LoadingGate message="Reading onchain reputation..." />;
  }

  return <VerdictCard reputation={reputation} />;
}
