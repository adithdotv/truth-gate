// Placeholder: displays the final verdict for a submitted claim.
// TODO: map verdict values to styling and show confidence / sources.
export default function VerdictCard({ verdict = "pending", claim = "", reason = "" }) {
  return (
    <div className="mx-auto w-full max-w-xl rounded-xl border border-black/[.08] p-6 dark:border-white/[.145]">
      <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
        Verdict
      </span>
      <p className="mt-1 text-2xl font-semibold capitalize">{verdict}</p>
      {claim && (
        <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
          <span className="font-medium">Claim:</span> {claim}
        </p>
      )}
      {reason && (
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          <span className="font-medium">Reasoning:</span> {reason}
        </p>
      )}
    </div>
  );
}
