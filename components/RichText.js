// Lightweight markdown renderer for AI-generated text — supports **bold**
// and line breaks. Dependency-free; each non-empty line becomes its own row
// so labeled verdicts ("**Label:** value") read cleanly.
export default function RichText({ text, className = "" }) {
  const lines = String(text ?? "").split(/\r?\n/);

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return null;
        // Split on ** — odd-indexed segments are bold.
        const parts = trimmed.split("**");
        return (
          <p key={i} className="leading-relaxed">
            {parts.map((part, j) =>
              j % 2 === 1 ? (
                <strong key={j} className="font-semibold text-foreground">
                  {part}
                </strong>
              ) : (
                <span key={j}>{part}</span>
              ),
            )}
          </p>
        );
      })}
    </div>
  );
}
