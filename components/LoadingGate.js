"use client";

import { useEffect, useState } from "react";

// Animated AI-analysis loading screen — shown while the gatekeeper deliberates.
//
// Two modes:
//  • Uncontrolled (default): auto-rotates `messages` on a timer.
//  • Controlled: pass a `message` string (and optional `step`/`total`) to
//    drive the text from an external flow — e.g. live transaction progress.
const DEFAULT_MESSAGES = [
  "Parsing digital identity...",
  "Verifying public artifacts...",
  "Inspecting technical credibility...",
  "Consulting the Gatekeeper...",
];

export default function LoadingGate({
  messages = DEFAULT_MESSAGES,
  interval = 2200,
  message,
  step,
  total,
}) {
  const controlled = typeof message === "string";

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (controlled) return; // external flow drives the text
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % messages.length);
    }, interval);
    return () => clearInterval(id);
  }, [controlled, messages.length, interval]);

  const activeMessage = controlled ? message : messages[index];

  // Step indicator: reflect real progress when controlled with a total,
  // otherwise mirror the rotating message index.
  const dotCount = controlled ? total ?? 0 : messages.length;
  const activeDot = controlled ? step ?? -1 : index;

  return (
    <div
      className="flex flex-col items-center justify-center gap-10 py-24"
      role="status"
      aria-live="polite"
      aria-label={activeMessage}
    >
      {/* Glowing loading indicator — twin counter-rotating rings + core */}
      <div className="relative h-24 w-24">
        {/* Outer gold ring */}
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-gold-bright border-r-gold/40 [animation-duration:1.4s] [filter:drop-shadow(0_0_8px_rgba(244,217,123,0.6))]" />
        {/* Inner emerald ring, slower + reversed */}
        <div className="absolute inset-3 animate-spin rounded-full border-2 border-transparent border-b-emerald-bright border-l-emerald/40 [animation-direction:reverse] [animation-duration:2s] [filter:drop-shadow(0_0_8px_rgba(52,227,168,0.6))]" />
        {/* Pulsing core */}
        <div className="absolute inset-0 m-auto h-3 w-3 animate-pulse rounded-full bg-gold-bright shadow-[0_0_16px_rgba(244,217,123,0.8)]" />
      </div>

      {/* Active message — re-mounts on change to replay the fade */}
      <p
        key={activeMessage}
        className="animate-fade-in-up min-h-[1.5rem] max-w-sm px-6 text-center font-mono text-sm tracking-wide text-glow-emerald sm:text-base"
      >
        {activeMessage}
      </p>

      {/* Step indicator */}
      {dotCount > 0 && (
        <div className="flex items-center gap-2">
          {Array.from({ length: dotCount }).map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === activeDot
                  ? "w-6 bg-gold-bright shadow-[0_0_10px_rgba(244,217,123,0.7)]"
                  : i < activeDot
                    ? "w-1.5 bg-emerald/60"
                    : "w-1.5 bg-border"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
