# Solana Wallet Connection App 🚀

A **Next.js + TypeScript** frontend application that interacts with the **Solana blockchain**, enabling users to connect their Solana wallets (Phantom, Solflare, etc.), manage SPL tokens, and perform transactions seamlessly on the **Solana Devnet**.

Live Link: https://web3-solana-wallet.vercel.app/

## 🌟 Features
✅ **Solana Wallet Integration** – Connect/disconnect Phantom, Solflare, and more.  
✅ **Wallet Information** – Display wallet address and SOL balance.  
✅ **SPL Token Management** – Create, mint, and send SPL tokens.  
✅ **Real-time Blockchain Data** – View token balances & transaction history.  
✅ **Transaction Handling** – Secure and efficient token transfers.  
✅ **Modern UI/UX** – Clean, responsive, and user-friendly design.  

## 🏗 Tech Stack
- **Next.js** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Solana Web3.js**
- **Solana Wallet Adapter**

---

## **Project Structure Overview 📂**
It has well-structured directory layout to maintain and organization code base.
It is well documented and commented also used best practices and modular code structure for scalability and collaboration:

```
web3-solana-wallet/
├── app/                   # Application source files
│   ├── components/        # Reusable UI components
│   │   └── WalletConnect.tsx  # Wallet connection component
│   ├── contexts/          # Context providers
│   │   └── WalletContext.tsx  # Solana wallet context
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Layout component
│   ├── page.tsx           # Main page component
│
├── README.md              # Project documentation
├── LICENSE                # License details
├── eslint.config.mjs      # ESLint configuration
├── next.config.ts         # Next.js configuration
├── package.json           # Dependencies and scripts
├── postcss.config.mjs     # PostCSS configuration
├── tsconfig.json          # TypeScript configuration
```
---

## ⚡ Installation & Setup
### 1️⃣ Clone the Repository
```sh
git clone https://github.com/Chirag-varu/web3-solana-wallet.git
cd solana-wallet-app
```

### 2️⃣ Install Dependencies
```sh
npm install  # or yarn install
```

### 3️⃣ Set Up Environment Variables
Create a `.env.local` file and add:
```env
NEXT_PUBLIC_SOLANA_NETWORK=devnet
```

### 4️⃣ Run the Development Server
```sh
npm run dev  # or yarn dev
```
The app will be available at **`http://localhost:3000`**.

## 🔗 Wallet Integration
This project leverages **@solana/wallet-adapter-react** for smooth wallet authentication.

### Supported Wallets:
- [Phantom](https://phantom.app/)
- [Solflare](https://solflare.com/)
- [Sollet](https://www.sollet.io/)

### Connecting Your Wallet
1. Click **"Connect Wallet"**.
2. Select your preferred wallet (Phantom, Solflare, etc.).
3. Approve the connection in your wallet.
4. Done! 🎉 Your wallet address and SOL balance will be displayed.

## 🎯 Smart Contract Interactions
### Create a Token
- Click **"Create Token"** to generate an SPL token.
- Transaction confirmation will appear.

### Mint Tokens
- Enter the amount and **mint** tokens to your wallet.

### Send Tokens
- Enter a recipient’s **wallet address** and transfer tokens.

## 🛠 Troubleshooting
### 1️⃣ Wallet Not Connecting?
- Ensure **Phantom Wallet** is installed.
- Refresh the page and reconnect.

### 2️⃣ Wallet Connection Error?
- Open **Phantom Wallet** and confirm you're on **Devnet**.
- Run:
  ```sh
  solana config set --url https://api.devnet.solana.com
  ```
- If the issue persists, try clearing browser cache and reloading.

### 3️⃣ Transaction Errors?
- Check if your wallet has sufficient SOL for transaction fees.
- Ensure you’re using the correct network (**Devnet**).

## 🤝 Contributing
Found a bug or want to improve the app? Feel free to open an **issue** or submit a **pull request**.

## 📜 License
This project is licensed under the [MIT License](LICENSE).

---

👨‍💻 **Developed by [Chirag Varu](https://github.com/Chirag-varu/)**  
🌟 **Star this repo if you find it useful!** ⭐  

