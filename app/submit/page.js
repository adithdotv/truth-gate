"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import SubmissionForm from "@/components/SubmissionForm";
import LoadingGate from "@/components/LoadingGate";
import { useWallet } from "@/components/WalletProvider";
import {
  connectWallet,
  getBrowserProvider,
  getChainId,
  hasWallet,
  isCorrectNetwork,
  switchToSomnia,
  WalletError,
} from "@/lib/wallet";
import {
  runGithubAnalysis,
  pollReputation,
  ANALYSIS_MESSAGES,
} from "@/lib/contract";

// Pull a bare GitHub username out of a username or a profile URL.
function parseGithubUsername(input) {
  if (!input) return "";
  const trimmed = input.trim().replace(/\/+$/, "");
  const match = trimmed.match(/github\.com\/([^/?#]+)/i);
  const handle = (match ? match[1] : trimmed).replace(/^@/, "");
  return /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i.test(handle) ? handle : "";
}

// Map any thrown error to a calm, on-theme message.
function friendlyError(err) {
  const code = err?.code;
  if (code === "REJECTED" || code === 4001 || code === "ACTION_REJECTED") {
    return "You rejected the request in your wallet. Nothing was submitted.";
  }
  if (code === "NO_WALLET") {
    return "MetaMask not detected. Install it to face the gate.";
  }
  const msg = String(err?.message ?? "");
  if (code === "INSUFFICIENT_FUNDS" || /insufficient funds/i.test(msg)) {
    // Prefer our pre-check message (includes the exact amount) when present.
    return code === "INSUFFICIENT_FUNDS" && msg
      ? msg
      : "Insufficient STT to cover the deposit and gas on Somnia.";
  }
  if (/timed out/i.test(msg)) return msg;
  if (/wrong network|chain/i.test(msg)) {
    return "Wrong network. Switch to Somnia and try again.";
  }
  return msg || "The gate could not process your submission. Please try again.";
}

export default function SubmitPage() {
  const router = useRouter();
  const { isConnected } = useWallet();

  const [phase, setPhase] = useState("form"); // form | signing | analyzing | error
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);

  async function runFlow(githubInput) {
    const username = parseGithubUsername(githubInput);
    if (!username) {
      setError("Enter a valid GitHub username or profile URL.");
      setPhase("error");
      return;
    }

    try {
      if (!hasWallet()) {
        throw new WalletError(
          "NO_WALLET",
          "MetaMask not detected. Install it to face the gate.",
        );
      }

      // Ensure an account is connected.
      if (!isConnected) await connectWallet();

      // Ensure we're on Somnia.
      const chainId = await getChainId();
      if (!isCorrectNetwork(chainId)) await switchToSomnia();

      const provider = getBrowserProvider();
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      // Single payable transaction — analyze the complete profile.
      setPhase("signing");
      setMessage("Connecting to Somnia validators...");
      await runGithubAnalysis({
        signer,
        username,
        onStep: (s) => setMessage(s.message),
      });

      // Validators compute and write the reputation on-chain; poll for it.
      setPhase("analyzing");
      await pollReputation({ address });

      router.push(`/verdict?address=${address}`);
    } catch (err) {
      setError(friendlyError(err));
      setPhase("error");
    }
  }

  return (
    <>
      <Navbar />
      <main className="flex min-h-[100svh] flex-1 flex-col items-center justify-center gap-10 px-6 py-32">
        {phase === "signing" && (
          <div className="animate-fade-in-up flex flex-col items-center">
            <LoadingGate message={message} />
          </div>
        )}

        {phase === "analyzing" && (
          <div className="animate-fade-in-up flex flex-col items-center">
            <LoadingGate messages={ANALYSIS_MESSAGES} />
          </div>
        )}

        {phase === "error" && (
          <div className="panel animate-fade-in-up flex w-full max-w-md flex-col items-center gap-5 p-8 text-center">
            <span className="font-display text-2xl text-[rgb(248_113_113)]">
              The gate refused
            </span>
            <p className="text-muted">{error}</p>
            <button
              type="button"
              onClick={() => {
                setError(null);
                setPhase("form");
              }}
              className="glow-gold flex h-11 items-center justify-center rounded-full bg-surface-elevated px-7 font-display text-sm uppercase tracking-[0.2em] text-gold-bright transition-all hover:scale-[1.03] hover:bg-surface"
            >
              Try Again
            </button>
          </div>
        )}

        {phase === "form" && (
          <>
            <header className="text-center">
              <h1 className="font-display text-3xl text-glow-gold sm:text-4xl">
                Approach the Gate
              </h1>
              <p className="mt-2 text-muted">
                Present your GitHub. The gatekeeper analyzes it onchain.
              </p>
            </header>
            <SubmissionForm onSubmit={({ github }) => runFlow(github)} />
          </>
        )}
      </main>
    </>
  );
}
