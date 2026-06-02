// Placeholder: renders the oracle's narrated reasoning.
// TODO: support streamed text and markdown formatting.
export default function OracleText({ text = "" }) {
  return (
    <div className="mx-auto max-w-xl px-6">
      <p className="whitespace-pre-wrap font-mono text-sm leading-7 text-zinc-700 dark:text-zinc-300">
        {text || "Awaiting the oracle's words…"}
      </p>
    </div>
  );
}
