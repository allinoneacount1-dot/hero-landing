import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Twitter, Menu, X, TrendingUp, TrendingDown, RefreshCw, Bot, Zap, AlertTriangle } from "lucide-react";
import WalletConnector from "./components/WalletConnector";

const COINGECKO_BASE = "https://api.coingecko.com/api/v3";
const DEXSCREENER_BASE = "https://api.dexscreener.com/latest";

const WATCHLIST = [
  { id: "solana", symbol: "SOL", name: "Solana", coingeckoId: "solana" },
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin", coingeckoId: "bitcoin" },
  { id: "usdc", symbol: "USDC", name: "USD Coin", coingeckoId: "usd-coin" },
  { id: "eth", symbol: "ETH", name: "Ethereum", coingeckoId: "ethereum" },
];

function MiniSparkline({ data, color }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const h = 40;
  const w = 120;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");

  return (
    <svg width={w} height={h} className="overflow-visible">
      <defs>
        <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon fill={`url(#grad-${color})`} points={`0,${h} ${points} ${w},${h}`} />
      <polyline fill="none" stroke={color} strokeWidth="1.5" points={points} />
    </svg>
  );
}

export default function PricePredictor() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [prices, setPrices] = useState({});
  const [charts, setCharts] = useState({});
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [dexData, setDexData] = useState([]);
  const [aiPredictions, setAiPredictions] = useState([]);

  const fetchPrices = useCallback(async () => {
    try {
      const ids = WATCHLIST.map((t) => t.coingeckoId).join(",");
      const res = await fetch(
        `${COINGECKO_BASE}/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true`
      );
      const data = await res.json();
      setPrices(data);
    } catch (e) {
      console.error("CoinGecko error:", e);
    }
  }, []);

  const fetchCharts = useCallback(async () => {
    try {
      const results = {};
      for (const token of WATCHLIST) {
        const res = await fetch(
          `${COINGECKO_BASE}/coins/${token.coingeckoId}/market_chart?vs_currency=usd&days=7&interval=daily`
        );
        const data = await res.json();
        results[token.coingeckoId] = data.prices?.map((p) => p[1]) || [];
      }
      setCharts(results);
    } catch (e) {
      console.error("Chart error:", e);
    }
  }, []);

  const fetchDexScreener = useCallback(async () => {
    try {
      const res = await fetch(`${DEXSCREENER_BASE}/dex/search?q=solana%20usdc`);
      const data = await res.json();
      setDexData((data.pairs || []).slice(0, 5));
    } catch (e) {
      console.error("DexScreener error:", e);
    }
  }, []);

  const generatePredictions = useCallback(() => {
    const preds = WATCHLIST.filter((t) => prices[t.coingeckoId]).map((token) => {
      const p = prices[token.coingeckoId];
      const chart = charts[token.coingeckoId] || [];
      const change = p.usd_24h_change || 0;

      // Linear regression on 7-day chart data
      let trend = "neutral";
      let confidence = 50;
      let predicted = p.usd;
      let reason = "Insufficient data for prediction";
      let signal = "WEAK";

      if (chart.length >= 4) {
        const n = chart.length;
        let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
        for (let i = 0; i < n; i++) {
          sumX += i;
          sumY += chart[i];
          sumXY += i * chart[i];
          sumX2 += i * i;
        }
        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;

        // Calculate R-squared for confidence
        const meanY = sumY / n;
        let ssRes = 0, ssTot = 0;
        for (let i = 0; i < n; i++) {
          ssRes += (chart[i] - (slope * i + intercept)) ** 2;
          ssTot += (chart[i] - meanY) ** 2;
        }
        const r2 = ssTot > 0 ? 1 - ssRes / ssTot : 0;
        confidence = Math.min(95, Math.max(50, Math.floor(r2 * 100)));

        // Volatility from standard deviation of returns
        const returns = [];
        for (let i = 1; i < n; i++) {
          returns.push((chart[i] - chart[i - 1]) / chart[i - 1]);
        }
        const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
        const variance = returns.reduce((a, b) => a + (b - avgReturn) ** 2, 0) / returns.length;
        const volatility = Math.sqrt(variance);

        trend = avgReturn > 0.005 ? "up" : avgReturn < -0.005 ? "down" : "neutral";

        // Predict next value (7 days out)
        predicted = Math.max(0, slope * (n + 6) + intercept);

        // Generate reason based on data
        if (trend === "up") {
          if (volatility > 0.03) reason = `Strong uptrend with ${(volatility * 100).toFixed(1)}% volatility. Momentum likely to continue.`;
          else reason = `Steady accumulation over 7d. Low volatility (${(volatility * 100).toFixed(1)}%) suggests sustainable move.`;
        } else if (trend === "down") {
          if (volatility > 0.03) reason = `Downtrend with elevated volatility (${(volatility * 100).toFixed(1)}%). Support level probable.`;
          else reason = `Gradual decline (${(volatility * 100).toFixed(1)}% volatility). Potential reversal zone approaching.`;
        } else {
          reason = `Consolidation (${(volatility * 100).toFixed(1)}% vol). Awaiting breakout catalyst.`;
        }

        // R-squared boost for strong fit
        if (r2 > 0.7) confidence += 10;
        signal = confidence > 80 ? "STRONG" : confidence > 65 ? "MODERATE" : "WEAK";
      }

      return {
        symbol: token.symbol,
        name: token.name,
        current: p.usd,
        change24h: change,
        marketCap: p.usd_market_cap,
        volume: p.usd_24h_vol,
        predicted,
        trend,
        confidence,
        signal,
        reason,
      };
    });
    setAiPredictions(preds);
  }, [prices, charts]);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchPrices(), fetchCharts(), fetchDexScreener()]);
    setLastUpdate(new Date());
    setLoading(false);
  }, [fetchPrices, fetchCharts, fetchDexScreener]);

  useEffect(() => {
    refreshAll();
    const interval = setInterval(refreshAll, 30000);
    return () => clearInterval(interval);
  }, [refreshAll]);

  useEffect(() => {
    if (Object.keys(prices).length > 0) generatePredictions();
  }, [prices, generatePredictions]);

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
                <h1 className="text-2xl font-bold">AI Price Predictor</h1>
                <p className="text-white/50 text-sm">Real-time market data + AI-powered predictions</p>
              </div>
              <div className="flex items-center gap-3">
                {lastUpdate && <span className="text-[11px] text-white/30">Updated {lastUpdate.toLocaleTimeString()}</span>}
                <button onClick={refreshAll} disabled={loading} className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors disabled:opacity-50">
                  <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Refresh
                </button>
              </div>
            </div>

            {loading ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((n) => (
                    <div key={n} className="bg-white/5 border border-white/10 p-4 animate-pulse">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="h-4 bg-white/10 w-10 mb-1 rounded" />
                          <div className="h-3 bg-white/10 w-16 rounded" />
                        </div>
                        <div className="h-4 bg-white/10 w-14 rounded" />
                      </div>
                      <div className="h-6 bg-white/10 w-24 mb-1 rounded" />
                      <div className="space-y-0.5">
                        <div className="h-3 bg-white/10 w-20 rounded" />
                        <div className="h-3 bg-white/10 w-24 rounded" />
                      </div>
                      <div className="h-10 bg-white/10 w-full mt-2 rounded" />
                    </div>
                  ))}
                </div>
                <div className="bg-white/5 border border-white/10 p-5 animate-pulse">
                  <div className="h-4 bg-white/10 w-28 mb-4 rounded" />
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {[1, 2].map((n) => (
                      <div key={n} className="bg-white/5 border border-white/5 p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="h-4 bg-white/10 w-24 mb-1 rounded" />
                            <div className="h-3 bg-white/10 w-16 rounded" />
                          </div>
                          <div className="h-5 bg-white/10 w-16 rounded" />
                        </div>
                        <div className="flex items-end justify-between mb-2">
                          <div>
                            <div className="h-3 bg-white/10 w-12 mb-1 rounded" />
                            <div className="h-6 bg-white/10 w-20 rounded" />
                          </div>
                          <div className="text-right">
                            <div className="h-3 bg-white/10 w-16 mb-1 rounded" />
                            <div className="h-6 bg-white/10 w-24 rounded" />
                          </div>
                        </div>
                        <div className="h-3 bg-white/10 w-full rounded" />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {WATCHLIST.map((token) => {
                    const p = prices[token.coingeckoId];
                    const chart = charts[token.coingeckoId];
                    const change = p?.usd_24h_change || 0;
                    const isUp = change >= 0;

                    return (
                      <div key={token.id} className="bg-white/5 border border-white/10 p-4 hover:border-white/20 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="text-sm font-medium">{token.symbol}</p>
                            <p className="text-[10px] text-white/40">{token.name}</p>
                          </div>
                          <span className={`text-xs flex items-center gap-1 ${isUp ? "text-green-400" : "text-red-400"}`}>
                            {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                            {isUp ? "+" : ""}{change.toFixed(2)}%
                          </span>
                        </div>
                        <p className="text-xl font-bold mb-1">{p ? `$${p.usd.toLocaleString()}` : "..."}</p>
                        {p && (
                          <div className="text-[10px] text-white/30 space-y-0.5">
                            <p>MCap: ${p.usd_market_cap ? (p.usd_market_cap / 1e9).toFixed(1) + "B" : "N/A"}</p>
                            <p>Vol 24h: ${p.usd_24h_vol ? (p.usd_24h_vol / 1e6).toFixed(1) + "M" : "N/A"}</p>
                          </div>
                        )}
                        <div className="mt-2 flex justify-center">
                          {chart && <MiniSparkline data={chart} color={isUp ? "#22c55e" : "#ef4444"} />}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-white/5 border border-white/10 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Bot size={16} className="text-purple-400" />
                    <h3 className="text-sm font-medium">AI Predictions</h3>
                    <span className="text-[10px] px-1.5 py-0.5 bg-purple-400/10 text-purple-400 rounded">LIVE</span>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {aiPredictions.map((pred) => (
                      <div key={pred.symbol} className="bg-white/5 border border-white/5 p-4 hover:border-white/10 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="text-sm font-medium">{pred.symbol} <span className="text-white/40 font-normal">prediction</span></p>
                            <p className="text-[11px] text-white/40">{pred.name}</p>
                          </div>
                          <span className={`text-[10px] px-2 py-0.5 rounded ${
                            pred.signal === "STRONG" ? "bg-green-400/10 text-green-400" :
                            pred.signal === "MODERATE" ? "bg-yellow-400/10 text-yellow-400" :
                            "bg-white/10 text-white/50"
                          }`}>{pred.signal}</span>
                        </div>
                        <div className="flex items-end justify-between mb-2">
                          <div>
                            <p className="text-[10px] text-white/40">Current</p>
                            <p className="text-lg font-bold">${pred.current.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] text-white/40">Predicted 7d</p>
                            <p className={`text-lg font-bold ${pred.trend === "up" ? "text-green-400" : pred.trend === "down" ? "text-red-400" : "text-white"}`}>
                              ${pred.predicted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-white/30">{pred.reason}</span>
                          <span className="text-white/40">{pred.confidence}% conf</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {dexData.length > 0 && (
                  <div className="bg-white/5 border border-white/10 p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <Zap size={16} className="text-yellow-400" />
                      <h3 className="text-sm font-medium">DexScreener — SOL/USDC Pairs</h3>
                    </div>
                    <div className="space-y-2">
                      {dexData.map((pair, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/[0.07] transition-colors text-xs">
                          <div>
                            <p className="font-medium">{pair.baseToken?.symbol}/{pair.quoteToken?.symbol}</p>
                            <p className="text-white/30 text-[10px]">{pair.dexId} · {pair.pairAddress?.slice(0, 8)}...</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${parseFloat(pair.priceUsd || 0).toFixed(4)}</p>
                            <p className={`text-[10px] ${(pair.priceChange?.h24 || 0) >= 0 ? "text-green-400" : "text-red-400"}`}>
                              {(pair.priceChange?.h24 || 0) >= 0 ? "+" : ""}{(pair.priceChange?.h24 || 0).toFixed(2)}%
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-white/5 border border-white/10 p-4">
                  <div className="flex items-center gap-2 text-[11px] text-white/40">
                    <AlertTriangle size={12} />
                    <span>AI predictions are algorithmic estimates, not financial advice. Data from CoinGecko & DexScreener APIs. DYOR.</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
