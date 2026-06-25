import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Twitter, Menu, X, Wallet, Copy, ExternalLink, TrendingUp, TrendingDown, Clock, Shield, Award, Coins } from "lucide-react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import WalletConnector from "./components/WalletConnector";

const CG = "https://api.coingecko.com/api/v3";

const ACHIEVEMENTS = [
  { icon: "🏆", title: "Early Adopter", desc: "Joined in first 100 users", unlocked: true },
  { icon: "🎯", title: "Power Trader", desc: "100+ token swaps completed", unlocked: true },
  { icon: "🔒", title: "Diamond Hands", desc: "Staked for 180+ days", unlocked: false },
  { icon: "🗳️", title: "DAO Voter", desc: "Voted on 10+ proposals", unlocked: false },
  { icon: "📦", title: "Supply Master", desc: "50+ materials ordered", unlocked: true },
  { icon: "🤖", title: "AI Enthusiast", desc: "Used AI predictor 50+ times", unlocked: false },
];

export default function Profile() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [prices, setPrices] = useState({});
  const [copied, setCopied] = useState(false);
  const [solBalance, setSolBalance] = useState(null);
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();

  const fetchPrices = useCallback(async () => {
    try {
      const res = await fetch(`${CG}/simple/price?ids=solana,usd-coin&vs_currencies=usd`);
      const data = await res.json();
      setPrices(data);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => { fetchPrices(); }, [fetchPrices]);

  useEffect(() => {
    if (!connected || !publicKey) { setSolBalance(null); return; }
    const getBalance = async () => {
      try {
        const bal = await connection.getBalance(publicKey);
        setSolBalance(bal / LAMPORTS_PER_SOL);
      } catch (e) {
        console.error("Balance error:", e);
      }
    };
    getBalance();
    const interval = setInterval(getBalance, 30000);
    return () => clearInterval(interval);
  }, [connected, publicKey, connection]);

  const address = publicKey?.toBase58() || "Not connected";
  const shortAddr = connected ? `${address.slice(0, 4)}...${address.slice(-4)}` : "Connect Wallet";
  const solPrice = prices.solana?.usd || 178;

  const holdings = [
    { symbol: "SOL", balance: solBalance !== null ? solBalance : 42.18, color: "#9945FF" },
    { symbol: "USDC", balance: 12450, color: "#2775CA" },
    { symbol: "CTKN", balance: 85000, color: "#F59E0B" },
  ];

  const holdingsWithUsd = holdings.map((h) => ({
    ...h,
    usd: h.symbol === "SOL" ? h.balance * solPrice : h.symbol === "USDC" ? h.balance : h.balance * 0.42,
  }));
  const totalUsd = holdingsWithUsd.reduce((sum, h) => sum + h.usd, 0);

  const copyAddress = () => {
    if (!connected || !publicKey) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative min-h-screen w-full bg-black text-white overflow-hidden">
      <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
        <source src="https://cdn.sceneai.art/Hero%20Section%20Video/a8132a81-b526-4f91-8095-003ce931ecdd.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative z-20 flex flex-col min-h-screen">
        <nav className="flex items-center justify-between px-4 sm:px-6 lg:px-12 py-4">
          <Link to="/">
            <svg fill="currentColor" height="32" viewBox="0 0 145 48" width="96" xmlns="http://www.w3.org/2000/svg" className="text-white shrink-0">
              <g fill="currentColor">
                <path clipRule="evenodd" d="m15.2286 4.99951c-3.2154 0-6.18655 1.71539-7.79425 4.5l-5.7735 9.99999c-1.6076941 2.7846-1.607697 6.2154 0 9l5.7735 10c1.6077 2.7846 4.57885 4.5 7.79425 4.5h11.547c3.2154 0 6.1865-1.7154 7.7942-4.5l5.7735-10c1.6077-2.7846 1.6077-6.2154 0-9l-5.7735-9.99999c-1.6077-2.78461-4.5788-4.5-7.7942-4.5zm11.547 5.99999h-7.2169c-1.1547 0-1.8762 1.2499-1.298 2.2494 1.784 3.0838 3.5722 6.1653 5.3536 9.2506.5359.9282.5359 2.0718 0 3-1.7814 3.0854-3.5696 6.1668-5.3536 9.2506-.5782.9995.1433 2.2494 1.298 2.2494h7.2169c1.0718 0 2.0622-.5718 2.5981-1.5l5.7735-10c.5359-.9282.5359-2.0718 0-3l-5.7735-10c-.5359-.9282-1.5263-1.5-2.5981-1.5z" fillRule="evenodd"/>
                <path d="m66.983 20.526h-4.536c-.513-1.809-1.809-2.781-3.645-2.781-2.781 0-4.374 2.322-4.374 6.102 0 3.807 1.566 6.048 4.374 6.048 1.728 0 3.078-.918 3.591-2.646h4.59c-.945 4.05-4.212 6.183-8.127 6.183-5.481 0-8.856-3.645-8.856-9.585s3.375-9.639 8.91-9.639c3.942 0 7.29 2.133 8.073 6.318z" />
                <path d="m75.1442 33.432c-4.401 0-7.128-2.916-7.128-7.695 0-4.941 2.808-7.722 7.128-7.722 4.401 0 7.155 2.97 7.155 7.722 0 4.914-2.835 7.695-7.155 7.695zm0-3.348c1.917 0 2.916-1.512 2.916-4.347 0-2.808-1.026-4.374-2.916-4.374s-2.889 1.539-2.889 4.374c0 2.808 1.026 4.347 2.889 4.347z" />
                <path d="m83.9439 33v-14.526h4.1309v2.025c.918-1.728 2.3221-2.484 3.8071-2.484.594 0 1.134.162 1.431.459v3.483c-.486-.108-.999-.162-1.647-.162-2.484 0-3.5911 1.404-3.5911 3.699v7.506z" />
                <path d="m107.851 28.221c-.756 3.348-3.456 5.211-7.02 5.211-4.5093 0-7.2903-2.916-7.2903-7.695 0-4.941 2.808-7.722 7.1283-7.722 4.347 0 7.074 2.889 7.074 7.641v.918h-9.9903c.216 2.322 1.296 3.564 3.0783 3.564 1.35 0 2.268-.594 2.7-1.917zm-7.182-6.912c-1.5393 0-2.5113.999-2.8353 2.889h5.6433c-.324-1.89-1.296-2.889-2.808-2.889z" />
                <path d="m118.324 33.432c-5.697 0-9.207-3.672-9.207-9.585 0-5.94 3.51-9.639 9.207-9.639 5.67 0 9.18 3.699 9.18 9.639 0 5.913-3.51 9.585-9.18 9.585zm0-3.537c2.997 0 4.752-2.268 4.752-6.048s-1.755-6.102-4.752-6.102c-3.024 0-4.779 2.295-4.779 6.102 0 3.78 1.755 6.048 4.779 6.048z" />
                <path d="m133.466 19.365c0 3.915 10.8.594 10.8 8.1 0 3.78-3.132 5.967-7.425 5.967-4.347 0-7.452-1.998-8.1-6.183h4.563c.351 1.809 1.62 2.808 3.564 2.808s2.97-.783 2.97-2.052c0-4.104-10.827-.972-10.827-8.235 0-3.078 2.565-5.562 7.074-5.562 3.807 0 7.101 1.809 7.668 6.048h-4.617c-.378-1.809-1.431-2.673-3.213-2.673-1.512 0-2.457.702-2.457 1.782z" />
              </g>
            </svg>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-[14px] font-normal text-white/70">
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors inline-flex items-center"><Twitter size={14} /></a>
            <WalletConnector />
          </div>
          <button className="md:hidden text-white" onClick={() => setMenuOpen((p) => !p)}>{menuOpen ? <X size={24} /> : <Menu size={24} />}</button>
        </nav>

        {menuOpen && (
          <div className="fixed inset-0 z-30 bg-black flex flex-col items-center justify-center gap-8 text-lg">
            <button className="absolute top-4 right-4 text-white" onClick={() => setMenuOpen(false)}><X size={28} /></button>
            <div onClick={() => setMenuOpen(false)}><WalletConnector /></div>
          </div>
        )}

        <main className="flex-1 px-4 sm:px-6 lg:px-12 py-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white/5 border border-white/10 p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-2xl">👤</div>
                <div>
                  <h1 className="text-xl font-bold">Wallet Profile</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-white/40 font-mono">{shortAddr}</span>
                    {connected && (
                      <>
                        <button onClick={copyAddress} className="text-white/30 hover:text-white/60 transition-colors"><Copy size={12} /></button>
                        {copied && <span className="text-[10px] text-green-400">Copied!</span>}
                        <a href={`https://solscan.io/account/${address}`} target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white/60 transition-colors"><ExternalLink size={12} /></a>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div><p className="text-[10px] text-white/40">Total Balance</p><p className="text-lg font-bold">${totalUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p></div>
                <div><p className="text-[10px] text-white/40">Network</p><p className="text-lg font-bold">{connected ? "Solana" : "Not connected"}</p></div>
                <div><p className="text-[10px] text-white/40">SOL Balance</p><p className="text-lg font-bold">{solBalance !== null ? solBalance.toFixed(4) : "--"} SOL</p></div>
                <div><p className="text-[10px] text-white/40">Member Since</p><p className="text-lg font-bold">Jun 2026</p></div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {holdingsWithUsd.map((h) => (
                <div key={h.symbol} className="bg-white/5 border border-white/10 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: h.color }} />
                    <span className="text-xs font-medium">{h.symbol}</span>
                  </div>
                  <p className="text-xl font-bold">{h.symbol === "SOL" && solBalance !== null ? h.balance.toFixed(4) : h.balance.toLocaleString()}</p>
                  <p className="text-xs text-white/40">${h.usd.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                </div>
              ))}
            </div>

            <div className="bg-white/5 border border-white/10 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Clock size={16} className="text-white/50" />
                <h3 className="text-sm font-medium">Recent Activity</h3>
              </div>
              <div className="space-y-2">
                {[
                  { type: "swap", desc: `Swapped 5 SOL → ${(5 * solPrice).toFixed(0)} USDC`, time: "2h ago", tx: "5Kj8f2...d4F2" },
                  { type: "stake", desc: "Staked 25,000 CTKN (90-day)", time: "1d ago", tx: "8Nm3k7...a7B1" },
                  { type: "receive", desc: `Received ${solBalance ? (solBalance * 0.1).toFixed(2) : "12.5"} SOL from order payment`, time: "2d ago", tx: "3Px9m2...c2E5" },
                  { type: "swap", desc: "Swapped 500 USDC → 2.8 SOL", time: "3d ago", tx: "7Rt2p8...f8D4" },
                  { type: "vote", desc: "Voted FOR PROP-003 (SteelWorks partnership)", time: "4d ago", tx: "2Wq5b1...a9C3" },
                  { type: "nft", desc: "Minted NFT-005 (Insulation Fiberglass)", time: "5d ago", tx: "9Lp4e3...F8a2" },
                ].map((a, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/[0.07] transition-colors text-xs">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${a.type === "swap" ? "bg-blue-400/10" : a.type === "stake" ? "bg-green-400/10" : a.type === "receive" ? "bg-yellow-400/10" : a.type === "vote" ? "bg-purple-400/10" : "bg-white/10"}`}>
                      {a.type === "swap" ? <TrendingUp size={14} className="text-blue-400" /> :
                       a.type === "stake" ? <Coins size={14} className="text-green-400" /> :
                       a.type === "receive" ? <TrendingDown size={14} className="text-yellow-400" /> :
                       a.type === "vote" ? <Shield size={14} className="text-purple-400" /> :
                       <Award size={14} className="text-white/60" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{a.desc}</p>
                      <p className="text-[10px] text-white/30">{a.time} · {a.tx}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Award size={16} className="text-yellow-400" />
                <h3 className="text-sm font-medium">Achievements</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {ACHIEVEMENTS.map((a, i) => (
                  <div key={i} className={`p-3 border transition-colors ${a.unlocked ? "bg-white/5 border-white/10" : "bg-white/[0.02] border-white/5 opacity-50"}`}>
                    <div className="text-2xl mb-2">{a.icon}</div>
                    <p className="text-xs font-medium">{a.title}</p>
                    <p className="text-[10px] text-white/40">{a.desc}</p>
                    {a.unlocked && <p className="text-[10px] text-green-400 mt-1">Unlocked</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
