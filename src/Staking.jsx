import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Twitter, Menu, X, Lock, Unlock, Clock, TrendingUp, Coins, Zap, AlertTriangle } from "lucide-react";
import WalletConnector from "./components/WalletConnector";

const FALLBACK_POOLS = [
  { id: "fallback-marinade", token: "mSOL", apy: 7.82, lockDays: 0, minStake: 0.01, totalStaked: 425000000, yourStake: 0, project: "Marinade" },
  { id: "fallback-jito", token: "JitoSOL", apy: 8.14, lockDays: 0, minStake: 0.01, totalStaked: 318000000, yourStake: 0, project: "Jito" },
  { id: "fallback-jupiter", token: "JupSOL", apy: 7.45, lockDays: 0, minStake: 0.01, totalStaked: 158000000, yourStake: 0, project: "Jupiter" },
  { id: "fallback-blaze", token: "bSOL", apy: 7.21, lockDays: 0, minStake: 0.01, totalStaked: 89000000, yourStake: 0, project: "Blaze" },
  { id: "fallback-sanctum", token: "INF", apy: 6.95, lockDays: 0, minStake: 0.01, totalStaked: 52000000, yourStake: 0, project: "Sanctum" },
  { id: "fallback-laine", token: "laineSOL", apy: 7.35, lockDays: 0, minStake: 0.01, totalStaked: 38000000, yourStake: 0, project: "Laine" },
];

const YOUR_POSITIONS = [
  { pool: "CTKN 90-day", amount: "25,000 CTKN", apy: "18.2%", earned: "756.25 CTKN", lockEnd: "Jul 15, 2026", status: "active" },
  { pool: "SOL 30-day", amount: "5.0 SOL", apy: "6.8%", earned: "0.28 SOL", lockEnd: "Jun 30, 2026", status: "active" },
];

const CLAIM_HISTORY = [
  { date: "Jun 22, 2026", amount: "312.5 CTKN", pool: "CTKN 90-day", txHash: "5Kj8f2...d4F2" },
  { date: "Jun 15, 2026", amount: "312.5 CTKN", pool: "CTKN 90-day", txHash: "8Nm3k7...a7B1" },
  { date: "Jun 10, 2026", amount: "0.14 SOL", pool: "SOL 30-day", txHash: "3Px9m2...c2E5" },
];

function formatTVL(val) {
  if (val >= 1e9) return `$${(val / 1e9).toFixed(2)}B`;
  if (val >= 1e6) return `$${(val / 1e6).toFixed(1)}M`;
  if (val >= 1e3) return `$${(val / 1e3).toFixed(1)}K`;
  return `$${val.toLocaleString()}`;
}

export default function Staking() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedPool, setSelectedPool] = useState(null);
  const [stakeAmount, setStakeAmount] = useState("");
  const [tab, setTab] = useState("pools");
  const [pools, setPools] = useState(FALLBACK_POOLS);
  const [loading, setLoading] = useState(true);
  const [totalTvl, setTotalTvl] = useState(FALLBACK_POOLS.reduce((s, p) => s + p.totalStaked, 0));
  const [avgApy, setAvgApy] = useState(FALLBACK_POOLS.reduce((s, p) => s + p.apy, 0) / FALLBACK_POOLS.length);

  useEffect(() => {
    let cancelled = false;

    const fetchPools = async () => {
      try {
        const res = await fetch("https://yields.llama.fi/pools");
        const json = await res.json();

        if (cancelled) return;

        const solanaPools = json.data
          .filter(p => p.chain === "Solana")
          .sort((a, b) => (b.tvlUsd || 0) - (a.tvlUsd || 0))
          .slice(0, 6);

        if (solanaPools.length === 0) throw new Error("No Solana pools found");

        const mapped = solanaPools.map(p => ({
          id: `llama-${p.pool}`,
          token: p.symbol || "SOL",
          apy: p.apyTotal || p.apyBase || 0,
          lockDays: 0,
          minStake: 0.01,
          totalStaked: p.tvlUsd || 0,
          yourStake: 0,
          project: p.project || "Unknown",
        }));

        setPools(mapped);
        setTotalTvl(mapped.reduce((s, p) => s + p.totalStaked, 0));
        setAvgApy(mapped.reduce((s, p) => s + p.apy, 0) / mapped.length);
      } catch {
        // FALLBACK_POOLS already set as initial state
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchPools();
    return () => { cancelled = true; };
  }, []);

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
          <button className="md:hidden text-white" onClick={() => setMenuOpen((p) => !p)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {menuOpen && (
          <div className="fixed inset-0 z-30 bg-black flex flex-col items-center justify-center gap-8 text-lg">
            <button className="absolute top-4 right-4 text-white" onClick={() => setMenuOpen(false)}><X size={28} /></button>
            <div onClick={() => setMenuOpen(false)}><WalletConnector /></div>
          </div>
        )}

        <main className="flex-1 px-4 sm:px-6 lg:px-12 py-6 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-6">
            <div>
              <h1 className="text-2xl font-bold">Staking</h1>
              <p className="text-white/50 text-sm">Earn yield on your SOL & LST tokens</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white/5 border border-white/10 p-4 text-center">
                <p className="text-2xl font-bold text-green-400">{formatTVL(totalTvl)}</p>
                <p className="text-[11px] text-white/40">Total Value Locked</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-4 text-center">
                <p className="text-2xl font-bold text-yellow-400">25,000</p>
                <p className="text-[11px] text-white/40">Your CTKN Staked</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-4 text-center">
                <p className="text-2xl font-bold text-purple-400">{avgApy.toFixed(1)}%</p>
                <p className="text-[11px] text-white/40">Avg APY</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-4 text-center">
                <p className="text-2xl font-bold text-blue-400">1,069</p>
                <p className="text-[11px] text-white/40">Total Earned</p>
              </div>
            </div>

            <div className="flex gap-1 bg-white/5 border border-white/10 p-1">
              {["pools", "positions", "history"].map((t) => (
                <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2 text-xs capitalize transition-colors ${tab === t ? "bg-white/10 text-white" : "text-white/40 hover:text-white/60"}`}>
                  {t === "pools" ? "Staking Pools" : t === "positions" ? "My Positions" : "Claim History"}
                </button>
              ))}
            </div>

            {tab === "pools" && (
              <div className="space-y-3">
                {loading && (
                  <div className="bg-white/5 border border-white/10 p-8 text-center">
                    <p className="text-sm text-white/50">Loading Solana staking pools...</p>
                  </div>
                )}
                {!loading && pools.map((pool) => (
                  <div key={pool.id} className="bg-white/5 border border-white/10 p-4 hover:border-white/20 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/10 flex items-center justify-center">
                          <Coins size={18} className="text-yellow-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{pool.token} Staking</p>
                          <p className="text-[11px] text-white/40">{pool.lockDays === 0 ? "Flexible" : `${pool.lockDays}-day lock`} • {pool.project}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-400">{pool.apy.toFixed(1)}%</p>
                        <p className="text-[10px] text-white/30">APY</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-white/40 mb-3">
                      <span>{pool.project} • {pool.token}</span>
                      <span>TVL: {formatTVL(pool.totalStaked)}</span>
                    </div>
                    <button
                      onClick={() => setSelectedPool(pool)}
                      className="w-full py-2 bg-white text-black text-xs font-medium hover:bg-white/90 transition-colors"
                    >
                      Stake {pool.token}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {tab === "positions" && (
              <div className="space-y-3">
                {YOUR_POSITIONS.map((pos, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm font-medium">{pos.pool}</p>
                        <p className="text-[11px] text-white/40">{pos.amount}</p>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 bg-green-400/10 text-green-400">{pos.status}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-xs">
                      <div><p className="text-white/40 text-[10px]">APY</p><p className="font-medium">{pos.apy}</p></div>
                      <div><p className="text-white/40 text-[10px]">Earned</p><p className="font-medium text-green-400">{pos.earned}</p></div>
                      <div><p className="text-white/40 text-[10px]">Lock Ends</p><p className="font-medium">{pos.lockEnd}</p></div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button className="flex-1 py-1.5 text-[11px] bg-white/10 hover:bg-white/15 transition-colors">Claim Rewards</button>
                      <button className="flex-1 py-1.5 text-[11px] bg-white/10 hover:bg-white/15 transition-colors">Unstake</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === "history" && (
              <div className="space-y-2">
                {CLAIM_HISTORY.map((c, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/[0.07] transition-colors text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-400/10 flex items-center justify-center rounded-full">
                        <TrendingUp size={14} className="text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium">Claim Rewards</p>
                        <p className="text-[10px] text-white/30">{c.date} · {c.pool}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-400">+{c.amount}</p>
                      <p className="text-[10px] text-white/30 font-mono">{c.txHash}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-white/5 border border-white/10 p-4">
              <div className="flex items-center gap-2 text-[11px] text-white/40">
                <AlertTriangle size={12} />
                <span>Staking involves smart contract risk. APY rates are variable and may change.</span>
              </div>
            </div>
          </div>
        </main>
      </div>

      {selectedPool && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedPool(null)}>
          <div className="bg-black/90 border border-white/10 max-w-sm w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-1">Stake {selectedPool.token}</h2>
            <p className="text-xs text-white/40 mb-4">{selectedPool.apy.toFixed(1)}% APY • {selectedPool.lockDays === 0 ? "Flexible" : `${selectedPool.lockDays}-day lock`}</p>

            <div className="space-y-3">
              <div>
                <p className="text-[11px] text-white/40 mb-1">Amount</p>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-3">
                  <input
                    type="number"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    placeholder="0.00"
                    className="flex-1 bg-transparent text-lg font-bold outline-none placeholder-white/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button onClick={() => setStakeAmount(String(selectedPool.minStake * 5))} className="text-[10px] px-2 py-1 bg-white/10 hover:bg-white/20 transition-colors">MAX</button>
                </div>
                <p className="text-[10px] text-white/30 mt-1">Min: {selectedPool.minStake.toLocaleString()} {selectedPool.token}</p>
              </div>

              <div className="bg-white/5 p-3 space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-white/40">Lock Period</span><span>{selectedPool.lockDays === 0 ? "Flexible" : `${selectedPool.lockDays} days`}</span></div>
                <div className="flex justify-between"><span className="text-white/40">APY</span><span className="text-green-400">{selectedPool.apy.toFixed(1)}%</span></div>
                <div className="flex justify-between"><span className="text-white/40">Est. Daily Rewards</span><span>{stakeAmount ? ((parseFloat(stakeAmount) * selectedPool.apy / 100 / 365)).toFixed(2) : "0"} {selectedPool.token}</span></div>
              </div>

              <button className="w-full py-3 bg-white text-black font-medium text-sm hover:bg-white/90 transition-colors">
                Confirm Stake
              </button>
              <button onClick={() => setSelectedPool(null)} className="w-full py-2 text-xs text-white/50 hover:text-white transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
