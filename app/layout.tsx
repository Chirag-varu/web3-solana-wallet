"use client";

import "@solana/wallet-adapter-react-ui/styles.css";

import { WalletContextProvider } from "./contexts/WalletContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WalletContextProvider>{children}</WalletContextProvider>
      </body>
    </html>
  );
}
