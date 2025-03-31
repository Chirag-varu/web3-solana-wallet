"use client";

import { createContext, useContext, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

// Create a React context to manage wallet state
const WalletContext = createContext(null);

export const WalletContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Define the Solana blockchain endpoint (Devnet in this case)
  const endpoint = clusterApiUrl("devnet");

  // Use `useMemo` to initialize wallets efficiently
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    // Provide a connection to the Solana network
    <ConnectionProvider endpoint={endpoint}>
      {/* Provide wallet functionality */}
      <WalletProvider wallets={wallets} autoConnect>
        {/* Provide a modal for wallet interactions */}
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

// Custom hook to access the wallet context
export const useWalletContext = () => useContext(WalletContext);
