import { useState, useRef, useEffect, useCallback } from "react";
import { Bot, Send, X, Sparkles } from "lucide-react";

const MAX_MSG_LEN = 500;
const RATE_LIMIT_MS = 2000;
const CG = "https://api.coingecko.com/api/v3";

function sanitizeInput(input) {
  let clean = input.trim().slice(0, MAX_MSG_LEN);
  clean = clean.replace(/[<>'"]/g, "");
  clean = clean.replace(/javascript:/gi, "");
  clean = clean.replace(/on\w+\s*=\s*/gi, "");
  return clean;
}

async function fetchLiveTokens() {
  try {
    const res = await fetch(`${CG}/simple/price?ids=solana,bitcoin,ethereum,usd-coin&vs_currencies=usd&include_24hr_change=true`);
    const data = await res.json();
    return data;
  } catch {
    return null;
  }
}

async function fetchGlobal() {
  try {
    const res = await fetch(`${CG}/global`);
    const data = await res.json();
    return data.data;
  } catch {
    return null;
  }
}

async function getResponse(input) {
  const lower = input.toLowerCase();

  if (lower.includes("price") || lower.includes("predict") || lower.includes("steel") || lower.includes("market")) {
    const global = await fetchGlobal();
    if (global) {
      const mcap = global.total_market_cap?.usd || 0;
      return `Global crypto market cap: $${(mcap / 1e12).toFixed(2)}T\n24h volume: $${(global.total_volume?.usd / 1e9).toFixed(1)}B\nBTC dominance: ${(global.market_cap_percentage?.btc || 0).toFixed(1)}%\nETH dominance: ${(global.market_cap_percentage?.eth || 0).toFixed(1)}%\n\nConstruction steel prices are market-sensitive. Current market conditions show ${global.market_cap_percentage?.btc > 50 ? "BTC dominance suggesting" : "altcoin season suggesting"} stable material procurement environment.`;
    }
    return "Based on current market data, steel prices are projected to stabilize. Check /analytics for live charts. Concrete and lumber remain steady.";
  }

  if (lower.includes("order") || lower.includes("status") || lower.includes("track")) {
    return "Your recent orders:\n\u2022 #4821 \u2014 Steel Beams \u00d7 200 (12.5 SOL) \u2014 Shipped\n\u2022 #4819 \u2014 Concrete Mix \u00d7 500 (1,200 USDC) \u2014 Delivered\n\u2022 #4815 \u2014 Plywood Sheets \u00d7 150 (4.2 SOL) \u2014 Delivered\n\nAll orders on track. Visit /supply-chain for real-time tracking.";
  }

  if (lower.includes("pay") || lower.includes("crypto") || lower.includes("gas") || lower.includes("fee")) {
    const tokens = await fetchLiveTokens();
    const solPrice = tokens?.solana?.usd || 0;
    const solFee = (0.000005 * solPrice).toFixed(4);
    return `We accept SOL, USDC, BTC (wrapped), and CTKN for payments.\nSolana network fee: ~$${solFee} per tx (${solPrice > 0 ? "based on current SOL price" : "minimal"}).\n\nBundle multiple orders to save on gas fees.`;
  }

  if (lower.includes("swap") || lower.includes("jupiter") || lower.includes("exchange")) {
    const tokens = await fetchLiveTokens();
    const solPrice = tokens?.solana?.usd || 0;
    return `Token Swap via Jupiter Aggregator (/swap):\n\u2022 SOL: $${solPrice.toFixed(2)}\n\u2022 USDC: $1.00 (stable)\n\u2022 Supported: SOL, USDC, USDT, JUP, WIF, BONK\n\u2022 Slippage options: 0.1%, 0.5%, 1%\n\u2022 Best route routing via Jupiter's API`;
  }

  if (lower.includes("stak") || lower.includes("apy") || lower.includes("yield") || lower.includes("farm")) {
    return "Staking Pools (/staking):\n\u2022 CTKN 30d: 12.5% APY (min 1,000 CTKN)\n\u2022 CTKN 90d: 18.2% APY (min 5,000 CTKN)\n\u2022 CTKN 180d: 24.8% APY (min 10,000 CTKN)\n\u2022 SOL 30d: 6.8% APY (min 1 SOL)\n\nTVL: ~$48.2K across all pools.";
  }

  if (lower.includes("token") || lower.includes("sol") || lower.includes("btc") || lower.includes("ctkn") || lower.includes("balance")) {
    const tokens = await fetchLiveTokens();
    if (tokens) {
    const sol = tokens.solana;
    const btc = tokens.bitcoin;
    const eth = tokens.ethereum;
    const ctknPrice = (sol?.usd * 0.00235 || 0.42).toFixed(4);
    return `Live token prices (CoinGecko):\n\u2022 SOL: $${sol?.usd?.toLocaleString() || "..."} (${sol?.usd_24h_change ? (sol.usd_24h_change >= 0 ? "+" : "") + sol.usd_24h_change.toFixed(2) + "%" : "..."})\n\u2022 BTC: $${btc?.usd?.toLocaleString() || "..."} (${btc?.usd_24h_change ? (btc.usd_24h_change >= 0 ? "+" : "") + btc.usd_24h_change.toFixed(2) + "%" : "..."})\n\u2022 ETH: $${eth?.usd?.toLocaleString() || "..."} (${eth?.usd_24h_change ? (eth.usd_24h_change >= 0 ? "+" : "") + eth.usd_24h_change.toFixed(2) + "%" : "..."})\n\u2022 USDC: $1.00 (stable)\n\u2022 CTKN: $${ctknPrice} (derived from SOL)`;
    }
    return "Token prices temporarily unavailable. Try again later or visit /prices.";
  }

  if (lower.includes("analytics") || lower.includes("chart") || lower.includes("data") || lower.includes("global")) {
    const global = await fetchGlobal();
    if (global) {
      return `Market Analytics (/analytics):\n\u2022 Total MCap: $${(global.total_market_cap?.usd / 1e12).toFixed(2)}T\n\u2022 24h Vol: $${(global.total_volume?.usd / 1e9).toFixed(1)}B\n\u2022 BTC Dom: ${(global.market_cap_percentage?.btc || 0).toFixed(1)}%\n\u2022 ETH Dom: ${(global.market_cap_percentage?.eth || 0).toFixed(1)}%\n\nCharts updated every 60s via CoinGecko API.`;
    }
    return "Visit /analytics for real-time market data. Charts updated every 60s via CoinGecko.";
  }

  if (lower.includes("nft") || lower.includes("certificate") || lower.includes("cert")) {
    return "NFT Certificates verify material authenticity on-chain. Each delivery gets a unique NFT with supplier info, quality grade, and tx hash. Check them at /certificates.";
  }

  if (lower.includes("supply") || lower.includes("ship") || lower.includes("delivery") || lower.includes("track")) {
    return "Track your shipments at /supply-chain. Each order has blockchain-verified milestones: order confirmed, picked up, in transit, delivered. Real-time status + QR code verification.";
  }

  if (lower.includes("governance") || lower.includes("vote") || lower.includes("proposal") || lower.includes("dao")) {
    return "Participate in DAO governance at /governance. Active proposals include supplier partnerships, fee changes, and protocol upgrades. Each CTKN = 1 vote. Quorum: 5% supply. Current: SteelWorks Corp partnership (PENDING) \u2014 voting ends in 3 days.";
  }

  if (lower.includes("marketplace") || lower.includes("buy") || lower.includes("shop") || lower.includes("material")) {
    return "Browse & buy construction materials with crypto at /marketplace. Steel beams, cement mix, rebar, plywood, copper wiring, insulation, and more. Payment: SOL, USDC, CTKN. Free shipping over $500.";
  }

  if (lower.includes("profile") || lower.includes("wallet") || lower.includes("account") || lower.includes("portfolio")) {
    return "View your wallet profile at /profile. Portfolio balance, recent activity (swaps, stakes, orders, votes), transaction history, and achievements. Connect your Solana wallet to see real balances.";
  }

  if (lower.includes("help") || lower.includes("what") || lower.includes("can")) {
    return "I'm your AI assistant for crypto-powered construction. I can help with:\n\u2022 Live token prices (CoinGecko)\n\u2022 Global market data\n\u2022 Order status & tracking\n\u2022 Crypto payments & fees\n\u2022 Token swapping (Jupiter)\n\u2022 Staking yields\n\u2022 NFT certificates\n\u2022 Supply chain tracking\n\u2022 Market analytics\n\u2022 Governance votes\n\u2022 Marketplace browsing\n\u2022 Wallet profile\n\nWhat would you like to know?";
  }

  return "I can help with token prices (real-time CoinGecko), order status, payments, swapping, staking, governance, marketplace, and more. Try asking about prices, tokens, swap, staking, or type 'help' for all options.";
}

export default function AiChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi! I'm your AI assistant. Ask me about prices, orders, payments, or tokens." },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const lastSentRef = useRef(0);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 100), 100);
    return () => clearTimeout(t);
  }, [cooldown]);

  const send = useCallback(async () => {
    const now = Date.now();
    const elapsed = now - lastSentRef.current;
    if (elapsed < RATE_LIMIT_MS) {
      setCooldown(RATE_LIMIT_MS - elapsed);
      return;
    }
    const trimmed = sanitizeInput(input);
    if (!trimmed) return;
    lastSentRef.current = now;
    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setInput("");
    setTyping(true);
    const reply = await getResponse(trimmed);
    setMessages((prev) => [...prev, { role: "bot", text: reply }]);
    setTyping(false);
  }, [input]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") send();
  };

  return (
    <>
      <button onClick={() => setOpen((p) => !p)} className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-transform shadow-lg" aria-label={open ? "Close chat" : "Open AI assistant"}>
        {open ? <X size={20} /> : <Bot size={20} />}
      </button>
      {open && (
        <div className="fixed bottom-20 right-6 z-50 w-[360px] max-w-[calc(100vw-3rem)] h-[480px] max-h-[calc(100vh-6rem)] bg-black/90 backdrop-blur-md border border-white/10 flex flex-col overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
            <div className="w-7 h-7 rounded-full bg-purple-500/20 flex items-center justify-center"><Sparkles size={14} className="text-purple-400" /></div>
            <div><p className="text-xs font-medium">AI Assistant</p><p className="text-[10px] text-white/40">Live data from CoinGecko</p></div>
            <div className="ml-auto flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /><span className="text-[10px] text-white/40">Online</span></div>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] px-3 py-2 text-xs leading-relaxed whitespace-pre-line ${msg.role === "user" ? "bg-white text-black rounded-lg rounded-br-sm" : "bg-white/10 text-white/80 rounded-lg rounded-bl-sm"}`}>{msg.text}</div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-white/10 text-white/80 rounded-lg rounded-bl-sm px-3 py-2 text-xs"><span className="animate-pulse">Thinking...</span></div>
              </div>
            )}
            <div ref={endRef} />
          </div>
          <div className="px-3 py-3 border-t border-white/10">
            <div className="flex items-center gap-2">
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Ask about prices, orders, tokens..." maxLength={MAX_MSG_LEN} disabled={typing} className="flex-1 bg-white/5 border border-white/10 px-3 py-2 text-xs text-white placeholder-white/30 outline-none focus:border-white/25 transition-colors disabled:opacity-50" />
              <button onClick={send} disabled={typing || !input.trim()} className="w-8 h-8 bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-transform disabled:bg-white/30 disabled:text-white/50" aria-label="Send"><Send size={14} /></button>
            </div>
            {cooldown > 0 && <p className="text-[10px] text-yellow-400 mt-1">Please wait {Math.ceil(cooldown / 1000)}s...</p>}
            <div className="flex gap-1.5 mt-2 overflow-x-auto">
              {["Price check", "Swap tokens", "Staking APY", "Governance", "Marketplace", "Profile"].map((q) => (
                <button key={q} onClick={() => { setInput(q); setTimeout(send, 50); }} className="text-[10px] px-2 py-1 bg-white/5 border border-white/10 text-white/50 hover:text-white/80 hover:border-white/20 transition-colors whitespace-nowrap">{q}</button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
