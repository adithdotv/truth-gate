"use client";

import { useEffect, useState } from "react";

// Animated AI-analysis loading screen — shown while the gatekeeper deliberates.
const DEFAULT_MESSAGES = [
  "Parsing digital identity...",
  "Verifying public artifacts...",
  "Inspecting technical credibility...",
  "Consulting the Gatekeeper...",
];

export default function LoadingGate({
  messages = DEFAULT_MESSAGES,
  interval = 2200,
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % messages.length);
    }, interval);
    return () => clearInterval(id);
  }, [messages.length, interval]);

  return (
    <div
      className="flex flex-col items-center justify-center gap-10 py-24"
      role="status"
      aria-live="polite"
      aria-label={messages[index]}
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

      {/* Rotating analysis message — re-mounts on index change to replay fade */}
      <p
        key={index}
        className="animate-fade-in-up min-h-[1.5rem] px-6 text-center font-mono text-sm tracking-wide text-glow-emerald sm:text-base"
      >
        {messages[index]}
      </p>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {messages.map((message, i) => (
          <span
            key={message}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === index
                ? "w-6 bg-gold-bright shadow-[0_0_10px_rgba(244,217,123,0.7)]"
                : "w-1.5 bg-border"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
