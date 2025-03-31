"use client";

import WalletConnect from "./components/WalletConnect";
import "./globals.css";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Solana Wallet Integration 🚀</h1>
      <WalletConnect />
    </div>
  );
}
