"use client"; // ✅ Ensure it's a client component

import { createContext, useContext, useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

const WalletContext = createContext(null);

export const WalletContextProvider = ({ children }: { children: React.ReactNode }) => {
  const endpoint = clusterApiUrl("devnet"); // ✅ Connect to Solana Devnet

  // ✅ Fix: Use `useMemo` to ensure wallet initialization is stable
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export const useWalletContext = () => useContext(WalletContext);
