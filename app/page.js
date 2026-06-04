import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import LandingSections from "@/components/LandingSections";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col">
        <Hero />
        <LandingSections />
      </main>
    </>
  );
}
