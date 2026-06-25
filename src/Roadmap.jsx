import { useState } from "react";
import { Link } from "react-router-dom";
import { Twitter, Menu, X, CheckCircle2, Loader, Circle } from "lucide-react";
import WalletConnector from "./components/WalletConnector";

const PHASES = [
  {
    id: 1,
    title: "Foundation",
    period: "Q1 2026",
    status: "completed",
    items: [
      "Platform launch on Solana mainnet",
      "CTKN token generation event",
      "Initial DEX offering on Jupiter",
      "Basic dashboard with portfolio tracking",
      "Wallet integration (Phantom)",
    ],
  },
  {
    id: 2,
    title: "Core Products",
    period: "Q2 2026",
    status: "in_progress",
    items: [
      "Construction material marketplace",
      "Token swap with Jupiter v6 integration",
      "AI-powered price prediction engine",
      "Supply chain tracker with real Solana tx data",
      "NFT certificate minting for material authenticity",
      "Real wallet balance display & analytics",
    ],
  },
  {
    id: 3,
    title: "Ecosystem",
    period: "Q3 2026",
    status: "upcoming",
    items: [
      "DAO governance launch with Snapshot integration",
      "CTKN staking pools with DefiLlama yields",
      "Staking rewards & LP incentives",
      "Mobile app (iOS + Android)",
      "Developer API v1 (public beta)",
    ],
  },
  {
    id: 4,
    title: "Expansion",
    period: "Q4 2026",
    status: "upcoming",
    items: [
      "Cross-chain bridge (Eclipse, Solana L2s)",
      "Enterprise API with dedicated RPC endpoints",
      "Real-world asset tokenization",
      "Global supplier onboarding",
      "Institutional custody integration",
    ],
  },
  {
    id: 5,
    title: "Vision",
    period: "2027+",
    status: "upcoming",
    items: [
      "Fully decentralized governance",
      "AI supply chain optimization",
      "Carbon credit integration",
      "Physical delivery network",
      "Open-source protocol",
    ],
  },
];

const STATUS_META = {
  completed: { dot: "bg-green-400", ring: "ring-green-400/30", icon: CheckCircle2, color: "text-green-400", label: "Completed" },
  in_progress: { dot: "bg-yellow-400", ring: "ring-yellow-400/30", icon: Loader, color: "text-yellow-400", label: "In Progress" },
  upcoming: { dot: "bg-white/20", ring: "ring-white/10", icon: Circle, color: "text-white/30", label: "Upcoming" },
};

export default function Roadmap() {
  const [menuOpen, setMenuOpen] = useState(false);

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
                <path clipRule="evenodd" d="m15.2286 4.99951c-3.2154 0-6.18655 1.71539-7.79425 4.5l-5.7735 9.99999c-1.6076941 2.7846-1.607697 6.2154 0 9l5.7735 10c1.6077 2.7846 4.57885 4.5 7.79425 4.5h11.547c3.2154 0 6.1865-1.7154 7.7942-4.5l5.7735-10c1.6077-2.7846 1.6077-6.2154 0-9l-5.7735-9.99999c-1.6077-2.78461-4.5788-4.5-7.7942-4.5zm11.547 5.99999h-7.2169c-1.1547 0-1.8762 1.2499-1.298 2.2494 1.784 3.0838 3.5722 6.1653 5.3536 9.2506.5359.9282.5359 2.0718 0 3-1.7814 3.0854-3.5696 6.1668-5.3536 9.2506-.5782.9995.1433 2.2494 1.298 2.2494h7.2169c1.0718 0 2.0622-.5718 2.5981-1.5l5.7735-10c.5359-.9282.5359-2.0718 0-3l-5.7735-10c-.5359-.9282-1.5263-1.5-2.5981-1.5z" fillRule="evenodd" />
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
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors inline-flex items-center gap-2" onClick={() => setMenuOpen(false)}><Twitter size={16} /></a>
            <div onClick={() => setMenuOpen(false)}><WalletConnector /></div>
          </div>
        )}

        <main className="flex-1 px-4 sm:px-6 lg:px-12 py-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            <div>
              <h1 className="text-2xl font-bold">Roadmap</h1>
              <p className="text-white/50 text-sm">ConstrToken development milestones & product timeline</p>
            </div>

            <div className="relative">
              <div className="absolute left-[19px] top-0 bottom-0 w-px bg-white/10" />

              <div className="space-y-6">
                {PHASES.map((phase) => {
                  const meta = STATUS_META[phase.status];
                  const Icon = meta.icon;
                  return (
                    <div key={phase.id} className="relative flex gap-5">
                      <div className="relative z-10 flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full ring-2 ${meta.ring} bg-black flex items-center justify-center`}>
                          <Icon size={16} className={meta.color} />
                        </div>
                      </div>

                      <div className="flex-1 bg-white/5 border border-white/10 p-5 hover:border-white/20 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                          <div>
                            <h2 className="text-base font-semibold">{phase.title}</h2>
                            <p className="text-xs text-white/40">{phase.period}</p>
                          </div>
                          <span className={`text-[10px] px-2 py-0.5 rounded w-fit ${phase.status === "completed" ? "bg-green-400/10 text-green-400" : phase.status === "in_progress" ? "bg-yellow-400/10 text-yellow-400" : "bg-white/5 text-white/30"}`}>
                            {meta.label}
                          </span>
                        </div>

                        <ul className="space-y-2">
                          {phase.items.map((item, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-[13px]">
                              {phase.status === "completed" ? (
                                <CheckCircle2 size={14} className="text-green-400 mt-0.5 shrink-0" />
                              ) : phase.status === "in_progress" ? (
                                <Loader size={14} className="text-yellow-400 mt-0.5 shrink-0 animate-spin" />
                              ) : (
                                <Circle size={14} className="text-white/20 mt-0.5 shrink-0" />
                              )}
                              <span className={phase.status === "upcoming" ? "text-white/40" : "text-white/80"}>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
