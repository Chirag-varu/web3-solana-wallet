"use client";

import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useEffect, useState } from "react";
import { PublicKey, Transaction, SystemProgram, Keypair, ConfirmedSignatureInfo } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, MintLayout, getAccount, getAssociatedTokenAddress } from "@solana/spl-token";
import toast, { Toaster } from "react-hot-toast";

type TransactionDetails = {
  signature: string;
  blockTime: string;
  fee: string;
  status: string;
};

const WalletConnect = () => {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<number | null>(null);
  const [tokenBalance, setTokenBalance] = useState<number | null>(null);  
  const [transactions, setTransactions] = useState<TransactionDetails[]>([]);

  useEffect(() => {
    const fetchBlockchainData = async () => {
      if (!publicKey) return;

      try {
        const balance = await connection.getBalance(publicKey);
        setBalance(balance / 1e9);

        // ✅ Get latest 10 transaction signatures
        const confirmedSignatures = await connection.getSignaturesForAddress(publicKey, { limit: 10 });

        // ✅ Fetch full transaction details
        const transactionsWithDetails = await Promise.all(
          confirmedSignatures.map(async (tx) => {
            const txDetails = await connection.getTransaction(tx.signature, { commitment: "confirmed" });

            return {
              signature: tx.signature,
              blockTime: txDetails?.blockTime ? new Date(txDetails.blockTime * 1000).toLocaleString() : "N/A",
              fee: txDetails?.meta?.fee ? (txDetails.meta.fee / 1e9).toFixed(6) : "N/A", // Convert lamports to SOL
              status: txDetails?.meta?.err ? "Failed ❌" : "Success ✅",
            };
          })
        );

        setTransactions(transactionsWithDetails);
      } catch (error) {
        console.error("Error fetching blockchain data", error);
      }
    };

    fetchBlockchainData();
  }, [publicKey, connection]);

  const fetchTokenBalance = async (mintAddress: PublicKey) => {
    if (!publicKey) return;
    try {
      const tokenAccount = await getAssociatedTokenAddress(mintAddress, publicKey);
      const accountInfo = await getAccount(connection, tokenAccount);
      setTokenBalance(Number(accountInfo.amount));
    } catch (error) {
      console.error("Error fetching token balance", error);
    }
  };

  const createToken = async () => {
    if (!publicKey || !sendTransaction) {
      toast.error("Wallet not connected!");
      return;
    }

    try {
      const mint = Keypair.generate();
      const transaction = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: mint.publicKey,
          space: MintLayout.span,
          programId: TOKEN_PROGRAM_ID,
          lamports: await connection.getMinimumBalanceForRentExemption(MintLayout.span),
        })
      );

      transaction.feePayer = publicKey;
      await sendTransaction(transaction, connection, { signers: [mint] });
      toast.success(`Token created successfully! 🚀 Mint: ${mint.publicKey.toBase58()}`);

      fetchTokenBalance(mint.publicKey);
    } catch (error) {
      console.error("Token creation failed", error);
      toast.error("Token creation failed! ❌");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-6 border rounded-xl shadow-lg bg-white w-full max-w-md md:max-w-lg lg:max-w-xl mx-auto">
      <Toaster position="top-center" reverseOrder={false} />
      <WalletMultiButton />
      {publicKey && (
        <div className="w-full text-center">
          <p className="text-lg font-semibold">Wallet: {publicKey.toBase58().slice(0, 6)}...{publicKey.toBase58().slice(-6)}</p>
          <p className="text-lg">Balance: {balance !== null ? `${balance} SOL` : "Loading..."}</p>
          {tokenBalance !== null && <p className="text-lg">Token Balance: {tokenBalance}</p>}
          <button onClick={createToken} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:cursor-pointer">Create Token</button>
          <div className="mt-4 w-full overflow-x-auto">
            <h3 className="font-bold text-lg mb-2">Transaction History:</h3>
            {transactions.length > 0 ? (
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2">Signature</th>
                    <th className="border p-2">Block Time</th>
                    <th className="border p-2">Fee (SOL)</th>
                    <th className="border p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.signature} className="border">
                      <td className="border p-2">
                        <a
                          href={`https://explorer.solana.com/tx/${tx.signature}?cluster=devnet`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          {tx.signature.slice(0, 6)}...{tx.signature.slice(-6)}
                        </a>
                      </td>
                      <td className="border p-2">{tx.blockTime}</td>
                      <td className="border p-2">{tx.fee}</td>
                      <td className="border p-2">{tx.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No recent transactions.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletConnect;
