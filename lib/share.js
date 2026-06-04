// Founder Passport sharing helpers — image export, X share, link copy.
// All functions are client-only (browser APIs) and called from event handlers.

// Public site base — used for shareable links (so they point at production
// even when viewed on localhost). Override with NEXT_PUBLIC_SITE_URL.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://truth-gate-opal.vercel.app";

/**
 * Flatten an AI verdict into a short summary for the passport image.
 * Strips markdown bold, collapses whitespace, and trims to `limit` chars.
 */
export function summarizeVerdict(verdict, limit = 180) {
  if (!verdict) return "";
  const clean = String(verdict)
    .replace(/\*\*/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (clean.length <= limit) return clean;
  return `${clean.slice(0, limit).trimEnd()}…`;
}

/**
 * Render a DOM node to a PNG and trigger a download.
 * html-to-image is imported lazily so it never ships in the SSR bundle.
 */
export async function downloadPassport(node, username) {
  if (!node) return;
  const { toPng } = await import("html-to-image");
  const dataUrl = await toPng(node, {
    pixelRatio: 2,
    cacheBust: true,
    backgroundColor: "#040506",
  });
  const link = document.createElement("a");
  link.download = `truthgate-passport-${username || "founder"}.png`;
  link.href = dataUrl;
  link.click();
}

/**
 * Open an X (Twitter) intent with a dynamic, hype founder tweet.
 * `url` (the passport link) is appended so X unfurls the passport OG image.
 */
export function shareToTwitter({ score, tier, startupIdea, url = SITE_URL }) {
  const idea =
    startupIdea && startupIdea.length > 90
      ? `${startupIdea.slice(0, 87).trimEnd()}…`
      : startupIdea || "a new venture";

  const text = `🛡️ I just faced the TruthGate and earned my Founder Passport.

⚡ Truth Score: ${score}/100
🏆 Tier: ${tier}

🚀 Building: ${idea}

Verified onchain by AI agents on Somnia. Can you pass the gate?

${url}

#TruthGate #Somnia #BuildInPublic #Web3`;

  const intent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
  window.open(intent, "_blank", "noopener,noreferrer");
}

/** Copy the current verdict URL to the clipboard; returns the copied URL. */
export async function copyVerdictLink() {
  const url = typeof window !== "undefined" ? window.location.href : "";
  await navigator.clipboard.writeText(url);
  return url;
}
