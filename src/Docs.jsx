import { useState } from "react";
import { Link } from "react-router-dom";
import { Twitter, Menu, X, BookOpen, Zap, Coins, Globe, Code, HelpCircle, ChevronRight, Server, Blocks } from "lucide-react";
import WalletConnector from "./components/WalletConnector";

export default function Docs() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("getting-started");

  const navItems = [
    { id: "getting-started", label: "Getting Started", icon: BookOpen },
    { id: "quick-start", label: "Quick Start", icon: Zap },
    { id: "architecture", label: "Architecture", icon: Server },
    { id: "tokenomics", label: "Tokenomics", icon: Coins },
    { id: "api-reference", label: "API Reference", icon: Code },
    { id: "sdks", label: "SDKs & Libraries", icon: Blocks },
    { id: "faq", label: "FAQ", icon: HelpCircle },
  ];

  const scrollTo = (id) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="relative min-h-screen w-full bg-black text-white overflow-hidden">
      <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
        <source src="https://cdn.sceneai.art/Hero%20Section%20Video/a8132a81-b526-4f91-8095-003ce931ecdd.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative z-20 flex flex-col min-h-screen">
        {/* ── NAV ── */}
        <nav className="flex items-center justify-between px-4 sm:px-6 lg:px-12 py-4 shrink-0">
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
          <button className="md:hidden text-white" onClick={() => setMenuOpen((p) => !p)} aria-label={menuOpen ? "Close menu" : "Open menu"}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* ── MOBILE MENU ── */}
        {menuOpen && (
          <div className="fixed inset-0 z-30 bg-black flex flex-col items-center justify-center gap-8 text-lg">
            <button className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X size={28} /></button>
            <div onClick={() => setMenuOpen(false)}><WalletConnector /></div>
          </div>
        )}

        {/* ── MOBILE SIDEBAR (horizontal scroll) ── */}
        <div className="md:hidden overflow-x-auto border-b border-white/10 px-4 py-3 flex gap-3 shrink-0">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 text-xs border rounded transition-colors shrink-0 ${
                activeSection === id
                  ? "border-white text-white bg-white/10"
                  : "border-white/10 text-white/40 hover:text-white"
              }`}
            >
              <Icon size={12} />
              {label}
            </button>
          ))}
        </div>

        {/* ── MAIN LAYOUT ── */}
        <div className="flex-1 flex overflow-hidden">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-56 lg:w-64 shrink-0 border-r border-white/10 overflow-y-auto px-4 py-6">
            <p className="text-[11px] uppercase tracking-widest text-white/30 mb-4 px-3">Documentation</p>
            <nav className="space-y-0.5">
              {navItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded transition-colors text-left ${
                    activeSection === id
                      ? "text-white bg-white/5 border-l-2 border-white"
                      : "text-white/40 hover:text-white border-l-2 border-transparent"
                  }`}
                >
                  <Icon size={15} className="shrink-0" />
                  {label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Content Area */}
          <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-12 py-6">
            <div className="max-w-3xl mx-auto space-y-6 pb-24">

              {/* ── Getting Started ── */}
              <section id="getting-started" className="bg-white/5 border border-white/10 p-5 sm:p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen size={18} className="text-purple-400 shrink-0" />
                  <h2 className="text-lg font-semibold">Getting Started</h2>
                </div>
                <p className="text-sm text-white/70 leading-relaxed mb-4">
                  ConstrToken is a decentralized protocol bridging construction material procurement with Solana blockchain.
                </p>
                <p className="text-sm text-white/50 mb-2">What you can do:</p>
                <ul className="space-y-2 mb-5">
                  {[
                    "Buy construction materials with SOL, USDC, BTC, or CTKN",
                    "Track supply chain on-chain in real-time",
                    "Verify material authenticity via NFT certificates",
                    "Stake CTKN to earn yield",
                    "Participate in DAO governance",
                    "Swap tokens via Jupiter aggregator",
                    "Access real-time data via API",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-white/70 leading-relaxed">
                      <ChevronRight size={14} className="text-purple-400/60 mt-1 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-white/50 mb-2">Requirements:</p>
                <ul className="space-y-2">
                  {[
                    "Solana wallet (Phantom recommended)",
                    "SOL for gas fees (~$0.00025 per transaction)",
                    "Optional: CTKN for staking/governance",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-white/70 leading-relaxed">
                      <ChevronRight size={14} className="text-purple-400/60 mt-1 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* ── Quick Start ── */}
              <section id="quick-start" className="bg-white/5 border border-white/10 p-5 sm:p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Zap size={18} className="text-purple-400 shrink-0" />
                  <h2 className="text-lg font-semibold">Quick Start</h2>
                </div>
                <div className="space-y-5">
                  {[
                    {
                      step: "Step 1: Connect Wallet",
                      items: [
                        'Click "Connect Wallet" in the top nav',
                        "Select Phantom (or other Solana wallet)",
                        "Approve the connection",
                      ],
                    },
                    {
                      step: "Step 2: Fund Your Wallet",
                      items: [
                        "Transfer SOL from an exchange (Coinbase, Binance)",
                        "Or bridge from Ethereum via Wormhole",
                        "Minimum: 0.1 SOL for gas + your purchase amount",
                      ],
                    },
                    {
                      step: "Step 3: Browse Marketplace",
                      items: [
                        "Visit /marketplace",
                        "Browse 12+ construction materials",
                        "See real-time prices in USD + SOL equivalent",
                      ],
                    },
                    {
                      step: "Step 4: Place Order",
                      items: [
                        "Add items to cart",
                        "Select payment token (SOL/USDC/CTKN)",
                        "Confirm transaction in wallet",
                        "Receive NFT certificate for authenticity",
                      ],
                    },
                    {
                      step: "Step 5: Track Delivery",
                      items: [
                        "Visit /supply-chain",
                        "See blockchain-verified milestones",
                        "Scan QR codes for on-chain verification",
                      ],
                    },
                  ].map(({ step, items }) => (
                    <div key={step}>
                      <p className="text-sm font-medium text-white mb-2">{step}</p>
                      <ul className="space-y-1.5 pl-4">
                        {items.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-white/70 leading-relaxed">
                            <span className="text-purple-400/60 mt-1.5 shrink-0">—</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              {/* ── Architecture ── */}
              <section id="architecture" className="bg-white/5 border border-white/10 p-5 sm:p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Server size={18} className="text-purple-400 shrink-0" />
                  <h2 className="text-lg font-semibold">Architecture</h2>
                </div>
                <div className="space-y-5">
                  {[
                    {
                      label: "Frontend",
                      items: ["React 18 + Vite 5", "Tailwind CSS 3", "React Router 7", "Lucide icons"],
                    },
                    {
                      label: "Blockchain",
                      items: ["Solana mainnet-beta", "@solana/wallet-adapter (Phantom)", "Jupiter v6 Aggregator (swap execution)", "Metaplex (NFT standard)"],
                    },
                    {
                      label: "Data Sources",
                      items: ["CoinGecko API (prices, charts, global data)", "DefiLlama yields API (staking pools, APY)", "Snapshot GraphQL (DAO proposals)", "Solana RPC (transactions, balances)", "DexScreener (token pairs, trending)", "Helius RPC (enhanced Solana RPC)"],
                    },
                    {
                      label: "Infrastructure",
                      items: ["Vercel (hosting, edge functions)", "GitHub (source control)", "CSP headers (security)", "Code splitting (React.lazy + manualChunks)"],
                    },
                  ].map(({ label, items }) => (
                    <div key={label}>
                      <p className="text-sm font-medium text-white mb-2">{label}</p>
                      <ul className="space-y-1.5">
                        {items.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-white/70 leading-relaxed">
                            <span className="text-purple-400/60 mt-1.5 shrink-0">—</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              {/* ── Tokenomics ── */}
              <section id="tokenomics" className="bg-white/5 border border-white/10 p-5 sm:p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Coins size={18} className="text-purple-400 shrink-0" />
                  <h2 className="text-lg font-semibold">Tokenomics</h2>
                </div>
                <p className="text-sm text-white/70 leading-relaxed mb-1">CTKN Token — ConstrToken Governance Token</p>
                <p className="text-sm text-white/50 mb-5">Total Supply: 1,000,000,000 CTKN</p>

                <p className="text-sm font-medium text-white mb-2">Allocation</p>
                <ul className="space-y-1.5 mb-5">
                  {[
                    "30% Ecosystem Rewards (300M) — supply chain incentives, material verification rewards",
                    "25% Public Sale (250M) — IDO on Jupiter, DEX liquidity",
                    "20% Team & Founders (200M) — 3-year cliff, 2-year linear vesting",
                    "15% Treasury / DAO Reserve (150M) — governed by DAO proposals",
                    "10% Advisors & Partners (100M) — 2-year linear vesting",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-white/70 leading-relaxed">
                      <span className="text-purple-400/60 mt-1.5 shrink-0">—</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <p className="text-sm font-medium text-white mb-2">Utility</p>
                <ul className="space-y-1.5 mb-5">
                  {[
                    "Governance: 1 CTKN = 1 vote on proposals",
                    "Staking: Earn 12-25% APY (30/90/180-day pools)",
                    "Payments: 5% discount on marketplace purchases",
                    "API Access: Stake CTKN for higher API rate limits",
                    "Rewards: Earn CTKN for supply chain verification",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-white/70 leading-relaxed">
                      <span className="text-purple-400/60 mt-1.5 shrink-0">—</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <p className="text-sm font-medium text-white mb-2">Staking Pools</p>
                <div className="space-y-2">
                  {[
                    { pool: "30-day", apy: "~12.5% APY", min: "min 1,000 CTKN" },
                    { pool: "90-day", apy: "~18.2% APY", min: "min 5,000 CTKN" },
                    { pool: "180-day", apy: "~24.8% APY", min: "min 10,000 CTKN" },
                  ].map(({ pool, apy, min }) => (
                    <div key={pool} className="flex items-center gap-3 text-sm text-white/70">
                      <span className="text-purple-400/60">—</span>
                      <span className="font-medium text-white/80">{pool}</span>
                      <span>{apy}</span>
                      <span className="text-white/40">{min}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* ── API Reference ── */}
              <section id="api-reference" className="bg-white/5 border border-white/10 p-5 sm:p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Code size={18} className="text-purple-400 shrink-0" />
                  <h2 className="text-lg font-semibold">API Reference</h2>
                </div>
                <div className="mb-4 space-y-1">
                  <p className="text-sm text-white/70">Base URL: <span className="text-green-400 font-mono text-xs">https://api.constrtoken.io/v1</span></p>
                  <p className="text-sm text-white/70">Authentication: <span className="text-white/50">X-API-Key header</span></p>
                </div>

                <div className="space-y-5">
                  {[
                    {
                      method: "GET",
                      endpoint: "/v1/prices",
                      query: "?symbols=SOL,BTC,ETH,CTKN",
                      response: '{ "prices": [{ "symbol", "usd", "change_24h" }] }',
                    },
                    {
                      method: "GET",
                      endpoint: "/v1/marketplace",
                      query: "?category=steel&page=1&limit=20",
                      response: '{ "items": [{ "id", "name", "price_usd", "price_sol", "stock" }] }',
                    },
                    {
                      method: "GET",
                      endpoint: "/v1/supply-chain/:hash",
                      query: null,
                      response: '{ "shipment": { "id", "status", "milestones[]", "tx_hash" } }',
                    },
                    {
                      method: "GET",
                      endpoint: "/v1/certificates/:mint",
                      query: null,
                      response: '{ "certificate": { "id", "material", "grade", "verified", "attributes[]" } }',
                    },
                    {
                      method: "GET",
                      endpoint: "/v1/governance",
                      query: "?state=active&space=solana.eth",
                      response: '{ "proposals": [{ "id", "title", "scores", "quorum", "state" }] }',
                    },
                    {
                      method: "POST",
                      endpoint: "/v1/swap",
                      query: null,
                      body: '{ "inputMint", "outputMint", "amount", "slippage" }',
                      response: '{ "swapTransaction", "priceImpact", "route" }',
                    },
                    {
                      method: "POST",
                      endpoint: "/v1/stake",
                      query: null,
                      body: '{ "pool", "amount", "duration" }',
                      response: '{ "txSignature", "apy", "lockEnd" }',
                    },
                  ].map(({ method, endpoint, query, body, response }) => (
                    <div key={endpoint + method} className="bg-black/50 border border-white/10 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${method === "GET" ? "bg-green-500/20 text-green-400" : "bg-blue-500/20 text-blue-400"}`}>
                          {method}
                        </span>
                        <span className="font-mono text-xs text-white">{endpoint}</span>
                      </div>
                      {query && <p className="font-mono text-[11px] text-white/40 mb-1">Query: {query}</p>}
                      {body && <p className="font-mono text-[11px] text-white/40 mb-1">Body: {body}</p>}
                      <p className="font-mono text-[11px] text-green-400/70">Response: {response}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-5">
                  <p className="text-sm font-medium text-white mb-2">Rate Limits</p>
                  <ul className="space-y-1.5">
                    {[
                      "Free: 100 req/day",
                      "Builder: 10,000 req/day",
                      "Enterprise: Unlimited",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-white/70 leading-relaxed">
                        <span className="text-purple-400/60 mt-1.5 shrink-0">—</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* ── SDKs & Libraries ── */}
              <section id="sdks" className="bg-white/5 border border-white/10 p-5 sm:p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Blocks size={18} className="text-purple-400 shrink-0" />
                  <h2 className="text-lg font-semibold">SDKs & Libraries</h2>
                </div>
                <div className="space-y-4 mb-5">
                  <div>
                    <p className="text-sm text-white/50 mb-1">JavaScript/TypeScript</p>
                    <div className="bg-black/50 border border-white/10 p-4 font-mono text-xs text-green-400">
                      npm install @constrtoken/sdk
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-white/50 mb-1">Python</p>
                    <div className="bg-black/50 border border-white/10 p-4 font-mono text-xs text-green-400">
                      pip install constrtoken
                    </div>
                  </div>
                </div>
                <p className="text-sm font-medium text-white mb-2">Usage Example (JS)</p>
                <div className="bg-black/50 border border-white/10 p-4 font-mono text-xs text-green-400 whitespace-pre overflow-x-auto">{`import { ConstrToken } from '@constrtoken/sdk';

const ct = new ConstrToken({ apiKey: 'ctk_live_xxx' });

// Get prices
const prices = await ct.prices.get(['SOL', 'BTC']);

// Create swap
const swap = await ct.swap.create({
  inputMint: 'So11111111111111111111111111111111',
  outputMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  amount: 1000000000,
  slippage: 0.5,
});`}</div>
              </section>

              {/* ── FAQ ── */}
              <section id="faq" className="bg-white/5 border border-white/10 p-5 sm:p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <HelpCircle size={18} className="text-purple-400 shrink-0" />
                  <h2 className="text-lg font-semibold">FAQ</h2>
                </div>
                <div className="space-y-5">
                  {[
                    {
                      q: "What wallets are supported?",
                      a: "Phantom, Solflare, and any Solana wallet adapter-compatible wallet.",
                    },
                    {
                      q: "What are the gas fees?",
                      a: "~0.000005 SOL per transaction (~$0.0009 at current prices).",
                    },
                    {
                      q: "Can I pay with USDC?",
                      a: "Yes, we accept SOL, USDC, USDT, BTC (wrapped), and CTKN.",
                    },
                    {
                      q: "How do NFT certificates work?",
                      a: "Each material delivery generates a unique NFT on Solana containing supplier info, quality grade, and transaction hash. This proves authenticity and origin.",
                    },
                    {
                      q: "Is there a mobile app?",
                      a: "Not yet — Q3 2026 roadmap. Currently mobile-responsive web app.",
                    },
                    {
                      q: "How do I get API access?",
                      a: "Visit /api-keys, connect your wallet, and generate a free API key. Upgrade to Builder or Enterprise for higher limits.",
                    },
                    {
                      q: "What is CTKN?",
                      a: "ConstrToken — our governance and utility token. Used for voting, staking, payments, and API access.",
                    },
                    {
                      q: "How do I report a bug?",
                      a: "Open an issue on GitHub: github.com/allinoneacount1-dot/hero-landing",
                    },
                  ].map(({ q, a }) => (
                    <div key={q}>
                      <p className="text-sm font-medium text-white mb-1">{q}</p>
                      <p className="text-sm text-white/70 leading-relaxed">{a}</p>
                    </div>
                  ))}
                </div>
              </section>

            </div>
          </main>
        </div>
      </div>
    </div>
  );
}