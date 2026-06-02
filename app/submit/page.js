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

  function handleSubmit({ idea, github, website }) {
    setPending(true);
    // Placeholder: pretend the gatekeeper is deliberating, then reveal a verdict.
    const params = new URLSearchParams({ claim: idea });
    if (github) params.set("github", github);
    if (website) params.set("website", website);
    setTimeout(() => router.push(`/verdict?${params.toString()}`), 2200);
  }

  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col items-center justify-center gap-10 px-6 pb-24 pt-32">
        {pending ? (
          <>
            <LoadingGate message="The gate weighs your words…" />
            <OracleText text="" />
          </>
        ) : (
          <>
            <header className="text-center">
              <h1 className="font-display text-3xl text-glow-gold sm:text-4xl">
                Approach the Gate
              </h1>
              <p className="mt-2 text-muted">
                Present your case. The gatekeeper listens.
              </p>
            </header>
            <SubmissionForm onSubmit={handleSubmit} />
          </>
        )}
      </main>
    </>
  );
}
