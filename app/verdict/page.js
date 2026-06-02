import Link from "next/link";
import Navbar from "@/components/Navbar";
import VerdictCard from "@/components/VerdictCard";

// Verdict route — the gate's ruling.
// TODO: fetch the real verdict (by id) from the agent/contract instead of
// echoing the submitted claim from the query string.
export default async function VerdictPage({ searchParams }) {
  const params = await searchParams;
  const claim = params?.claim ?? "";

  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col items-center justify-center gap-10 py-24">
        <header className="px-6 text-center">
          <h1 className="font-display text-3xl text-glow-emerald">
            The gate has spoken
          </h1>
        </header>

        <VerdictCard
          verdict="granted"
          claim={claim || "No claim was presented."}
          reason="Placeholder ruling — wire this to the Somnia Agent's response."
        />

        <Link
          href="/submit"
          className="font-display text-sm uppercase tracking-widest text-gold transition-colors hover:text-glow-gold"
        >
          Present another claim
        </Link>
      </main>
    </>
  );
}
