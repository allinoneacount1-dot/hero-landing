import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Twitter, Menu, X, ArrowDownUp, RefreshCw, Settings, Zap, AlertTriangle, ChevronDown } from "lucide-react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, VersionedTransaction } from "@solana/web3.js";
import WalletConnector from "./components/WalletConnector";

const JUPITER_API = "https://quote-api.jup.ag/v6";
const TOKENS = [
  { symbol: "SOL", name: "Solana", mint: "So11111111111111111111111111111111111111112", decimals: 9, icon: "◎" },
  { symbol: "USDC", name: "USD Coin", mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", decimals: 6, icon: "$" },
  { symbol: "USDT", name: "Tether", mint: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", decimals: 6, icon: "₮" },
  { symbol: "JUP", name: "Jupiter", mint: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN", decimals: 6, icon: "🪐" },
  { symbol: "WIF", name: "dogwifhat", mint: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm", decimals: 6, icon: "🐕" },
  { symbol: "BONK", name: "Bonk", mint: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263", decimals: 5, icon: "🐕‍🦺" },
];

function TokenSelect({ selected, onSelect, otherToken }) {
  const [open, setOpen] = useState(false);
  const filtered = TOKENS.filter((t) => t.symbol !== otherToken?.symbol);
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 px-3 py-2 bg-white/10 border border-white/10 hover:bg-white/15 transition-colors">
        <span className="text-sm">{selected.icon}</span>
        <span className="text-sm font-medium">{selected.symbol}</span>
        <ChevronDown size={12} className="text-white/50" />
      </button>
      {open && (
        <div className="absolute top-full mt-1 left-0 z-50 bg-black/95 border border-white/10 w-48 max-h-60 overflow-y-auto">
          {filtered.map((token) => (
            <button key={token.symbol} onClick={() => { onSelect(token); setOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/10 transition-colors text-left">
              <span>{token.icon}</span>
              <div><p className="text-xs font-medium">{token.symbol}</p><p className="text-[10px] text-white/40">{token.name}</p></div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TokenSwap() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [fromToken, setFromToken] = useState(TOKENS[0]);
  const [toToken, setToToken] = useState(TOKENS[1]);
  const [amount, setAmount] = useState("");
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [swapping, setSwapping] = useState(false);
  const [slippage, setSlippage] = useState(0.5);
  const [fromBalance, setFromBalance] = useState(null);
  const [toBalance, setToBalance] = useState(null);
  const { publicKey, connected, signTransaction } = useWallet();
  const { connection } = useConnection();

  // Fetch balances
  useEffect(() => {
    if (!connected || !publicKey) { setFromBalance(null); setToBalance(null); return; }
    const getBalances = async () => {
      try {
        const bal = await connection.getBalance(publicKey);
        setFromBalance(bal / LAMPORTS_PER_SOL);
      } catch (e) { console.error(e); }
    };
    getBalances();
    const interval = setInterval(getBalances, 30000);
    return () => clearInterval(interval);
  }, [connected, publicKey, connection]);

  const fetchQuote = useCallback(async () => {
    if (!amount || parseFloat(amount) <= 0) { setQuote(null); return; }
    setLoading(true);
    try {
      const inputAmount = Math.floor(parseFloat(amount) * 10 ** fromToken.decimals);
      const res = await fetch(`${JUPITER_API}/quote?inputMint=${fromToken.mint}&outputMint=${toToken.mint}&amount=${inputAmount}&slippageBps=${slippage * 100}`);
      const data = await res.json();
      setQuote(data);
    } catch (e) {
      console.error("Jupiter quote error:", e);
      setQuote(null);
    }
    setLoading(false);
  }, [amount, fromToken, toToken, slippage]);

  useEffect(() => {
    const timer = setTimeout(fetchQuote, 500);
    return () => clearTimeout(timer);
  }, [fetchQuote]);

  const swapTokens = () => {
    const tempFrom = fromToken;
    setFromToken(toToken);
    setToToken(tempFrom);
    setAmount("");
    setQuote(null);
  };

  const handleSwap = async () => {
    if (!connected || !publicKey || !quote || !signTransaction) return;
    setSwapping(true);
    try {
      // Get swap transaction from Jupiter API
      const swapRes = await fetch(`${JUPITER_API}/swap`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quoteResponse: quote,
          userPublicKey: publicKey.toBase58(),
          wrapAndUnwrapSol: true,
          dynamicComputeUnitLimit: true,
          prioritizationFeeLamports: 100000,
        }),
      });
      const swapData = await swapRes.json();
      if (!swapData.swapTransaction) throw new Error("No swap transaction returned");

      // Deserialize, sign, and send
      const swapTxBuf = Buffer.from(swapData.swapTransaction, "base64");
      const tx = VersionedTransaction.deserialize(swapTxBuf);
      const signedTx = await signTransaction(tx);
      const txid = await connection.sendRawTransaction(signedTx.serialize());
      await connection.confirmTransaction(txid, "confirmed");
      alert(`Swap successful! Tx: ${txid.slice(0, 8)}...${txid.slice(-4)}`);
      setAmount("");
      setQuote(null);
    } catch (e) {
      console.error("Swap error:", e);
      alert(`Swap failed: ${e.message}`);
    }
    setSwapping(false);
  };

  const outputAmount = quote ? (parseInt(quote.outAmount) / 10 ** toToken.decimals).toFixed(6) : "0";
  const priceImpact = quote ? (quote.priceImpactPct || 0).toFixed(3) : "0";
  const routes = quote ? (quote.routePlan?.length || 0) : 0;
  const canSwap = connected && quote && !loading && !swapping;

  const getButtonText = () => {
    if (!connected) return "Connect Wallet to Swap";
    if (swapping) return "Swapping...";
    if (loading) return "Fetching Quote...";
    if (!amount) return "Enter Amount";
    if (!quote) return "No Route Found";
    return "Swap";
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

        <main className="flex-1 flex items-center justify-center px-4 py-6">
          <div className="w-full max-w-md space-y-4">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold">Token Swap</h1>
              <p className="text-white/50 text-sm">Powered by Jupiter Aggregator • Solana</p>
            </div>

            <div className="bg-white/5 border border-white/10 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-white/40">You Pay</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-white/30">
                    Balance: {fromBalance !== null && fromToken.symbol === "SOL" ? `${fromBalance.toFixed(4)} SOL` : fromToken.symbol === "SOL" ? "--" : `-- ${fromToken.symbol}`}
                  </span>
                  {fromBalance !== null && (
                    <button onClick={() => setAmount(fromToken.symbol === "SOL" ? fromBalance.toString().slice(0, 8) : "100")} className="text-[10px] px-1.5 py-0.5 bg-white/10 hover:bg-white/20 transition-colors">MAX</button>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <TokenSelect selected={fromToken} onSelect={setFromToken} otherToken={toToken} />
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="flex-1 bg-transparent text-right text-xl font-bold outline-none placeholder-white/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              </div>
            </div>

            <div className="flex justify-center -my-2 relative z-10">
              <button onClick={swapTokens} className="w-10 h-10 bg-white/10 border border-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"><ArrowDownUp size={16} /></button>
            </div>

            <div className="bg-white/5 border border-white/10 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-white/40">You Receive</span>
                <span className="text-[10px] text-white/30">Balance: -- {toToken.symbol}</span>
              </div>
              <div className="flex items-center gap-3">
                <TokenSelect selected={toToken} onSelect={setToToken} otherToken={fromToken} />
                <div className="flex-1 text-right text-xl font-bold">{loading ? <RefreshCw size={16} className="animate-spin inline" /> : outputAmount}</div>
              </div>
            </div>

            {quote && (
              <div className="bg-white/5 border border-white/10 p-3 space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-white/40">Price Impact</span><span className={parseFloat(priceImpact) > 1 ? "text-red-400" : "text-green-400"}>{priceImpact}%</span></div>
                <div className="flex justify-between"><span className="text-white/40">Routes</span><span>{routes} hop(s)</span></div>
                <div className="flex justify-between"><span className="text-white/40">Slippage</span><span>{slippage}%</span></div>
              </div>
            )}

            <div className="flex items-center justify-between text-xs">
              <span className="text-white/40">Slippage tolerance</span>
              <div className="flex gap-1">
                {[0.1, 0.5, 1].map((s) => (<button key={s} onClick={() => setSlippage(s)} className={`px-2 py-1 ${slippage === s ? "bg-white/20 text-white" : "bg-white/5 text-white/40 hover:bg-white/10"} transition-colors`}>{s}%</button>))}
              </div>
            </div>

            <button onClick={canSwap ? handleSwap : undefined} disabled={!canSwap} className="w-full py-3 bg-white text-black font-medium hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:bg-white/20 disabled:text-white/40 disabled:cursor-not-allowed">
              {getButtonText()}
            </button>

            <div className="flex items-center gap-2 text-[11px] text-white/30 justify-center">
              <Zap size={10} />
              <span>Best route via Jupiter • MEV protected</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
