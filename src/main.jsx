import React, { useMemo } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { clusterApiUrl } from "@solana/web3.js";
import App from "./App.jsx";
import Dashboard from "./Dashboard.jsx";
import NftCertificates from "./NftCertificates.jsx";
import PricePredictor from "./PricePredictor.jsx";
import SupplyChain from "./SupplyChain.jsx";
import TokenSwap from "./TokenSwap.jsx";
import Staking from "./Staking.jsx";
import Analytics from "./Analytics.jsx";
import Governance from "./Governance.jsx";
import Marketplace from "./Marketplace.jsx";
import Profile from "./Profile.jsx";
import "@solana/wallet-adapter-react-ui/styles.css";
import "./index.css";

const endpoint = clusterApiUrl("mainnet-beta");

function Providers({ children }) {
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Providers>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/certificates" element={<NftCertificates />} />
          <Route path="/prices" element={<PricePredictor />} />
          <Route path="/supply-chain" element={<SupplyChain />} />
          <Route path="/swap" element={<TokenSwap />} />
          <Route path="/staking" element={<Staking />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/governance" element={<Governance />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </Providers>
  </React.StrictMode>
);
