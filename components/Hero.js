import Link from "next/link";

// Placeholder: landing hero introducing Truth Gate.
// TODO: replace copy and add real CTA / illustration.
export default function Hero() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 py-24 text-center">
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
        Pass your claim through the Truth Gate
      </h1>
      <p className="max-w-md text-lg text-zinc-600 dark:text-zinc-400">
        Submit a statement and let the oracle render its verdict.
      </p>
      <Link
        href="/submit"
        className="flex h-12 items-center justify-center rounded-full bg-foreground px-6 text-background transition-colors hover:opacity-90"
      >
        Get started
      </Link>
    </section>
  );
}
