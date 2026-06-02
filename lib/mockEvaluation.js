// Mock AI evaluation utility for TruthGate.
//
// Stands in for the real Somnia Agent gatekeeper until the agent/contract
// pipeline is wired up. Generates a random trust score, an approval/rejection
// verdict, and dynamic reasoning text, returning a structured object.
//
// TODO: replace `evaluateSubmission` with a real Somnia Agent call.

const APPROVAL_THRESHOLD = 70;

// ── Random helpers ──────────────────────────────────────────────
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// ── Reasoning fragments ─────────────────────────────────────────
const OPENERS = {
  high: [
    "The submission radiates conviction and a clear sense of purpose.",
    "A rare clarity of vision runs through this proposal.",
    "The Gatekeeper finds an unusually coherent and ambitious idea.",
  ],
  mid: [
    "The proposal holds genuine promise, tempered by open questions.",
    "There is real signal here, though the path forward needs sharpening.",
    "The idea stands on solid footing, if not yet fully proven.",
  ],
  low: [
    "The submission struggles to establish a convincing foundation.",
    "The Gatekeeper detects ambition but little to anchor it.",
    "Too much remains unsubstantiated for trust to take hold.",
  ],
};

const CLOSERS = {
  approved: [
    "Onchain trust is extended.",
    "The gate opens.",
    "Passage is granted.",
  ],
  rejected: [
    "Trust is withheld, for now.",
    "The gate remains closed.",
    "Return when the work speaks louder.",
  ],
};

function artifactNote({ github, website }) {
  const notes = [];
  if (github) {
    notes.push(
      pick([
        "Public code artifacts were located and weighed favorably.",
        "The linked repository lends verifiable technical credibility.",
        "Open-source signal strengthens the case.",
      ]),
    );
  } else {
    notes.push(
      pick([
        "No public code was provided, limiting technical verification.",
        "The absence of a repository leaves the build unverified.",
      ]),
    );
  }
  if (website) {
    notes.push(
      pick([
        "A portfolio presence corroborates the stated identity.",
        "The public site adds a layer of digital provenance.",
      ]),
    );
  } else {
    notes.push(
      pick([
        "Without a portfolio, the public identity is harder to confirm.",
        "A missing web presence weakens the identity signal.",
      ]),
    );
  }
  return notes.join(" ");
}

function buildReasoning({ score, approved, github, website }) {
  const band = score >= 85 ? "high" : score >= APPROVAL_THRESHOLD ? "mid" : "low";
  return [
    pick(OPENERS[band]),
    artifactNote({ github, website }),
    pick(approved ? CLOSERS.approved : CLOSERS.rejected),
  ].join(" ");
}

// Per-dimension signal scores that roughly orbit the overall score.
function buildSignals(score, { github, website }) {
  const jitter = (base, spread) =>
    Math.max(0, Math.min(100, base + randomInt(-spread, spread)));
  return {
    identity: jitter(score - (website ? 0 : 12), 8),
    artifacts: jitter(score - (github ? 0 : 18), 8),
    technical: jitter(score - (github ? 0 : 10), 10),
  };
}

/**
 * Evaluate a submission and return a structured verdict.
 *
 * @param {{ idea?: string, github?: string, website?: string }} submission
 * @returns {{
 *   status: "APPROVED" | "REJECTED",
 *   approved: boolean,
 *   score: number,
 *   reasoning: string,
 *   signals: { identity: number, artifacts: number, technical: number },
 *   evaluatedAt: string
 * }}
 */
export function evaluateSubmission(submission = {}) {
  const { idea = "", github = "", website = "" } = submission;

  // A little input-awareness so richer submissions trend higher.
  const base = randomInt(40, 92);
  const bonus = (github ? 6 : 0) + (website ? 4 : 0) + (idea.length > 120 ? 4 : 0);
  const score = Math.max(0, Math.min(100, base + bonus));

  const approved = score >= APPROVAL_THRESHOLD;

  return {
    status: approved ? "APPROVED" : "REJECTED",
    approved,
    score,
    reasoning: buildReasoning({ score, approved, github, website }),
    signals: buildSignals(score, { github, website }),
    evaluatedAt: new Date().toISOString(),
  };
}

/**
 * Async wrapper that simulates the gatekeeper's deliberation latency.
 *
 * @param {object} submission - see `evaluateSubmission`
 * @param {number} [delayMs=2200] - mock latency before resolving
 * @returns {Promise<ReturnType<typeof evaluateSubmission>>}
 */
export function runGatekeeper(submission, delayMs = 2200) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(evaluateSubmission(submission)), delayMs);
  });
}

export { APPROVAL_THRESHOLD };
