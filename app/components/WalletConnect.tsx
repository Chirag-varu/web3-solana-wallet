"use client";

// Import necessary hooks and components from Solana wallet adapter
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useEffect, useState } from "react";
import { PublicKey, Transaction, SystemProgram, Keypair } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, MintLayout, getAccount, getAssociatedTokenAddress } from "@solana/spl-token";
import toast, { Toaster } from "react-hot-toast";
import { Copy, Check, LogOut } from "lucide-react";

// Define a type for transaction details
// This helps structure the data retrieved from blockchain transactions
type TransactionDetails = {
  signature: string;
  blockTime: string;
  fee: string;
  status: string;
};

const WalletConnect = () => {
  // Destructure wallet-related hooks
  const { publicKey, sendTransaction, disconnect } = useWallet();
  const { connection } = useConnection();

  // State variables to store balance, token balance, transactions, and loading states
  const [balance, setBalance] = useState<number | null>(null);
  const [tokenBalance, setTokenBalance] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<TransactionDetails[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState<boolean>(false);
  const [creatingToken, setCreatingToken] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);

  // Fetch blockchain data (wallet balance and transactions) when publicKey changes
  useEffect(() => {
    const fetchBlockchainData = async () => {
      if (!publicKey) return;

      setLoadingTransactions(true); // Start loading transactions
      try {
        // Fetch wallet balance in SOL
        const balance = await connection.getBalance(publicKey);
        setBalance(balance / 1e9); // Convert lamports to SOL

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
      setLoadingTransactions(false); // Stop loading transactions
    };

    fetchBlockchainData();
  }, [publicKey, connection]);

  // Function to fetch token balance for a given mint address
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

  // Function to create a new token
  const createToken = async () => {
    if (!publicKey || !sendTransaction) {
      toast.error("Wallet not connected!");
      return;
    }

    setCreatingToken(true); // Start loading token creation
    try {
      // Generate a new keypair for the token mint
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

      // Fetch token balance after creation
      fetchTokenBalance(mint.publicKey);
    } catch (error) {
      console.error("Token creation failed", error);
      toast.error("Token creation failed! ❌");
    }
    setCreatingToken(false); // Stop loading token creation
  };

  // Function to copy wallet address
  const copyToClipboard = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toBase58());
      setCopied(true);
      toast.success("Wallet address copied! 📋");

      // Reset back to copy icon after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-6 border rounded-xl shadow-lg bg-white w-full max-w-md md:max-w-lg lg:max-w-xl mx-auto">
      <Toaster position="top-center" reverseOrder={false} />
      <WalletMultiButton />
      {publicKey && (
        <div className="w-full text-center">
          <div className="w-full text-center flex items-center justify-center gap-4">
            <p className="text-lg font-semibold text-black">
              Wallet: {publicKey.toBase58().slice(0, 6)}...{publicKey.toBase58().slice(-6)}
            </p>
            <button
              onClick={copyToClipboard}
              className="hover:text-blue-500 transition-all"
            >
              {copied ? <Check size={18} className="text-blue-500" /> : <Copy size={18} />}
            </button>
          </div>
          <p className="text-lg text-black">Balance: {balance !== null ? `${balance} SOL` : "Loading..."}</p>
          {tokenBalance !== null && <p className="text-lg">Token Balance: {tokenBalance}</p>}

          <div className="flex items-center justify-center gap-4">
            {/* Create Token Button with Loading State */}
            <button
              onClick={createToken}
              className={`px-4 py-2 mt-4 rounded-lg ${creatingToken ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:cursor-pointer"
                } text-white`}
              disabled={creatingToken}
            >
              {creatingToken ? "Creating..." : "Create Token"}
            </button>

            {/* Disconnect Wallet Button */}
            <button
              onClick={disconnect}
              className="px-4 py-2 mt-4 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center gap-2"
            >
              <LogOut size={18} /> Disconnect Wallet
            </button>
          </div>

          {/* Transaction History Table with Loading State */}
          <div className="mt-4 w-full overflow-x-auto">
            <h3 className="font-bold text-lg mb-2 text-black">Transaction History:</h3>
            {loadingTransactions ? (
              <p className="text-black">Loading transactions...</p>
            ) : transactions.length > 0 ? (
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
                    <tr key={tx.signature} className="border even:bg-gray-50 hover:bg-gray-100 transition">
                      <td className="border p-2">
                        <a href={`https://explorer.solana.com/tx/${tx.signature}?cluster=devnet`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
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
              <p className="text-black">No recent transactions.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletConnect;
