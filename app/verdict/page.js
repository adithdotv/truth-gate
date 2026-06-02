import Navbar from "@/components/Navbar";
import VerdictCard from "@/components/VerdictCard";

// Verdict route — the gate's ruling.
// TODO: fetch the real verdict (by id) from the Somnia Agent instead of
// rendering the placeholder ruling below.
export default async function VerdictPage({ searchParams }) {
  const params = await searchParams;
  const claim = params?.claim ?? "";

  return (
    <>
      <Navbar />
      <main className="flex min-h-[100svh] flex-1 flex-col items-center justify-center px-6 py-20">
        <VerdictCard status="APPROVED" score={87} claim={claim} />
      </main>
    </>
  );
}
