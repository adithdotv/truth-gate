# TruthGate

> ### *“Convince the AI. Earn Onchain Trust.”*

**TruthGate is a decentralized, AI-powered trust and reputation protocol built on [Somnia](https://somnia.network).** It autonomously evaluates builders, startups, and contributors using internet-aware AI agents — and writes the verdict onchain.

Instead of relying on centralized reputation systems, TruthGate enables smart contracts to make intelligent trust decisions using real-world web data, GitHub activity, portfolio analysis, and AI reasoning — all verifiable onchain.

<p>
  <img alt="Somnia" src="https://img.shields.io/badge/Somnia-Agents-34e3a8" />
  <img alt="Solidity" src="https://img.shields.io/badge/Solidity-Oracle-f4d97b" />
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-000000" />
  <img alt="ethers" src="https://img.shields.io/badge/ethers.js-v6-2535a0" />
</p>

---

## Table of Contents

- [The Problem](#the-problem)
- [The Solution](#the-solution)
- [Core Workflow](#core-workflow)
- [How It Works](#how-it-works)
- [Somnia Agents](#somnia-agents)
- [Why It Matters](#why-it-matters)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Vision](#vision)

---

## The Problem

The internet lacks a **trust-native infrastructure** for evaluating builders and contributors. Today:

- Online reputation is easily manipulated.
- Credentials are difficult to verify.
- Hiring and grant decisions rely on centralized judgment.
- Fake founders and low-quality contributors are common.
- Smart contracts cannot natively understand internet context.

Traditional EVM contracts are deterministic, but blind to the outside world. **TruthGate changes that.**

---

## The Solution

TruthGate acts as an **autonomous AI gatekeeper** for onchain grants, access systems, fellowships, hackathons, and contributor verification.

**Users submit** a startup idea, GitHub profile, portfolio website, and any supporting information.

**TruthGate then uses decentralized Somnia Agents to:**

- fetch live internet data
- parse websites
- analyze technical credibility
- evaluate innovation and authenticity
- generate an AI-powered trust verdict

**Finally, the protocol executes an onchain outcome** — approve funding, mint access NFTs, grant whitelist access, issue a reputation score, or reject low-trust applications.

---

## Core Workflow

```text
User Submission
      ↓
Website Parsing
      ↓
Reputation Verification
      ↓
AI Judgment
      ↓
Smart Contract Execution
      ↓
Onchain Verdict
```

---

## How It Works

### 1. User Submission
Applicants submit a startup pitch, GitHub username, portfolio URL, and optional social proof.

### 2. Website Intelligence
The **LLM Parse Website** agent extracts project information, tech stack, achievements, builder consistency, and credibility signals from portfolio websites and startup pages.

### 3. Reputation Verification
The **JSON API Request** agent fetches GitHub followers, repositories, commit activity, stars, contribution history, and other public credibility metrics.

### 4. AI Judgment
The **LLM Inference** agent autonomously evaluates technical capability, authenticity, execution ability, startup viability, innovation potential, and overall trustworthiness — producing a **Trust Score**, an **approval/rejection verdict**, and an **AI reasoning summary**.

### 5. Onchain Execution
Based on the verdict, the smart contract can release grants, mint reputation NFTs, approve applications, grant ecosystem access, or store decentralized reputation records.

---

## Somnia Agents

TruthGate orchestrates three autonomous onchain agent types. Each request fans out to a validator subcommittee that reaches consensus before any result is written to chain.

| Agent Type | Role in TruthGate |
| --- | --- |
| **JSON API Request** | Pulls verifiable GitHub data — followers, repos, following, stars, account age — as live onchain input. |
| **LLM Inference** | Reasons over the gathered signals, detects authenticity patterns, and synthesizes a defensible Trust Score. |
| **Website Parsing** | Reads public profile and portfolio surfaces directly to corroborate identity and enrich the reputation picture. |

---

## Why It Matters

TruthGate introduces a new primitive for the decentralized internet: **AI-native trust infrastructure.**

A future where:

- contributors carry portable reputation
- grants are evaluated autonomously
- DAOs verify builders trustlessly
- smart contracts can reason about humans
- internet credibility becomes onchain-native

---

## Key Features

- Decentralized, AI-powered trust evaluation
- Internet-aware smart contracts
- GitHub and portfolio reputation analysis
- Autonomous AI verdict generation
- Onchain reputation storage
- Deterministic AI inference
- Verifiable execution via Somnia Agents

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Network | Somnia (Shannon testnet) |
| Contracts | Solidity · Somnia Agents |
| Frontend | Next.js 16 · React 19 · Tailwind CSS v4 |
| Web3 | ethers.js v6 |
| Data | GitHub API · AI inference systems |

---

## Getting Started

### Prerequisites

- Node.js 18+
- [MetaMask](https://metamask.io) connected to the **Somnia Shannon testnet** (chainId `50312`)
- Some **STT** test tokens to cover the analysis deposit and gas

### Installation

```bash
npm install
```

### Environment

Create a `.env.local` file. The deployed oracle address is **required**:

```bash
# Required — the deployed TruthGate oracle
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddress

# Optional — defaults to the Somnia Shannon testnet
NEXT_PUBLIC_SOMNIA_CHAIN_ID=50312
NEXT_PUBLIC_SOMNIA_RPC=https://dream-rpc.somnia.network
NEXT_PUBLIC_SOMNIA_EXPLORER=https://shannon-explorer.somnia.network
```

### Run

```bash
npm run dev      # start the dev server at http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
```

Open [http://localhost:3000](http://localhost:3000), connect your wallet, and submit a GitHub profile to face the gate.

---

## Project Structure

```text
app/
  page.js            # Landing — cinematic hero
  submit/            # Submission flow: form → wallet → onchain analysis
  verdict/           # Onchain reputation reveal
  about/             # Protocol about page
components/
  Hero, Navbar, SubmissionForm, LoadingGate, VerdictCard, VerdictView,
  WalletProvider, Reveal
lib/
  wallet.js          # MetaMask + Somnia network connection (ethers v6)
  contract.js        # Oracle calls, polling, and trust-tier scoring
```

---

## Vision

TruthGate is building the **trust layer for the AI-native internet** — a future where autonomous systems can intelligently evaluate credibility, reputation, and human potential, transparently, verifiably, and entirely onchain.
