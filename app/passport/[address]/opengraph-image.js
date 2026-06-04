import { ImageResponse } from "next/og";
import { fetchReputation, getTrustTier } from "@/lib/contract";

// Dynamic share card — what X/social unfurls when a passport link is posted.
export const runtime = "nodejs";
export const alt = "TruthGate Founder Passport";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ACCENT = {
  verified: "#34e3a8",
  moderate: "#f4d97b",
  low: "#f87171",
};

export default async function Image({ params }) {
  const { address } = await params;

  let rep = null;
  try {
    rep = await fetchReputation({ address });
  } catch {
    rep = null;
  }

  const username = rep?.username || "founder";
  const score = rep?.truthScore ?? 0;
  const { tier, label } = getTrustTier(score);
  const accent = ACCENT[tier];
  const idea = rep?.startupIdea
    ? rep.startupIdea.length > 130
      ? `${rep.startupIdea.slice(0, 127)}…`
      : rep.startupIdea
    : "An onchain-verified builder.";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0b0d0e 0%, #060708 100%)",
          border: `10px solid ${accent}`,
          padding: "64px",
          color: "#eceae3",
          fontFamily: "sans-serif",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              letterSpacing: 10,
              color: "#f4d97b",
            }}
          >
            TRUTHGATE · FOUNDER PASSPORT
          </div>
        </div>

        {/* Body */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", maxWidth: 640 }}>
            <div style={{ display: "flex", fontSize: 72, fontWeight: 700 }}>
              @{username}
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 18,
                fontSize: 36,
                color: accent,
                letterSpacing: 2,
              }}
            >
              {label}
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 28,
                fontSize: 26,
                color: "#8b9088",
                lineHeight: 1.4,
              }}
            >
              {idea}
            </div>
          </div>

          {/* Score medallion */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: 260,
              height: 260,
              borderRadius: 130,
              border: `12px solid ${accent}`,
              background: "rgba(244,217,123,0.06)",
            }}
          >
            <div style={{ display: "flex", fontSize: 110, fontWeight: 800, color: "#f4d97b" }}>
              {score}
            </div>
            <div style={{ display: "flex", fontSize: 24, color: "#8b9088", letterSpacing: 4 }}>
              / 100
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 24,
            color: "#8b9088",
            letterSpacing: 2,
          }}
        >
          <div style={{ display: "flex" }}>Verified onchain via Somnia</div>
          <div style={{ display: "flex" }}>AI Reputation Credential</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
