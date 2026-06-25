import { useState } from "react";
import { Link } from "react-router-dom";
import { Twitter, Menu, X, FileText, BookOpen, AlertTriangle, Lightbulb, Coins, Cpu, Shield, Users } from "lucide-react";
import WalletConnector from "./components/WalletConnector";

export default function Whitepaper() {
  const [menuOpen, setMenuOpen] = useState(false);

  const sections = [
    {
      id: "abstract",
      icon: BookOpen,
      title: "Abstract",
      content: "ConstrToken is a decentralized protocol bridging construction material procurement with Solana blockchain infrastructure. We enable transparent supply chains, tokenized material assets, and instant cross-border payments for the global construction industry.",
    },
    {
      id: "problem",
      icon: AlertTriangle,
      title: "The Problem",
      content: [
        "Fragmented supply chains with limited visibility across tiers",
        "Slow cross-border payments taking 5–14 business days",
        "Widespread counterfeit materials undermining safety and quality",
        "Lack of standardized quality assurance across jurisdictions",
        "Paper-based documentation prone to loss and forgery",
      ],
    },
    {
      id: "solution",
      icon: Lightbulb,
      title: "The Solution",
      content: [
        "On-chain material provenance tracking from source to site",
        "Instant USDC / SOL settlements via Jupiter DEX aggregation",
        "NFT-based authenticity certificates anchored on Metaplex",
        "DAO governance framework for community-driven quality standards",
        "Open oracle network for real-time logistics and pricing data",
      ],
    },
    {
      id: "tokenomics",
      icon: Coins,
      title: "Tokenomics",
      content: [
        "Total Supply: 1,000,000,000 CTKN",
        "30% — Ecosystem & Supply Chain Rewards",
        "25% — Public Sale",
        "20% — Team (3-year cliff, 2-year linear vesting)",
        "15% — Treasury / DAO Reserve",
        "10% — Advisors & Partners",
      ],
    },
    {
      id: "technology",
      icon: Cpu,
      title: "Technology Stack",
      content: [
        "Solana Mainnet — high-throughput L1 settlement",
        "Jupiter DEX — aggregated liquidity and swap routing",
        "Metaplex — NFT minting for material certificates",
        "Helius — scalable RPC infrastructure",
        "Snapshot — off-chain governance voting",
        "CoinGecko — decentralized price oracles",
      ],
    },
    {
      id: "governance",
      icon: Vote,
      title: "Governance",
      content: [
        "DAO with time-locked proposal execution (min 48h delay)",
        "Quorum: 5% of staked CTKN supply",
        "Voting power proportional to CTNK staked + LP token holdings",
        "Emergency multisig (4-of-7) for critical protocol upgrades",
        "Community veto power on treasury allocations exceeding 100k CTKN",
      ],
    },
    {
      id: "security",
      icon: Shield,
      title: "Security",
      content: [
        "Smart contract audit by Kudelski Security (Q2 2025)",
        "Bug bounty program up to $250,000 via Immunefi",
        "Gradual protocol unlocks over 24-month schedule",
        "Formal verification of core token and staking contracts",
        "Real-time monitoring and anomaly detection via HELIUS webhooks",
      ],
    },
    {
      id: "conclusion",
      icon: Users,
      title: "Conclusion",
      content: "ConstrToken invites builders, suppliers, developers, and investors to join a transparent, efficient, and decentralized future for construction material procurement. The protocol is open-source, community-governed, and built for global scale on Solana.",
    },
  ];

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
          <button className="md:hidden text-white" onClick={() => setMenuOpen((p) => !p)} aria-label={menuOpen ? "Close menu" : "Open menu"}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {menuOpen && (
          <div className="fixed inset-0 z-30 bg-black flex flex-col items-center justify-center gap-8 text-lg">
            <button className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X size={28} /></button>
            <div onClick={() => setMenuOpen(false)}><WalletConnector /></div>
          </div>
        )}

        <main className="flex-1 px-4 sm:px-6 lg:px-12 py-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <FileText size={20} className="text-purple-400" />
              <div>
                <h1 className="text-2xl font-bold">Whitepaper</h1>
                <p className="text-white/50 text-sm">ConstrToken Protocol — v1.0</p>
              </div>
            </div>

            {sections.map(({ id, icon: Icon, title, content }) => (
              <section key={id} id={id} className="bg-white/5 border border-white/10 p-5 sm:p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Icon size={18} className="text-purple-400 shrink-0" />
                  <h2 className="text-lg font-semibold">{title}</h2>
                </div>
                {Array.isArray(content) ? (
                  <ul className="space-y-2">
                    {content.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-white/70 leading-relaxed">
                        <span className="text-purple-400/60 mt-1.5 shrink-0">—</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-white/70 leading-relaxed">{content}</p>
                )}
              </section>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
