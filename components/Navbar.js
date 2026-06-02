import Link from "next/link";

// Placeholder: top navigation bar for Truth Gate.
// TODO: wire up active-route highlighting and connect/auth state.
export default function Navbar() {
  return (
    <nav className="w-full border-b border-black/[.08] dark:border-white/[.145]">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Truth Gate
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium">
          <Link href="/submit" className="hover:underline">
            Submit
          </Link>
          <Link href="/verdict" className="hover:underline">
            Verdict
          </Link>
        </div>
      </div>
    </nav>
  );
}
