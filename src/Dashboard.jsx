import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Twitter,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  TrendingUp,
  TrendingDown,
  Zap,
  Shield,
  Bot,
  Coins,
  Clock,
  ExternalLink,
} from "lucide-react";
import WalletConnector from "./components/WalletConnector";
import AiChatbot from "./components/AiChatbot";

const tokens = [
  { symbol: "SOL", name: "Solana", balance: "42.18", usd: 178.5, change: +3.2, icon: "◎" },
  { symbol: "USDC", name: "USD Coin", balance: "12,450", usd: 1.0, change: 0.0, icon: "$" },
  { symbol: "BTC", name: "Bitcoin (Wrapped)", balance: "0.321", usd: 67890, change: +1.8, icon: "₿" },
  { symbol: "CTKN", name: "ConstrToken", balance: "85,000", usd: 0.42, change: +12.5, icon: "🔨" },
];

const transactions = [
  { type: "in", desc: "Material Payment — Steel Beams", amount: "+12.5 SOL", time: "2h ago", hash: "5Kj8...d4F2" },
  { type: "out", desc: "Concrete Mix Order #4821", amount: "-1,200 USDC", time: "5h ago", hash: "8Nm3...a7B1" },
  { type: "in", desc: "Loyalty Reward — CTKN", amount: "+5,000 CTKN", time: "1d ago", hash: "3Px9...c2E5" },
  { type: "out", desc: "Plywood Sheets Order #4819", amount: "-4.2 SOL", time: "2d ago", hash: "7Rt2...f8D4" },
  { type: "in", desc: "Refund — Overpayment", amount: "+350 USDC", time: "3d ago", hash: "2Wq5...b1A9" },
];

const aiInsights = [
  { type: "price", title: "Steel prices dropping", desc: "AI predicts 8% decrease in steel prices over the next 2 weeks. Consider delaying large orders.", confidence: 87 },
  { type: "alert", title: "Unusual network activity", desc: "Detected abnormal transaction pattern on your last 3 orders. Review recommended.", confidence: 92 },
  { type: "tip", title: "Optimize your order", desc: "Bundling your next 3 material orders could save you ~$2,400 in gas fees.", confidence: 78 },
];

const orderHistory = [
  { id: "#4821", items: "Steel Beams × 200", total: "12.5 SOL", status: "shipped", date: "Jun 24" },
  { id: "#4819", items: "Concrete Mix × 500", total: "1,200 USDC", status: "delivered", date: "Jun 22" },
  { id: "#4815", items: "Plywood Sheets × 150", total: "4.2 SOL", status: "delivered", date: "Jun 20" },
  { id: "#4810", items: "Rebar × 300", total: "8.8 SOL", status: "processing", date: "Jun 18" },
];

function MiniChart({ data, color }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const h = 32;
  const w = 64;
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`)
    .join(" ");

  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline fill="none" stroke={color} strokeWidth="1.5" points={points} />
    </svg>
  );
}

export default function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen w-full bg-black text-white overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source
          src="https://cdn.sceneai.art/Hero%20Section%20Video/a8132a81-b526-4f91-8095-003ce931ecdd.mp4"
          type="video/mp4"
        />
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
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors inline-flex items-center">
              <Twitter size={14} />
            </a>
            <WalletConnector />
          </div>

          <button className="md:hidden text-white" onClick={() => setMenuOpen((p) => !p)} aria-label={menuOpen ? "Close menu" : "Open menu"}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {menuOpen && (
          <div className="fixed inset-0 z-30 bg-black flex flex-col items-center justify-center gap-8 text-lg">
            <button className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white" onClick={() => setMenuOpen(false)} aria-label="Close menu">
              <X size={28} />
            </button>
            <div onClick={() => setMenuOpen(false)}>
              <WalletConnector />
            </div>
          </div>
        )}

        <main className="flex-1 px-4 sm:px-6 lg:px-12 py-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-white/50 text-sm">Crypto & AI Powered Construction Platform</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/40">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span>Solana Mainnet</span>
                <span className="mx-1">·</span>
                <span>Block #19,847,231</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {tokens.map((t) => (
                <div key={t.symbol} className="bg-white/5 border border-white/10 p-4 hover:border-white/20 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{t.icon}</span>
                      <div>
                        <p className="text-sm font-medium">{t.symbol}</p>
                        <p className="text-[11px] text-white/40">{t.name}</p>
                      </div>
                    </div>
                    <span className={`text-xs flex items-center gap-1 ${t.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {t.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {t.change >= 0 ? "+" : ""}{t.change}%
                    </span>
                  </div>
                  <p className="text-xl font-bold">{t.balance}</p>
                  <p className="text-xs text-white/40">${(parseFloat(t.balance.replace(",", "")) * t.usd).toLocaleString()}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 bg-white/5 border border-white/10 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Bot size={16} className="text-purple-400" />
                  <h3 className="text-sm font-medium">AI Insights</h3>
                  <span className="text-[10px] px-1.5 py-0.5 bg-purple-400/10 text-purple-400 rounded">LIVE</span>
                </div>
                <div className="space-y-3">
                  {aiInsights.map((insight, i) => (
                    <div key={i} className="bg-white/5 border border-white/5 p-4 hover:border-white/10 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {insight.type === "price" && <TrendingUp size={14} className="text-green-400" />}
                          {insight.type === "alert" && <Shield size={14} className="text-yellow-400" />}
                          {insight.type === "tip" && <Zap size={14} className="text-blue-400" />}
                          <span className="text-sm font-medium">{insight.title}</span>
                        </div>
                        <span className="text-[10px] text-white/30">{insight.confidence}% conf</span>
                      </div>
                      <p className="text-xs text-white/60 leading-relaxed">{insight.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Coins size={16} className="text-yellow-400" />
                  <h3 className="text-sm font-medium">Token Prices</h3>
                </div>
                <div className="space-y-4">
                  {tokens.map((t) => (
                    <div key={t.symbol} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{t.icon}</span>
                        <span className="text-xs font-medium">{t.symbol}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MiniChart
                          data={[t.usd * 0.95, t.usd * 0.98, t.usd * 0.92, t.usd * 1.01, t.usd * 0.97, t.usd]}
                          color={t.change >= 0 ? "#22c55e" : "#ef4444"}
                        />
                        <span className="text-xs font-medium w-20 text-right">${t.usd.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-white/50" />
                    <h3 className="text-sm font-medium">Recent Transactions</h3>
                  </div>
                  <button className="text-[11px] text-white/40 hover:text-white/70 transition-colors inline-flex items-center gap-1">
                    View All <ExternalLink size={10} />
                  </button>
                </div>
                <div className="space-y-3">
                  {transactions.map((tx, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/[0.07] transition-colors">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.type === "in" ? "bg-green-400/10" : "bg-red-400/10"}`}>
                        {tx.type === "in" ? <ArrowDownLeft size={14} className="text-green-400" /> : <ArrowUpRight size={14} className="text-red-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{tx.desc}</p>
                        <p className="text-[11px] text-white/30">{tx.time} · {tx.hash}</p>
                      </div>
                      <span className={`text-xs font-medium ${tx.type === "in" ? "text-green-400" : "text-red-400"}`}>
                        {tx.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Wallet size={16} className="text-white/50" />
                    <h3 className="text-sm font-medium">Order History</h3>
                  </div>
                  <button className="text-[11px] text-white/40 hover:text-white/70 transition-colors inline-flex items-center gap-1">
                    View All <ExternalLink size={10} />
                  </button>
                </div>
                <div className="space-y-3">
                  {orderHistory.map((order, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/[0.07] transition-colors">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10">
                        <span className="text-[10px] font-medium text-white/60">{order.id}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{order.items}</p>
                        <p className="text-[11px] text-white/30">{order.date} · {order.total}</p>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded ${
                        order.status === "shipped" ? "bg-yellow-400/10 text-yellow-400" :
                        order.status === "delivered" ? "bg-green-400/10 text-green-400" :
                        "bg-blue-400/10 text-blue-400"
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Zap size={16} className="text-blue-400" />
                <h3 className="text-sm font-medium">Quick Actions</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Pay with Crypto", icon: Coins, color: "text-yellow-400" },
                  { label: "AI Price Check", icon: Bot, color: "text-purple-400" },
                  { label: "New Order", icon: ArrowUpRight, color: "text-green-400" },
                  { label: "View Reports", icon: TrendingUp, color: "text-blue-400" },
                ].map((action) => {
                  const Icon = action.icon;
                  return (
                    <button key={action.label} className="flex flex-col items-center gap-2 p-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 transition-all">
                      <Icon size={20} className={action.color} />
                      <span className="text-xs text-white/60">{action.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </main>
      </div>

      <AiChatbot />
    </div>
  );
}
