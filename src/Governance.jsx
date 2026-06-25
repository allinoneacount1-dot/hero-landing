import { useState } from "react";
import { Link } from "react-router-dom";
import { Twitter, Menu, X, Vote, CheckCircle, Clock, Users, ChevronRight, AlertTriangle, Plus } from "lucide-react";
import WalletConnector from "./components/WalletConnector";

const PROPOSALS = [
  {
    id: "PROP-001",
    title: "Increase CTKN Staking APY for 180-day pool",
    description: "Proposal to increase the 180-day staking APY from 24.8% to 30% to attract more long-term stakers and reduce circulating supply.",
    author: "5Kj8f2...d4F2",
    status: "active",
    votesFor: 125000,
    votesAgainst: 32000,
    totalVotes: 157000,
    quorum: 200000,
    endsIn: "3 days",
    category: "Tokenomics",
  },
  {
    id: "PROP-002",
    title: "Add USDT support for material payments",
    description: "Expand payment options to include USDT (Tether) alongside SOL, USDC, and CTKN for all material orders.",
    author: "8Nm3k7...a7B1",
    status: "active",
    votesFor: 89000,
    votesAgainst: 12000,
    totalVotes: 101000,
    quorum: 200000,
    endsIn: "5 days",
    category: "Payments",
  },
  {
    id: "PROP-003",
    title: "Partner with SteelWorks Corp for exclusive discounts",
    description: "Approve exclusive 15% discount partnership with SteelWorks Corp for all CTKN token holders.",
    author: "3Px9m2...c2E5",
    status: "active",
    votesFor: 201000,
    votesAgainst: 8500,
    totalVotes: 209500,
    quorum: 200000,
    endsIn: "1 day",
    category: "Partnerships",
  },
  {
    id: "PROP-004",
    title: "Treasury allocation for Q3 development",
    description: "Allocate 500,000 USDC from treasury for Q3 platform development, audits, and new feature implementation.",
    author: "7Rt2p8...f8D4",
    status: "passed",
    votesFor: 312000,
    votesAgainst: 15000,
    totalVotes: 327000,
    quorum: 200000,
    endsIn: "Ended",
    category: "Treasury",
  },
  {
    id: "PROP-005",
    title: "Implement AI-powered quality inspection",
    description: "Fund development of AI system for automated material quality verification using computer vision.",
    author: "2Wq5b1...a9C3",
    status: "passed",
    votesFor: 187000,
    votesAgainst: 42000,
    totalVotes: 229000,
    quorum: 200000,
    endsIn: "Ended",
    category: "Development",
  },
];

const statusConfig = {
  active: { color: "text-green-400 bg-green-400/10", icon: Clock, label: "Active" },
  passed: { color: "text-blue-400 bg-blue-400/10", icon: CheckCircle, label: "Passed" },
  rejected: { color: "text-red-400 bg-red-400/10", icon: X, label: "Rejected" },
};

export default function Governance() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [voted, setVoted] = useState({});

  const handleVote = (id, choice) => {
    setVoted((prev) => ({ ...prev, [id]: choice }));
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
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">DAO Governance</h1>
                <p className="text-white/50 text-sm">Vote on proposals that shape the platform</p>
              </div>
              <button className="flex items-center gap-2 text-xs px-4 py-2 bg-white text-black hover:bg-white/90 transition-colors">
                <Plus size={14} /> Create Proposal
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/5 border border-white/10 p-4 text-center">
                <p className="text-2xl font-bold text-green-400">3</p>
                <p className="text-[11px] text-white/40">Active Proposals</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-4 text-center">
                <p className="text-2xl font-bold text-blue-400">85,000</p>
                <p className="text-[11px] text-white/40">Your Voting Power</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-4 text-center">
                <p className="text-2xl font-bold text-purple-400">5</p>
                <p className="text-[11px] text-white/40">Proposals Voted</p>
              </div>
            </div>

            <div className="space-y-3">
              {PROPOSALS.map((p) => {
                const cfg = statusConfig[p.status];
                const StatusIcon = cfg.icon;
                const forPct = (p.votesFor / p.totalVotes) * 100;
                const againstPct = (p.votesAgainst / p.totalVotes) * 100;
                const quorumPct = (p.totalVotes / p.quorum) * 100;

                return (
                  <div key={p.id} className="bg-white/5 border border-white/10 p-4 hover:border-white/20 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] px-2 py-0.5 bg-white/10 text-white/50 rounded">{p.category}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded flex items-center gap-1 ${cfg.color}`}>
                          <StatusIcon size={10} /> {cfg.label}
                        </span>
                      </div>
                      <span className="text-[10px] text-white/30">{p.id}</span>
                    </div>

                    <h3 className="text-sm font-medium mb-1">{p.title}</h3>
                    <p className="text-[11px] text-white/40 mb-3 line-clamp-2">{p.description}</p>

                    <div className="space-y-2 mb-3">
                      <div>
                        <div className="flex justify-between text-[10px] mb-1">
                          <span className="text-green-400">For ({forPct.toFixed(1)}%)</span>
                          <span className="text-white/30">{p.votesFor.toLocaleString()} CTKN</span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-green-400 rounded-full" style={{ width: `${forPct}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[10px] mb-1">
                          <span className="text-red-400">Against ({againstPct.toFixed(1)}%)</span>
                          <span className="text-white/30">{p.votesAgainst.toLocaleString()} CTKN</span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-red-400 rounded-full" style={{ width: `${againstPct}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[10px] mb-1">
                          <span className="text-white/50">Quorum</span>
                          <span className="text-white/30">{quorumPct.toFixed(0)}% of {p.quorum.toLocaleString()}</span>
                        </div>
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-white/30 rounded-full" style={{ width: `${Math.min(quorumPct, 100)}%` }} />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-[10px] text-white/30">
                        <span className="flex items-center gap-1"><Users size={10} /> {p.totalVotes.toLocaleString()} votes</span>
                        <span className="flex items-center gap-1"><Clock size={10} /> {p.endsIn}</span>
                        <span>By {p.author}</span>
                      </div>
                      {p.status === "active" && !voted[p.id] && (
                        <div className="flex gap-2">
                          <button onClick={() => handleVote(p.id, "for")} className="text-[10px] px-3 py-1 bg-green-400/10 text-green-400 hover:bg-green-400/20 transition-colors">Vote For</button>
                          <button onClick={() => handleVote(p.id, "against")} className="text-[10px] px-3 py-1 bg-red-400/10 text-red-400 hover:bg-red-400/20 transition-colors">Vote Against</button>
                        </div>
                      )}
                      {voted[p.id] && (
                        <span className="text-[10px] text-white/30 flex items-center gap-1">
                          <CheckCircle size={10} className={voted[p.id] === "for" ? "text-green-400" : "text-red-400"} />
                          You voted {voted[p.id]}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-white/5 border border-white/10 p-4">
              <div className="flex items-center gap-2 text-[11px] text-white/40">
                <AlertTriangle size={12} />
                <span>Voting power is based on your CTKN token balance. Quorum must be met for proposals to pass.</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
