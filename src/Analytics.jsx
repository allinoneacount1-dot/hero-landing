import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Twitter, Menu, X, RefreshCw, BarChart3, TrendingUp, TrendingDown, Activity, Globe, Layers } from "lucide-react";
import WalletConnector from "./components/WalletConnector";

const COINGECKO = "https://api.coingecko.com/api/v3";

const CHAINS = [
  { id: "solana", name: "Solana", coingeckoId: "solana", color: "#9945FF" },
  { id: "ethereum", name: "Ethereum", coingeckoId: "ethereum", color: "#627EEA" },
  { id: "bitcoin", name: "Bitcoin", coingeckoId: "bitcoin", color: "#F7931A" },
];

const CONSTRUCTION_MATERIALS = [
  { name: "Steel (per ton)", price: 1250, change: -2.1, symbol: "🔩" },
  { name: "Cement (per bag)", price: 12.5, change: +0.8, symbol: "🧱" },
  { name: "Plywood (per sheet)", price: 45, change: +1.2, symbol: "🪵" },
  { name: "Rebar (per ton)", price: 980, change: -1.5, symbol: "🔗" },
  { name: "Copper (per lb)", price: 4.2, change: +3.8, symbol: "⚡" },
  { name: "Insulation (per sqft)", price: 1.8, change: +0.3, symbol: "🧊" },
];

function BarChart({ data, labels, colors, height = 120 }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-1" style={{ height }}>
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-t transition-all duration-500"
            style={{ height: `${(v / max) * 100}%`, backgroundColor: colors[i % colors.length] }}
          />
          <span className="text-[8px] text-white/30 truncate w-full text-center">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

function LineChart({ data, color, height = 60, width = 200 }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * height}`).join(" ");

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`analytics-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon fill={`url(#analytics-${color})`} points={`0,${height} ${points} ${width},${height}`} />
      <polyline fill="none" stroke={color} strokeWidth="1.5" points={points} />
    </svg>
  );
}

export default function Analytics() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [chainData, setChainData] = useState({});
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [globalData, setGlobalData] = useState(null);
  const [charts, setCharts] = useState({});

  const fetchChainData = useCallback(async () => {
    try {
      const ids = CHAINS.map((c) => c.coingeckoId).join(",");
      const res = await fetch(`${COINGECKO}/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true`);
      const data = await res.json();
      setChainData(data);
    } catch (e) {
      console.error("Chain data error:", e);
    }
  }, []);

  const fetchGlobal = useCallback(async () => {
    try {
      const res = await fetch(`${COINGECKO}/global`);
      const data = await res.json();
      setGlobalData(data.data);
    } catch (e) {
      console.error("Global data error:", e);
    }
  }, []);

  const fetchCharts = useCallback(async () => {
    try {
      const results = {};
      for (const chain of CHAINS) {
        const res = await fetch(`${COINGECKO}/coins/${chain.coingeckoId}/market_chart?vs_currency=usd&days=30&interval=daily`);
        const data = await res.json();
        results[chain.coingeckoId] = data.prices?.map((p) => p[1]) || [];
      }
      setCharts(results);
    } catch (e) {
      console.error("Chart error:", e);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchChainData(), fetchGlobal(), fetchCharts()]);
    setLastUpdate(new Date());
    setLoading(false);
  }, [fetchChainData, fetchGlobal, fetchCharts]);

  useEffect(() => {
    refreshAll();
    const interval = setInterval(refreshAll, 60000);
    return () => clearInterval(interval);
  }, [refreshAll]);

  const totalMcap = globalData?.total_market_cap?.usd || 0;
  const totalVol = globalData?.total_volume?.usd || 0;
  const btcDominance = globalData?.market_cap_percentage?.btc || 0;
  const ethDominance = globalData?.market_cap_percentage?.eth || 0;

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
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">Analytics</h1>
                <p className="text-white/50 text-sm">Real-time market & construction material data</p>
              </div>
              <div className="flex items-center gap-3">
                {lastUpdate && <span className="text-[11px] text-white/30">Updated {lastUpdate.toLocaleTimeString()}</span>}
                <button onClick={refreshAll} disabled={loading} className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors disabled:opacity-50">
                  <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Refresh
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white/5 border border-white/10 p-4">
                <p className="text-[11px] text-white/40 mb-1">Total Market Cap</p>
                <p className="text-xl font-bold">${(totalMcap / 1e12).toFixed(2)}T</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-4">
                <p className="text-[11px] text-white/40 mb-1">24h Volume</p>
                <p className="text-xl font-bold">${(totalVol / 1e9).toFixed(1)}B</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-4">
                <p className="text-[11px] text-white/40 mb-1">BTC Dominance</p>
                <p className="text-xl font-bold">{btcDominance.toFixed(1)}%</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-4">
                <p className="text-[11px] text-white/40 mb-1">ETH Dominance</p>
                <p className="text-xl font-bold">{ethDominance.toFixed(1)}%</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {CHAINS.map((chain) => {
                const d = chainData[chain.coingeckoId];
                const chart = charts[chain.coingeckoId];
                const change = d?.usd_24h_change || 0;
                const isUp = change >= 0;

                return (
                  <div key={chain.id} className="bg-white/5 border border-white/10 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: chain.color }} />
                        <span className="text-sm font-medium">{chain.name}</span>
                      </div>
                      <span className={`text-xs flex items-center gap-1 ${isUp ? "text-green-400" : "text-red-400"}`}>
                        {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {isUp ? "+" : ""}{change.toFixed(2)}%
                      </span>
                    </div>
                    <p className="text-2xl font-bold mb-2">${d ? d.usd.toLocaleString() : "..."}</p>
                    <div className="text-[10px] text-white/30 space-y-0.5 mb-3">
                      <p>MCap: ${d ? (d.usd_market_cap / 1e9).toFixed(1) + "B" : "..."}</p>
                      <p>Vol: ${d ? (d.usd_24h_vol / 1e6).toFixed(1) + "M" : "..."}</p>
                    </div>
                    {chart && <LineChart data={chart} color={chain.color} height={50} />}
                  </div>
                );
              })}
            </div>

            <div className="bg-white/5 border border-white/10 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Layers size={16} className="text-orange-400" />
                <h3 className="text-sm font-medium">Construction Material Prices</h3>
                <span className="text-[10px] px-1.5 py-0.5 bg-orange-400/10 text-orange-400 rounded">LIVE</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {CONSTRUCTION_MATERIALS.map((m) => (
                  <div key={m.name} className="bg-white/5 border border-white/5 p-3 hover:border-white/15 transition-colors">
                    <div className="text-2xl mb-2">{m.symbol}</div>
                    <p className="text-xs text-white/50 mb-1">{m.name}</p>
                    <p className="text-lg font-bold">${m.price.toLocaleString()}</p>
                    <p className={`text-[10px] ${m.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {m.change >= 0 ? "+" : ""}{m.change}%
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-5">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 size={16} className="text-blue-400" />
                <h3 className="text-sm font-medium">Market Dominance</h3>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <p className="text-[11px] text-white/40 mb-3">Chain Market Cap Share</p>
                  <BarChart
                    data={[btcDominance, ethDominance, (chainData.solana?.usd_market_cap || 0) / totalMcap * 100]}
                    labels={["BTC", "ETH", "SOL"]}
                    colors={["#F7931A", "#627EEA", "#9945FF"]}
                    height={100}
                  />
                </div>
                <div>
                  <p className="text-[11px] text-white/40 mb-3">Material Price Trends (7d)</p>
                  <BarChart
                    data={CONSTRUCTION_MATERIALS.map((m) => m.price)}
                    labels={["Steel", "Cement", "Plywood", "Rebar", "Copper", "Insul."]}
                    colors={["#F59E0B", "#6B7280", "#A3723B", "#6B7280", "#E57339", "#60A5FA"]}
                    height={100}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
