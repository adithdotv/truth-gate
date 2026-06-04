// Wallet layer for TruthGate — MetaMask + Somnia testnet via ethers v6.
//
// Pure, reusable helpers (no React). The WalletProvider context wraps these
// for the UI; imperative flows (submit page) can call them directly.

import { BrowserProvider } from "ethers";

// ── Network config (Somnia Shannon testnet, env-overridable) ────
const CHAIN_ID = Number(process.env.NEXT_PUBLIC_SOMNIA_CHAIN_ID ?? 50312);

export const SOMNIA = {
  chainId: CHAIN_ID,
  chainIdHex: `0x${CHAIN_ID.toString(16)}`,
  name: process.env.NEXT_PUBLIC_SOMNIA_NAME ?? "Somnia Shannon Testnet",
  rpcUrl: process.env.NEXT_PUBLIC_SOMNIA_RPC ?? "https://dream-rpc.somnia.network",
  explorer:
    process.env.NEXT_PUBLIC_SOMNIA_EXPLORER ??
    "https://shannon-explorer.somnia.network",
  currency: { name: "Somnia Test Token", symbol: "STT", decimals: 18 },
};

// Typed-ish error so callers can branch on `.code`.
export class WalletError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "WalletError";
    this.code = code;
  }
}

// ── Provider / detection ────────────────────────────────────────
export function getEthereum() {
  if (typeof window === "undefined") return null;
  return window.ethereum ?? null;
}

export function hasWallet() {
  return !!getEthereum();
}

export function getBrowserProvider() {
  const eth = getEthereum();
  if (!eth) {
    throw new WalletError(
      "NO_WALLET",
      "MetaMask not detected. Install it to continue.",
    );
  }
  return new BrowserProvider(eth);
}

// ── Accounts / chain ────────────────────────────────────────────
export async function getAccount() {
  const eth = getEthereum();
  if (!eth) return null;
  const accounts = await eth.request({ method: "eth_accounts" });
  return accounts?.[0] ?? null;
}

export async function getChainId() {
  const eth = getEthereum();
  if (!eth) return null;
  const hex = await eth.request({ method: "eth_chainId" });
  return parseInt(hex, 16);
}

export function isCorrectNetwork(chainId) {
  return Number(chainId) === SOMNIA.chainId;
}

export async function connectWallet() {
  const eth = getEthereum();
  if (!eth) {
    throw new WalletError(
      "NO_WALLET",
      "MetaMask not detected. Install it to continue.",
    );
  }
  try {
    const accounts = await eth.request({ method: "eth_requestAccounts" });
    const address = accounts?.[0];
    if (!address) {
      throw new WalletError("NO_ACCOUNT", "No account returned by the wallet.");
    }
    return { address, chainId: await getChainId() };
  } catch (err) {
    if (err?.code === 4001 || err?.code === "ACTION_REJECTED") {
      throw new WalletError("REJECTED", "You rejected the connection request.");
    }
    if (err instanceof WalletError) throw err;
    throw new WalletError(
      "CONNECT_FAILED",
      err?.message ?? "Failed to connect wallet.",
    );
  }
}

// Switch to Somnia, adding the chain if the wallet doesn't know it yet.
export async function switchToSomnia() {
  const eth = getEthereum();
  if (!eth) {
    throw new WalletError("NO_WALLET", "MetaMask not detected.");
  }
  try {
    await eth.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: SOMNIA.chainIdHex }],
    });
  } catch (err) {
    // 4902 = chain not added to the wallet.
    if (err?.code === 4902) {
      await eth.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: SOMNIA.chainIdHex,
            chainName: SOMNIA.name,
            nativeCurrency: SOMNIA.currency,
            rpcUrls: [SOMNIA.rpcUrl],
            blockExplorerUrls: [SOMNIA.explorer],
          },
        ],
      });
      return;
    }
    if (err?.code === 4001 || err?.code === "ACTION_REJECTED") {
      throw new WalletError("REJECTED", "You rejected the network switch.");
    }
    throw new WalletError(
      "SWITCH_FAILED",
      err?.message ?? "Failed to switch to the Somnia network.",
    );
  }
}

// Best-effort permission revoke. MetaMask has no hard "disconnect"; newer
// versions support wallet_revokePermissions — older ones just no-op here and
// the app clears its own connection state.
export async function revokeWalletPermissions() {
  const eth = getEthereum();
  if (!eth?.request) return;
  try {
    await eth.request({
      method: "wallet_revokePermissions",
      params: [{ eth_accounts: {} }],
    });
  } catch {
    /* unsupported / rejected — app-level disconnect still applies */
  }
}

// ── Event subscriptions (return an unsubscribe fn) ──────────────
export function onAccountsChanged(cb) {
  const eth = getEthereum();
  if (!eth?.on) return () => {};
  eth.on("accountsChanged", cb);
  return () => eth.removeListener?.("accountsChanged", cb);
}

export function onChainChanged(cb) {
  const eth = getEthereum();
  if (!eth?.on) return () => {};
  eth.on("chainChanged", cb);
  return () => eth.removeListener?.("chainChanged", cb);
}

// ── Display helpers ─────────────────────────────────────────────
export function shortenAddress(address) {
  return address ? `${address.slice(0, 6)}…${address.slice(-4)}` : "";
}
