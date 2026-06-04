"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PassportCard from "@/components/PassportCard";
import LoadingGate from "@/components/LoadingGate";
import { fetchReputation } from "@/lib/contract";

// Reads on-chain reputation for `address` (via RPC, so it survives refreshes
// and works without a connected wallet) and renders the Founder Passport.
export default function PassportView({ address }) {
  const [reputation, setReputation] = useState(null);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    if (!address) return;
    let mounted = true;
    fetchReputation({ address })
      .then((rep) => mounted && setReputation(rep))
      .catch(() => mounted && setLoadError("Couldn't load this passport from the chain."));
    return () => {
      mounted = false;
    };
  }, [address]);

  const error = !address
    ? "No wallet address was provided."
    : loadError ||
      (reputation && !reputation.analyzed
        ? "This founder hasn't been analyzed yet."
        : null);

  if (error) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center">
        <div className="panel animate-fade-in-up flex w-full max-w-md flex-col items-center gap-5 p-8 text-center">
          <span className="font-display text-2xl text-[rgb(248_113_113)]">
            No passport found
          </span>
          <p className="text-muted">{error}</p>
          <Link
            href="/submit"
            className="glow-gold flex h-11 items-center justify-center rounded-full bg-surface-elevated px-7 font-display text-sm uppercase tracking-[0.2em] text-gold-bright transition-all hover:scale-[1.03] hover:bg-surface"
          >
            Approach the Gate
          </Link>
        </div>
      </div>
    );
  }

  if (!reputation) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center">
        <LoadingGate message="Issuing founder passport..." />
      </div>
    );
  }

  return <PassportCard reputation={reputation} address={address} />;
}
