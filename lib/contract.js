// Contract layer for TruthGate — the deployed Somnia GitHub + portfolio oracle.
//
// Wraps the analysis transaction, on-chain reputation reads, and the
// trust-tier mapping in clean reusable functions (ethers v6).

import { Contract, JsonRpcProvider, formatEther } from "ethers";
import { SOMNIA, WalletError } from "./wallet";

export const CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? "";

// Trimmed to what the frontend uses (full-profile analysis, reputation read,
// and the required deposit).
export const TRUTHGATE_ABI = [
  {
    inputs: [
      { internalType: "string", name: "username", type: "string" },
      { internalType: "string", name: "portfolioUrl", type: "string" },
    ],
    name: "analyzeCompleteProfile",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "getReputation",
    outputs: [
      {
        components: [
          { internalType: "string", name: "username", type: "string" },
          { internalType: "string", name: "bio", type: "string" },
          { internalType: "string", name: "createdAt", type: "string" },
          { internalType: "string", name: "portfolioUrl", type: "string" },
          { internalType: "string", name: "portfolioSummary", type: "string" },
          { internalType: "string", name: "detectedTechStack", type: "string" },
          { internalType: "uint256", name: "followers", type: "uint256" },
          { internalType: "uint256", name: "following", type: "uint256" },
          { internalType: "uint256", name: "publicRepos", type: "uint256" },
          { internalType: "uint256", name: "truthScore", type: "uint256" },
          { internalType: "bool", name: "analyzed", type: "bool" },
        ],
        internalType: "struct TruthGateOracle.GithubReputation",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getRequiredDeposit",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

// ── Contract instances ──────────────────────────────────────────
// Read-only via a plain RPC provider so reads work without a wallet
// (e.g. the verdict page on refresh).
export function getReadContract(provider) {
  const p = provider ?? new JsonRpcProvider(SOMNIA.rpcUrl, SOMNIA.chainId);
  return new Contract(CONTRACT_ADDRESS, TRUTHGATE_ABI, p);
}

export function getWriteContract(signer) {
  return new Contract(CONTRACT_ADDRESS, TRUTHGATE_ABI, signer);
}

// Cinematic, multi-stage progress lines. The contract analyzes the whole
// profile (GitHub + portfolio website) in one transaction, so these cycle
// while we poll for the on-chain result.
export const ANALYSIS_MESSAGES = [
  "Verifying GitHub credibility...",
  "Fetching developer metrics...",
  "Scanning portfolio website...",
  "Extracting technical signals...",
  "AI analyzing builder reputation...",
  "Generating Truth Score...",
  "Gatekeeper finalizing verdict...",
];

/**
 * Run the full GitHub + portfolio analysis in a single payable tx.
 *
 * @param {object} args
 * @param {import("ethers").Signer} args.signer
 * @param {string} args.username
 * @param {string} args.portfolioUrl
 * @param {(s: { phase: string, message: string }) => void} [args.onStep]
 */
export async function runGithubAnalysis({
  signer,
  username,
  portfolioUrl,
  onStep,
}) {
  const contract = getWriteContract(signer);

  onStep?.({ phase: "connect", message: "Connecting to Somnia validators..." });

  // analyzeCompleteProfile is payable. getRequiredDeposit() already returns
  // the exact total the contract expects for the full analysis, so send it
  // verbatim — overpaying can fail an `msg.value == deposit` check.
  const requiredDeposit = await contract.getRequiredDeposit();

  // Catch insufficient balance before prompting the wallet (clearer than a
  // raw revert / failed gas estimation).
  const address = await signer.getAddress();
  const balance = await signer.provider.getBalance(address);
  if (balance < requiredDeposit) {
    throw new WalletError(
      "INSUFFICIENT_FUNDS",
      `Insufficient STT: this analysis needs at least ${formatEther(requiredDeposit)} STT (plus gas).`,
    );
  }

  onStep?.({ phase: "sign", message: "Awaiting wallet signature..." });
  const tx = await contract.analyzeCompleteProfile(username, portfolioUrl, {
    value: requiredDeposit,
  });

  onStep?.({ phase: "pending", message: "Submitting to Somnia validators..." });
  await tx.wait();
}

// ── Reputation reads ────────────────────────────────────────────
/**
 * @typedef {object} Reputation
 * @property {string} username
 * @property {string} bio
 * @property {string} createdAt
 * @property {string} portfolioUrl
 * @property {string} portfolioSummary  AI-generated portfolio analysis
 * @property {string} detectedTechStack Comma-separated tech tokens
 * @property {number} followers
 * @property {number} following
 * @property {number} publicRepos
 * @property {number} truthScore
 * @property {boolean} analyzed
 */

/** @returns {Reputation} */
export function parseReputation(raw) {
  return {
    username: raw.username,
    bio: raw.bio,
    createdAt: raw.createdAt,
    portfolioUrl: raw.portfolioUrl,
    portfolioSummary: raw.portfolioSummary,
    detectedTechStack: raw.detectedTechStack,
    followers: Number(raw.followers),
    following: Number(raw.following),
    publicRepos: Number(raw.publicRepos),
    truthScore: Number(raw.truthScore),
    analyzed: Boolean(raw.analyzed),
  };
}

export async function fetchReputation({ address, provider }) {
  const contract = getReadContract(provider);
  const raw = await contract.getReputation(address);
  return parseReputation(raw);
}

/**
 * Poll getReputation until `analyzed` is true, or reject on timeout.
 *
 * @returns {Promise<Reputation>}
 */
export function pollReputation({
  address,
  provider,
  intervalMs = 3000,
  timeoutMs = 180000,
  onTick,
  signal,
}) {
  const start = performance.now();
  return new Promise((resolve, reject) => {
    let timer;

    const stop = () => clearTimeout(timer);
    if (signal) {
      signal.addEventListener("abort", () => {
        stop();
        reject(new Error("Analysis cancelled."));
      });
    }

    const check = async () => {
      try {
        const rep = await fetchReputation({ address, provider });
        onTick?.(rep);
        if (rep.analyzed) {
          resolve(rep);
          return;
        }
        if (performance.now() - start > timeoutMs) {
          reject(
            new Error(
              "Timed out waiting for the Gatekeeper's verdict. Try again shortly.",
            ),
          );
          return;
        }
        timer = setTimeout(check, intervalMs);
      } catch {
        reject(new Error("Failed to read reputation from the chain."));
      }
    };

    check();
  });
}

// ── Tech stack parsing ──────────────────────────────────────────
// detectedTechStack is a comma-separated string; split + clean it.
export function parseTechStack(raw) {
  if (!raw) return [];
  return raw
    .split(/[,;|\n]+/)
    .map((t) => t.trim())
    .filter(Boolean);
}

// ── Trust tier mapping ──────────────────────────────────────────
// 0–30 Low · 31–70 Moderate · 71–100 Verified Builder
export function getTrustTier(score) {
  if (score <= 30) return { tier: "low", label: "Low Trust" };
  if (score <= 70) return { tier: "moderate", label: "Moderate Trust" };
  return { tier: "verified", label: "Verified Builder" };
}
