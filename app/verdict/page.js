import Navbar from "@/components/Navbar";
import VerdictCard from "@/components/VerdictCard";
import { evaluateSubmission } from "@/lib/mockEvaluation";

// Verdict route — the gate's ruling.
// TODO: replace evaluateSubmission() with the real Somnia Agent result
// (looked up by submission id) instead of evaluating on each request.
export default async function VerdictPage({ searchParams }) {
  const params = await searchParams;
  const claim = params?.claim ?? "";
  const github = params?.github ?? "";
  const website = params?.website ?? "";

  const verdict = evaluateSubmission({ idea: claim, github, website });

  return (
    <>
      <Navbar />
      <main className="flex min-h-[100svh] flex-1 flex-col items-center justify-center px-6 py-20">
        <VerdictCard
          status={verdict.status}
          score={verdict.score}
          reasoning={verdict.reasoning}
          claim={claim}
        />
      </main>
    </>
  );
}
