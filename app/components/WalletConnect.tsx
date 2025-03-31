"use client";

import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";

const WalletConnect = () => {
  // Get the connected wallet's public key
  const { publicKey } = useWallet();
  // Get the Solana blockchain connection instance
  const { connection } = useConnection();
  // State to store the wallet balance
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (publicKey) {
        // Fetch the wallet balance from the Solana blockchain
        const balance = await connection.getBalance(new PublicKey(publicKey));
        setBalance(balance / 1e9); // Convert lamports to SOL
      }
    };

    fetchBalance();
  }, [publicKey, connection]); // Runs when `publicKey` or `connection` changes

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-6 border rounded-xl shadow-lg bg-white">
      {/* Button to connect/disconnect the wallet */}
      <WalletMultiButton />
      {publicKey && (
        <div>
          {/* Display the connected wallet address (shortened) */}
          <p className="text-lg font-semibold">Wallet: {publicKey.toBase58().slice(0, 6)}...{publicKey.toBase58().slice(-6)}</p>
          {/* Display the wallet balance in SOL */}
          <p className="text-lg">Balance: {balance !== null ? `${balance} SOL` : "Loading..."}</p>
        </div>
      )}
    </div>
  );
};

export default WalletConnect;
