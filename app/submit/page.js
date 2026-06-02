"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import SubmissionForm from "@/components/SubmissionForm";
import LoadingGate from "@/components/LoadingGate";
import OracleText from "@/components/OracleText";

// Submit route — present your claim to the gatekeeper.
// TODO: replace the simulated delay with a real Somnia Agent call,
// then route to /verdict with the agent's response.
export default function SubmitPage() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  function handleSubmit(claim) {
    setPending(true);
    // Placeholder: pretend the oracle is deliberating, then reveal a verdict.
    const params = new URLSearchParams({ claim });
    setTimeout(() => router.push(`/verdict?${params.toString()}`), 2200);
  }

  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col items-center justify-center gap-10 py-24">
        {pending ? (
          <>
            <LoadingGate message="The gate weighs your words…" />
            <OracleText text="" />
          </>
        ) : (
          <>
            <header className="px-6 text-center">
              <h1 className="font-display text-3xl text-glow-gold">
                State your claim
              </h1>
              <p className="mt-2 text-muted">
                The gatekeeper listens. Be convincing.
              </p>
            </header>
            <SubmissionForm onSubmit={handleSubmit} />
          </>
        )}
      </main>
    </>
  );
}
