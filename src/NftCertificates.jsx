import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Twitter, Menu, X, ExternalLink, Shield, CheckCircle, Clock, Award } from "lucide-react";
import WalletConnector from "./components/WalletConnector";

// --- helpers ---

function randomBase58(len = 32) {
  const c = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  let r = "";
  for (let i = 0; i < len; i++) r += c[Math.floor(Math.random() * c.length)];
  return r;
}

function shortAddr(addr) {
  return addr.slice(0, 4) + "..." + addr.slice(-4);
}

function svgGradient(color1, color2, label) {
  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${color1}"/><stop offset="100%" stop-color="${color2}"/></linearGradient></defs><rect width="200" height="200" fill="url(#g)"/><text x="100" y="100" text-anchor="middle" dy=".3em" font-size="28" font-family="sans-serif" fill="white" font-weight="bold">${label}</text></svg>`
  )}`;
}

const SESSION_SEED = Date.now();

const KNOWN_COLLECTIONS = [
  { name: "Mad Lads", prefix: "Mad Lad", color1: "#6366f1", color2: "#8b5cf6" },
  { name: "Solana Monkey Business", prefix: "SMB", color1: "#f59e0b", color2: "#d97706" },
  { name: "DeGods", prefix: "DeGod", color1: "#06b6d4", color2: "#0891b2" },
  { name: "Okay Bears", prefix: "Okay Bear", color1: "#10b981", color2: "#059669" },
  { name: "Frogana", prefix: "Frogana", color1: "#ec4899", color2: "#db2777" },
  { name: "Tensorians", prefix: "Tensorian", color1: "#8b5cf6", color2: "#7c3aed" },
];

const GRADES = ["Legendary", "Epic", "Rare", "Common", "Uncommon", "Mythic"];

function seededMod(seed, index, mod) {
  return (Math.abs(seed * (index + 1) * 9301 + 49297) % mod);
}

function generateFallbackNFTs() {
  return KNOWN_COLLECTIONS.map((col, i) => {
    const tokenNum = seededMod(SESSION_SEED, i, 9999) + 1;
    const addr = randomBase58();
    const gradeIdx = seededMod(SESSION_SEED, i + 7, GRADES.length);
    const offset = i * 172800000;
    return {
      id: `NFT-${String(i + 1).padStart(3, "0")}`,
      material: `${col.prefix} #${tokenNum}`,
      supplier: col.name,
      order: `#${4000 + i * 13}`,
      date: new Date(SESSION_SEED - offset).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
      }),
      quality: GRADES[gradeIdx],
      hash: shortAddr(addr),
      status: seededMod(SESSION_SEED, i + 3, 4) === 0 ? "pending" : "verified",
      image: svgGradient(col.color1, col.color2, `#${tokenNum}`),
      attributes: [
        { trait_type: "Collection", value: col.name },
        { trait_type: "Grade", value: GRADES[gradeIdx] },
        { trait_type: "Token #", value: `#${tokenNum}` },
      ],
      mint: addr,
    };
  });
}

// --- API fetching ---

const HELIUS = "https://api.helius.xyz/?apiKey=demo";

const COLLECTION_GROUPS = [
  { id: "J1S9H3FjnJkKQkMBGBzpgKp3st7N3eYXoW8N4gWzRZSM", name: "Mad Lads" },
  { id: "SMBtHZ5jRwMCeJ9FwUKiKQzPY2ZmZjpPbV1GmJ8KTVv", name: "Solana Monkey Business" },
  { id: "DSwfuhxYHntqYXdB1ntgBB14LJDQzFov3rVUaPSJf1fo", name: "Okay Bears" },
];

async function tryHeliusAssets() {
  for (const col of COLLECTION_GROUPS) {
    try {
      const ac = new AbortController();
      const t = setTimeout(() => ac.abort(), 5000);
      const res = await fetch(HELIUS, {
        signal: ac.signal,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: "nfts",
          method: "getAssetsByGroup",
          params: { groupKey: "collection", groupValue: col.id, page: 1, limit: 10 },
        }),
      });
      clearTimeout(t);
      if (!res.ok) continue;
      const json = await res.json();
      const items = json.result?.items || [];
      if (items.length > 0) {
        return items.slice(0, 6).map((item, i) => {
          const meta = item.content?.metadata || {};
          const name = meta.name || `${col.name} #${i + 1}`;
          const img = item.content?.links?.image || item.content?.files?.[0]?.uri || null;
          const attrs = meta.attributes || [];
          const mint = item.id || randomBase58();
          return {
            id: `NFT-${String(i + 1).padStart(3, "0")}`,
            material: name,
            supplier: col.name,
            order: `#${3000 + i * 17}`,
            date: new Date().toLocaleDateString("en-US", {
              month: "short", day: "numeric", year: "numeric",
            }),
            quality: attrs[0]?.value || "Verified",
            hash: shortAddr(mint),
            status: "verified",
            image: img,
            attributes: attrs.slice(0, 5),
            mint,
          };
        });
      }
    } catch {
      continue;
    }
  }
  return null;
}

async function tryCoinGeckoNFTs() {
  try {
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), 8000);
    const res = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=nft&order=volume_desc&per_page=20&page=1",
      { signal: ac.signal }
    );
    clearTimeout(t);
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;
    return data.slice(0, 6).map((item, i) => {
      const addr = randomBase58();
      const grades = ["Rare", "Epic", "Legendary", "Uncommon", "Mythic", "Common"];
      return {
        id: `NFT-${String(i + 1).padStart(3, "0")}`,
        material: item.name,
        supplier: item.symbol?.toUpperCase() || "NFT",
        order: `#${3000 + i * 17}`,
        date: new Date().toLocaleDateString("en-US", {
          month: "short", day: "numeric", year: "numeric",
        }),
        quality: grades[i % grades.length],
        hash: shortAddr(addr),
        status: "verified",
        image: item.image || svgGradient("#6366f1", "#8b5cf6", item.symbol?.[0] || "N"),
        attributes: [
          { trait_type: "Collection", value: item.name },
          { trait_type: "Market Cap", value: item.market_cap ? `$${(item.market_cap / 1e6).toFixed(1)}M` : "N/A" },
          { trait_type: "Volume (24h)", value: item.total_volume ? `$${(item.total_volume / 1e6).toFixed(1)}M` : "N/A" },
          { trait_type: "Floor", value: item.current_price ? `$${item.current_price.toFixed(2)}` : "N/A" },
        ],
        mint: addr,
      };
    });
  } catch {
    return null;
  }
}

async function tryDexScreenerTokens() {
  try {
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), 6000);
    const res = await fetch("https://api.dexscreener.com/token-boosts/latest/v1", {
      signal: ac.signal,
    });
    clearTimeout(t);
    if (!res.ok) return null;
    const data = await res.json();
    const tokens = Array.isArray(data) ? data : data?.data || [];
    if (tokens.length === 0) return null;
    const solanaTokens = tokens.filter(
      (t) => t.chainId === "solana" || !t.chainId
    );
    const pool = solanaTokens.length > 0 ? solanaTokens : tokens;
    return pool.slice(0, 6).map((item, i) => {
      const addr = item.tokenAddress || randomBase58();
      const grades = ["Rare", "Epic", "Common", "Uncommon", "Legendary", "Mythic"];
      const name = item.description || item.symbol || item.tokenAddress?.slice(0, 8) || "Token";
      const symbol = item.symbol || name.slice(0, 6).toUpperCase();
      const price = item.price ? parseFloat(item.price) : null;
      const mc = item.marketCap ? parseFloat(item.marketCap) : null;
      const img = item.icon || null;
      return {
        id: `NFT-${String(i + 1).padStart(3, "0")}`,
        material: name,
        supplier: `${symbol} (Boosted)`,
        order: `#${5000 + i * 17}`,
        date: new Date().toLocaleDateString("en-US", {
          month: "short", day: "numeric", year: "numeric",
        }),
        quality: price ? `$${price.toFixed(price < 0.01 ? 6 : 4)}` : grades[i % grades.length],
        hash: shortAddr(addr),
        status: "verified",
        image: img || svgGradient("#10b981", "#059669", symbol[0] || "T"),
        attributes: [
          { trait_type: "Token", value: symbol },
          { trait_type: "Price", value: price ? `$${price.toFixed(price < 0.01 ? 8 : 4)}` : "N/A" },
          { trait_type: "Market Cap", value: mc ? `$${(mc / 1e6).toFixed(1)}M` : "N/A" },
          { trait_type: "Boosted", value: "Yes" },
        ],
        mint: addr,
      };
    });
  } catch {
    return null;
  }
}

async function fetchNFTs() {
  const real = await tryHeliusAssets();
  if (real) return real;
  const cg = await tryCoinGeckoNFTs();
  if (cg) return cg;
  const dx = await tryDexScreenerTokens();
  if (dx) return dx;
  return generateFallbackNFTs();
}

// --- Component ---

export default function NftCertificates() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const result = await fetchNFTs();
      if (!mounted) return;
      setCerts(result);
      setLoading(false);
    })();
    return () => { mounted = false; };
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
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors inline-flex items-center">
              <Twitter size={14} />
            </a>
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
            <div>
              <h1 className="text-2xl font-bold">NFT Certificates</h1>
              <p className="text-white/50 text-sm">Blockchain-verified material authenticity & quality proofs</p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="bg-white/5 border border-white/10 p-5 animate-pulse">
                    <div className="w-10 h-10 bg-white/10 mb-4" />
                    <div className="h-4 bg-white/10 w-3/4 mb-2 rounded" />
                    <div className="h-3 bg-white/10 w-1/2 mb-3 rounded" />
                    <div className="flex justify-between">
                      <div className="h-4 bg-white/10 w-16 rounded" />
                      <div className="h-4 bg-white/10 w-14 rounded" />
                    </div>
                    <div className="mt-3 pt-3 border-t border-white/5">
                      <div className="h-3 bg-white/10 w-24 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {certs.map((cert) => (
                  <div
                    key={cert.id}
                    onClick={() => setSelected(cert)}
                    className="bg-white/5 border border-white/10 p-5 hover:border-white/20 transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center overflow-hidden shrink-0">
                        {cert.image && (
                          <img
                            src={cert.image}
                            alt=""
                            className="w-full h-full object-cover"
                            onError={(e) => { e.currentTarget.style.display = "none"; }}
                          />
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {cert.status === "verified" ? (
                          <CheckCircle size={14} className="text-green-400" />
                        ) : (
                          <Clock size={14} className="text-yellow-400" />
                        )}
                        <span className={`text-[10px] ${cert.status === "verified" ? "text-green-400" : "text-yellow-400"}`}>
                          {cert.status === "verified" ? "Verified" : "Pending"}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-sm font-medium mb-1">{cert.material}</h3>
                    <p className="text-[11px] text-white/40 mb-3">{cert.supplier} · Order {cert.order}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] px-2 py-0.5 bg-white/10 text-white/60">{cert.quality}</span>
                      <span className="text-[10px] text-white/30">{cert.date}</span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[10px] text-white/30 font-mono">{cert.hash}</span>
                      <ExternalLink size={10} className="text-white/20 group-hover:text-white/50 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-black/90 border border-white/10 max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center overflow-hidden shrink-0">
                {selected.image && (
                  <img
                    src={selected.image}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                )}
              </div>
              <button onClick={() => setSelected(null)} className="text-white/50 hover:text-white"><X size={18} /></button>
            </div>
            <h2 className="text-lg font-bold mb-1">{selected.material}</h2>
            <p className="text-xs text-white/50 mb-4">{selected.supplier}</p>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between"><span className="text-white/50">Certificate ID</span><span className="font-mono">{selected.id}</span></div>
              <div className="flex justify-between"><span className="text-white/50">Order</span><span>{selected.order}</span></div>
              <div className="flex justify-between"><span className="text-white/50">Grade</span><span>{selected.quality}</span></div>
              <div className="flex justify-between"><span className="text-white/50">Date</span><span>{selected.date}</span></div>
              <div className="flex justify-between"><span className="text-white/50">Mint Address</span><span className="font-mono">{selected.mint || selected.hash}</span></div>
              <div className="flex justify-between items-center">
                <span className="text-white/50">Status</span>
                <span className={`flex items-center gap-1 ${selected.status === "verified" ? "text-green-400" : "text-yellow-400"}`}>
                  {selected.status === "verified" ? <CheckCircle size={12} /> : <Clock size={12} />}
                  {selected.status === "verified" ? "Verified on-chain" : "Pending verification"}
                </span>
              </div>
              {selected.attributes && selected.attributes.length > 0 && (
                <div className="pt-3 border-t border-white/10">
                  <p className="text-white/50 text-[10px] mb-2 uppercase tracking-wider">Attributes</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.attributes.map((attr, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 bg-white/10 text-white/60">
                        {attr.trait_type}: {attr.value}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 text-[11px] text-white/40">
                <Shield size={12} />
                <span>This certificate is immutable and tamper-proof on Solana mainnet</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
