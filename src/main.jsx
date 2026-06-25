import React, { Suspense } from "react";
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
import Whitepaper from "./Whitepaper.jsx";
import Roadmap from "./Roadmap.jsx";
import ApiKeys from "./ApiKeys.jsx";
import NotFound from "./NotFound.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import BottomNav from "./components/BottomNav.jsx";
import ToastProvider from "./components/ToastProvider.jsx";
import "@solana/wallet-adapter-react-ui/styles.css";
import "./index.css";

const endpoint = clusterApiUrl("mainnet-beta");

function LoadingFallback() {
  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white animate-spin rounded-full" />
        <p className="text-xs text-white/40">Loading...</p>
      </div>
    </div>
  );
}

// Lazy load heavy pages to reduce initial bundle
const Governance = React.lazy(() => import("./Governance.jsx"));
const Marketplace = React.lazy(() => import("./Marketplace.jsx"));
const Profile = React.lazy(() => import("./Profile.jsx"));

function Providers({ children }) {
  const wallets = React.useMemo(() => [new PhantomWalletAdapter()], []);
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
    <ErrorBoundary>
      <Providers>
        <ToastProvider>
          <BrowserRouter>
          <Suspense fallback={<LoadingFallback />}>
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
              <Route path="/whitepaper" element={<Whitepaper />} />
              <Route path="/roadmap" element={<Roadmap />} />
              <Route path="/api-keys" element={<ApiKeys />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <BottomNav />
          </Suspense>
          </BrowserRouter>
        </ToastProvider>
      </Providers>
    </ErrorBoundary>
  </React.StrictMode>
);
