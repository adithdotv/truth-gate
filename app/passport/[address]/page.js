import Navbar from "@/components/Navbar";
import PassportView from "@/components/PassportView";

export const metadata = {
  title: "Founder Passport · TruthGate",
  description: "An onchain-verified founder identity, issued by the TruthGate oracle on Somnia.",
};

// Founder Passport route — the shareable identity layer.
export default async function PassportPage({ params }) {
  const { address } = await params;

  return (
    <>
      <Navbar />
      <main className="flex min-h-[100svh] flex-1 flex-col items-center px-6 pb-24 pt-28">
        <PassportView address={address} />
      </main>
    </>
  );
}
