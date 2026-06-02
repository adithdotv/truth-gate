// Placeholder: loading state shown while the oracle deliberates.
// TODO: replace spinner with real progress / streaming status.
export default function LoadingGate({ message = "The oracle is deliberating…" }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24">
      <div
        className="h-10 w-10 animate-spin rounded-full border-2 border-zinc-300 border-t-foreground"
        role="status"
        aria-label="Loading"
      />
      <p className="text-sm text-zinc-600 dark:text-zinc-400">{message}</p>
    </div>
  );
}
