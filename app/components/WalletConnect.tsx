"use client";

import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";

const WalletConnect = () => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (publicKey) {
        const balance = await connection.getBalance(new PublicKey(publicKey));
        setBalance(balance / 1e9); // Convert lamports to SOL
      }
    };

    fetchBalance();
  }, [publicKey, connection]);

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-6 border rounded-xl shadow-lg bg-white">
      <WalletMultiButton />
      {publicKey && (
        <div>
          <p className="text-lg font-semibold">Wallet: {publicKey.toBase58().slice(0, 6)}...{publicKey.toBase58().slice(-6)}</p>
          <p className="text-lg">Balance: {balance !== null ? `${balance} SOL` : "Loading..."}</p>
        </div>
      )}
    </div>
  );
};

export default WalletConnect;
