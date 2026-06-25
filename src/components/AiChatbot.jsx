import { useState, useRef, useEffect, useCallback } from "react";
import { Bot, Send, X, Sparkles } from "lucide-react";

const MAX_MSG_LEN = 500;
const RATE_LIMIT_MS = 2000;

function sanitizeInput(input) {
  let clean = input.trim().slice(0, MAX_MSG_LEN);
  clean = clean.replace(/[<>'"]/g, "");
  clean = clean.replace(/javascript:/gi, "");
  clean = clean.replace(/on\w+\s*=\s*/gi, "");
  return clean;
}

const responses = {
  price: "Based on current market data, steel prices are projected to drop 8% in the next 2 weeks. Concrete is stable. I recommend delaying your steel order for maximum savings.",
  order: "Your recent orders:\n\u2022 #4821 \u2014 Steel Beams \u00d7 200 (12.5 SOL) \u2014 Shipped\n\u2022 #4819 \u2014 Concrete Mix \u00d7 500 (1,200 USDC) \u2014 Delivered\n\u2022 #4815 \u2014 Plywood Sheets \u00d7 150 (4.2 SOL) \u2014 Delivered\n\nAll orders are on track. No issues detected.",
  pay: "We accept SOL, USDC, BTC (wrapped), and CTKN for payments. Solana network fees are minimal \u2014 typically under $0.01. Would you like to make a payment?",
  token: "Current token prices (via CoinGecko):\n\u2022 SOL: ~$178 (+3.2%)\n\u2022 USDC: $1.00 (stable)\n\u2022 BTC: ~$67,890 (+1.8%)\n\u2022 CTKN: $0.42 (+12.5%)\n\nCTKN shows strong momentum. Stake it for up to 24.8% APY!",
  swap: "You can swap tokens via the Token Swap page (/swap). We use Jupiter Aggregator for best rates \u2014 SOL, USDC, USDT, JUP, WIF, BONK supported. Slippage options: 0.1%, 0.5%, 1%.",
  staking: "Stake your CTKN tokens to earn yield:\n\u2022 30-day lock: 12.5% APY (min 1,000 CTKN)\n\u2022 90-day lock: 18.2% APY (min 5,000 CTKN)\n\u2022 180-day lock: 24.8% APY (min 10,000 CTKN)\n\nYou currently have 25,000 CTKN staked at 18.2% APY.",
  nft: "NFT Certificates verify material authenticity on-chain. Each delivery gets a unique NFT with supplier info, quality grade, and tx hash. Check them at /certificates.",
  supply: "Track your shipments at /supply-chain. Each order has blockchain-verified milestones \u2014 order confirmed, picked up, in transit, delivered. Real-time status + QR verification.",
  analytics: "Visit /analytics for real-time market data: total crypto market cap, BTC/ETH/SOL dominance, and construction material prices \u2014 all live via CoinGecko API.",
  governance: "Participate in DAO governance at /governance. Proposals include supplier partnerships, fee changes, and protocol upgrades. Each CTKN = 1 vote. Quorum requirement: 5% of circulating supply. Current proposal: SteelWorks Corp partnership (PENDING) \u2014 voting ends in 3 days.",
  marketplace: "Browse & buy construction materials with crypto at /marketplace. We offer steel beams, cement mix, rebar, plywood, copper wiring, insulation, and more. Payment options: SOL, USDC, CTKN. Free shipping on orders over $500.",
  profile: "View your wallet profile at /profile. See your portfolio balance, recent activity across swaps/stakes/orders/votes, transaction history, and achievements. Supports Solana wallet connection.",
  help: "I'm your AI assistant for crypto-powered construction. I can help with:\n\u2022 Token prices & predictions\n\u2022 Order status & tracking\n\u2022 Crypto payments\n\u2022 Token swapping (Jupiter)\n\u2022 Staking yields\n\u2022 NFT certificates\n\u2022 Supply chain tracking\n\u2022 Market analytics\n\u2022 Governance votes\n\u2022 Marketplace browsing\n\u2022 Wallet profile\n\nWhat would you like to know?",
  default: "I'm here to help with crypto payments, material orders, token swapping, staking, governance, marketplace, profile, and more. Try asking about prices, orders, swap, staking, nft, supply chain, analytics, governance, marketplace, or profile!",
};

function getResponse(input) {
  const lower = input.toLowerCase();
  if (lower.includes("price") || lower.includes("predict") || lower.includes("steel") || lower.includes("market")) return responses.price;
  if (lower.includes("order") || lower.includes("status") || lower.includes("track")) return responses.order;
  if (lower.includes("pay") || lower.includes("crypto") || lower.includes("gas") || lower.includes("fee")) return responses.pay;
  if (lower.includes("swap") || lower.includes("jupiter") || lower.includes("exchange")) return responses.swap;
  if (lower.includes("stak") || lower.includes("apy") || lower.includes("yield") || lower.includes("farm")) return responses.staking;
  if (lower.includes("nft") || lower.includes("certificate") || lower.includes("cert")) return responses.nft;
  if (lower.includes("supply") || lower.includes("ship") || lower.includes("delivery") || lower.includes("track")) return responses.supply;
  if (lower.includes("analytics") || lower.includes("chart") || lower.includes("data") || lower.includes("global")) return responses.analytics;
  if (lower.includes("token") || lower.includes("sol") || lower.includes("btc") || lower.includes("ctkn") || lower.includes("balance")) return responses.token;
  if (lower.includes("governance") || lower.includes("vote") || lower.includes("proposal") || lower.includes("dao")) return responses.governance;
  if (lower.includes("marketplace") || lower.includes("buy") || lower.includes("shop") || lower.includes("material")) return responses.marketplace;
  if (lower.includes("profile") || lower.includes("wallet") || lower.includes("account") || lower.includes("portfolio")) return responses.profile;
  if (lower.includes("help") || lower.includes("what") || lower.includes("can")) return responses.help;
  return responses.default;
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

  const send = useCallback(() => {
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

    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "bot", text: getResponse(trimmed) }]);
      setTyping(false);
    }, 800 + Math.random() * 600);
  }, [input]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") send();
  };

  return (
    <>
      <button
        onClick={() => setOpen((p) => !p)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-transform shadow-lg"
        aria-label={open ? "Close chat" : "Open AI assistant"}
      >
        {open ? <X size={20} /> : <Bot size={20} />}
      </button>

      {open && (
        <div className="fixed bottom-20 right-6 z-50 w-[360px] max-w-[calc(100vw-3rem)] h-[480px] max-h-[calc(100vh-6rem)] bg-black/90 backdrop-blur-md border border-white/10 flex flex-col overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
            <div className="w-7 h-7 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Sparkles size={14} className="text-purple-400" />
            </div>
            <div>
              <p className="text-xs font-medium">AI Assistant</p>
              <p className="text-[10px] text-white/40">Powered by ConstrAI</p>
            </div>
            <div className="ml-auto flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[10px] text-white/40">Online</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] px-3 py-2 text-xs leading-relaxed whitespace-pre-line ${
                  msg.role === "user"
                    ? "bg-white text-black rounded-lg rounded-br-sm"
                    : "bg-white/10 text-white/80 rounded-lg rounded-bl-sm"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-white/10 text-white/80 rounded-lg rounded-bl-sm px-3 py-2 text-xs">
                  <span className="animate-pulse">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="px-3 py-3 border-t border-white/10">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about prices, orders, tokens..."
                maxLength={MAX_MSG_LEN}
                disabled={typing}
                className="flex-1 bg-white/5 border border-white/10 px-3 py-2 text-xs text-white placeholder-white/30 outline-none focus:border-white/25 transition-colors disabled:opacity-50"
              />
              <button
                onClick={send}
                disabled={typing || !input.trim()}
                className="w-8 h-8 bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-transform disabled:bg-white/30 disabled:text-white/50"
                aria-label="Send"
              >
                <Send size={14} />
              </button>
            </div>
            {cooldown > 0 && (
              <p className="text-[10px] text-yellow-400 mt-1">Please wait {Math.ceil(cooldown / 1000)}s...</p>
            )}
            <div className="flex gap-1.5 mt-2 overflow-x-auto">
              {["Price check", "Swap tokens", "Staking APY", "Governance", "Marketplace", "Profile"].map((q) => (
                <button
                  key={q}
                  onClick={() => { setInput(q); setTimeout(send, 50); }}
                  className="text-[10px] px-2 py-1 bg-white/5 border border-white/10 text-white/50 hover:text-white/80 hover:border-white/20 transition-colors whitespace-nowrap"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
