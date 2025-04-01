"use client";

import WalletConnect from "./components/WalletConnect";
import "./globals.css";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-black">Solana Wallet Integration 🚀</h1>
      <WalletConnect />

      <div className="absolute bottom-0 left-0 right-0 flex justify-center items-center py-4">
        <h2 className="text-black">
          Created By{" "}
          <a
            href="https://github.com/Chirag-varu/web3-solana-wallet"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 hover:cursor-pointer"
          >
            &lt;Chirag Varu /&gt;
          </a>
        </h2>
      </div>
    </div>
  );
}
