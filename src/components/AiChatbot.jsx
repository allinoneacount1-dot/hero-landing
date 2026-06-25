import { useState, useRef, useEffect } from "react";
import { Bot, Send, X, Sparkles } from "lucide-react";

const responses = {
  "price": "Based on current market data, steel prices are projected to drop 8% in the next 2 weeks. Concrete is stable. I recommend delaying your steel order for maximum savings.",
  "order": "Your recent orders:\n• #4821 — Steel Beams × 200 (2.5 ETH) — Shipped\n• #4819 — Concrete Mix × 500 (1,200 USDC) — Delivered\n• #4815 — Plywood Sheets × 150 (0.8 ETH) — Delivered\n\nAll orders are on track. No issues detected.",
  "pay": "We accept ETH, USDC, WBTC, and CTKN for payments. Gas fees are optimized on our platform — typical transaction costs under $5. Would you like to make a payment?",
  "token": "Current token prices:\n• ETH: $3,842.50 (+2.4%)\n• USDC: $1.00 (stable)\n• WBTC: $67,890 (+1.8%)\n• CTKN: $0.42 (+12.5%)\n\nCTKN shows strong momentum. Consider using it for payments to earn bonus rewards.",
  "help": "I'm your AI assistant for crypto-powered construction materials. I can help with:\n• Material price predictions\n• Order status & tracking\n• Crypto payment guidance\n• Token portfolio info\n• Platform navigation\n\nWhat would you like to know?",
  "default": "I'm here to help with crypto payments, material orders, and price predictions. Try asking about prices, orders, payments, or tokens!",
};

function getResponse(input) {
  const lower = input.toLowerCase();
  if (lower.includes("price") || lower.includes("predict") || lower.includes("steel") || lower.includes("market")) return responses.price;
  if (lower.includes("order") || lower.includes("status") || lower.includes("track")) return responses.order;
  if (lower.includes("pay") || lower.includes("crypto") || lower.includes("gas") || lower.includes("fee")) return responses.pay;
  if (lower.includes("token") || lower.includes("eth") || lower.includes("btc") || lower.includes("ctkn") || lower.includes("balance")) return responses.token;
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
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "bot", text: getResponse(trimmed) }]);
      setTyping(false);
    }, 800 + Math.random() * 600);
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
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask about prices, orders, tokens..."
                className="flex-1 bg-white/5 border border-white/10 px-3 py-2 text-xs text-white placeholder-white/30 outline-none focus:border-white/25 transition-colors"
              />
              <button
                onClick={send}
                className="w-8 h-8 bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                aria-label="Send"
              >
                <Send size={14} />
              </button>
            </div>
            <div className="flex gap-1.5 mt-2 overflow-x-auto">
              {["Price check", "My orders", "Pay with crypto", "Token prices"].map((q) => (
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
