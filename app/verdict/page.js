import Navbar from "@/components/Navbar";
import VerdictView from "@/components/VerdictView";

// Verdict route — reads the gate's onchain ruling for the given wallet.
export default async function VerdictPage({ searchParams }) {
  const params = await searchParams;
  const address = params?.address ?? "";

  return (
    <>
      <Navbar />
      <main className="flex min-h-[100svh] flex-1 flex-col items-center justify-center px-6 py-20">
        <VerdictView address={address} />
      </main>
    </>
  );
}
