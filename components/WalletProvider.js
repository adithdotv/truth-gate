"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Toaster } from "react-hot-toast";
import {
  connectWallet,
  getAccount,
  getChainId,
  hasWallet,
  isCorrectNetwork,
  onAccountsChanged,
  onChainChanged,
  switchToSomnia,
  WalletError,
} from "@/lib/wallet";

const WalletContext = createContext(null);

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within <WalletProvider>");
  return ctx;
}

export default function WalletProvider({ children }) {
  const [address, setAddress] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState(null);

  // Hydrate any existing connection + subscribe to wallet events.
  useEffect(() => {
    if (!hasWallet()) return;
    let mounted = true;

    (async () => {
      try {
        const [acct, chain] = await Promise.all([getAccount(), getChainId()]);
        if (mounted) {
          setAddress(acct);
          setChainId(chain);
        }
      } catch {
        /* ignore hydration errors */
      }
    })();

    const offAccounts = onAccountsChanged((accounts) =>
      setAddress(accounts?.[0] ?? null),
    );
    const offChain = onChainChanged((hex) => setChainId(parseInt(hex, 16)));

    return () => {
      mounted = false;
      offAccounts();
      offChain();
    };
  }, []);

  const connect = useCallback(async () => {
    setConnecting(true);
    setError(null);
    try {
      const result = await connectWallet();
      setAddress(result.address);
      setChainId(result.chainId);
      if (!isCorrectNetwork(result.chainId)) {
        await switchToSomnia();
        setChainId(await getChainId());
      }
    } catch (err) {
      setError(err instanceof WalletError ? err.message : err?.message ?? "Wallet error");
    } finally {
      setConnecting(false);
    }
  }, []);

  const switchNetwork = useCallback(async () => {
    setError(null);
    try {
      await switchToSomnia();
      setChainId(await getChainId());
    } catch (err) {
      setError(err?.message ?? "Failed to switch network.");
    }
  }, []);

  const value = {
    address,
    chainId,
    connecting,
    error,
    isConnected: !!address,
    isCorrectNetwork: isCorrectNetwork(chainId),
    connect,
    switchNetwork,
    clearError: () => setError(null),
  };

  return (
    <WalletContext.Provider value={value}>
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "#121517",
            color: "#eceae3",
            border: "1px solid #2a2519",
            fontSize: "0.85rem",
          },
          success: { iconTheme: { primary: "#34e3a8", secondary: "#0b0d0e" } },
          error: { iconTheme: { primary: "#f87171", secondary: "#0b0d0e" } },
        }}
      />
      {children}
    </WalletContext.Provider>
  );
}
