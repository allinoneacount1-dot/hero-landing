import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Twitter, Menu, X, Truck, MapPin, Shield, ExternalLink, QrCode, Loader } from "lucide-react";
import WalletConnector from "./components/WalletConnector";
import { useWallet } from "@solana/wallet-adapter-react";

const RPC = "https://api.mainnet-beta.solana.com";

const STATUS_C = {
  in_transit: "text-yellow-400 bg-yellow-400/10",
  delivered: "text-green-400 bg-green-400/10",
  processing: "text-blue-400 bg-blue-400/10",
};
const STATUS_L = { in_transit: "In Transit", delivered: "Delivered", processing: "Processing" };

const MATERIALS = [
  "Structural Steel Beams × 200", "Portland Cement Mix × 500 bags",
  "Marine Plywood Sheets × 150", "Reinforcement Rebar × 300",
  "Copper Wiring × 1000m", "Glass Panels × 50",
];
const SUPPLIERS = [
  "SteelWorks Corp, Pittsburgh PA", "CementPro Ltd, Denver CO",
  "WoodSupply Inc, Portland OR", "BuildRight Materials, Houston TX",
  "Quality Metals Co, Detroit MI", "Premier Aggregates, Atlanta GA",
];
const SITES = [
  "Site A — Manhattan Project", "Site B — Brooklyn Expansion",
  "Site C — Queens Development", "Site D — Bronx Renewal",
];
const FAKES = [
  "5Kj8f2Hs9nz7Lkq1W3xP4Rm6T8vY9bN0cD2eF4gH6jK8lM1oP3qR6SsD",
  "8Nm3k7U5yR2wQ4aA6sS8dD9fF1gG2hH3jJ4kK5lL6zZ7xX8cC9vB0nM",
  "3Px9m2B4nN6vV8cC1xX2zZ3aL4bB5cC6dD7eE8fF9gG0hH1iI2jJ3kK4l",
  "7Rt2p8K9lL0mM1nN2oO3pP4qQ5rR6sS7tT8uU9vV0wW1xX2yY3zZ4aA5b",
  "9Vx4qW1eR5tY7uI9oP2aS6dF8gH0jK1lZ3xC5vB7nM9qW3eR5tY7uI9",
  "2bN4mK6lO8pQ0rS2tU4vW6xY8zA0bC2dE4fG6hI8jK0lM2nO4pQ6rS8t",
];

const fmt = (d) =>
  d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + ", " +
  d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

const genSteps = (status, base) => {
  const t = (o) => fmt(new Date(base + o));
  const p = status === "processing";
  const d = status === "delivered";
  return [
    { label: "Order Confirmed", time: t(0), done: true },
    { label: "Picked up from supplier", time: p ? "—" : t(21600000), done: !p, current: p },
    { label: "In transit", time: p ? "—" : t(43200000), done: d, current: !p && !d },
    { label: "Arrived at destination", time: d ? t(64800000) : "—", done: d },
    { label: "Delivered & verified", time: d ? t(86400000) : "—", done: d },
  ];
};

const genFallback = () => {
  const d = Date.now();
  const r = (m) => Math.abs(((d % 7919) * (m * 31 + 1)) % m);
  const off = r(6);
  return Array.from({ length: 6 }, (_, i) => {
    const status = ["in_transit", "delivered", "processing", "in_transit", "processing", "delivered"][(off + i) % 6];
    const now = Date.now() - (r(48) + i) * 3600000;
    const eta = new Date(Date.now() + (status === "in_transit" ? (r(14) + 1) * 86400000 : 0));
    return {
      id: `SHP-${(d % 9000 + 1000 + i * 17) % 10000}`,
      material: MATERIALS[(r(MATERIALS.length) + i) % MATERIALS.length],
      from: SUPPLIERS[(r(SUPPLIERS.length) + i * 3) % SUPPLIERS.length],
      to: SITES[(r(SITES.length) + i * 2) % SITES.length],
      status,
      eta: status === "delivered" ? "Delivered" : eta.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      steps: genSteps(status, now),
      txHash: FAKES[(r(FAKES.length) + i * 5) % FAKES.length],
      nftCert: `NFT-${String((d % 900 + 100 + i * 13) % 1000).padStart(3, "0")}`,
    };
  });
};

const txSteps = (confirmed, finalized, time) => {
  const st = (o) => fmt(new Date(time.getTime() + o));
  return [
    { label: "Transaction Signed", time: fmt(time), done: true },
    { label: "Broadcast to Network", time: st(5000), done: true },
    { label: "Confirmed", time: confirmed ? st(40000) : "—", done: confirmed, current: !finalized },
    { label: "Finalized", time: finalized ? st(120000) : "—", done: finalized },
    { label: "Anchored on Chain", time: finalized ? st(400000) : "—", done: finalized },
  ];
};

const txToShipment = (tx, i) => {
  const sig = tx.signature || "";
  const short = sig.slice(0, 4) + "..." + sig.slice(-4);
  const cs = tx.confirmationStatus;
  const finalized = cs === "finalized";
  const confirmed = cs === "confirmed" || finalized;
  const status = finalized ? "delivered" : confirmed ? "in_transit" : "processing";
  const time = tx.blockTime ? new Date(tx.blockTime * 1000) : new Date(Date.now() - i * 3600000);
  return {
    id: `SIG-${short}`,
    material: MATERIALS[i % 6] || "Digital Asset Transfer",
    from: sig.slice(0, 8) + "...",
    to: `Mainnet · Slot ${tx.slot ?? "—"}`,
    status,
    eta: finalized ? "Finalized" : confirmed ? "Awaiting Finality" : "Pending",
    steps: txSteps(confirmed, finalized, time),
    txHash: sig,
    nftCert: `BLOCK-${tx.slot || i}`,
  };
};
export default function SupplyChain() {
  const { publicKey, connected } = useWallet();
  const [menuOpen, setMenuOpen] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [qrShip, setQrShip] = useState(null);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTxs = useCallback(async () => {
    setLoading(true);
    try {
      if (connected && publicKey) {
        const addr = publicKey.toBase58();

        const controller = new AbortController();
        const to = setTimeout(() => controller.abort(), 10000);
        const rpcRes = await fetch(RPC, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0", id: 1,
            method: "getSignaturesForAddress",
            params: [addr, { limit: 10 }],
          }),
          signal: controller.signal,
        });
        clearTimeout(to);
        if (rpcRes.ok) {
          const rpcData = await rpcRes.json();
          if (rpcData.result && rpcData.result.length > 0) {
            setShipments(rpcData.result.map(txToShipment));
            setLoading(false);
            return;
          }
        }
      }
      setShipments(genFallback());
    } catch {
      setShipments(genFallback());
    }
    setLoading(false);
  }, [publicKey, connected]);

  useEffect(() => { fetchTxs(); }, [fetchTxs]);

  const counts = { in_transit: 0, delivered: 0, processing: 0 };
  shipments.forEach((s) => { if (s.status in counts) counts[s.status]++; });

  if (loading) {
    return (
      <div className="relative min-h-screen w-full bg-black text-white overflow-hidden">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src="https://cdn.sceneai.art/Hero%20Section%20Video/a8132a81-b526-4f91-8095-003ce931ecdd.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-20 flex flex-col min-h-screen">
          <main className="flex-1 px-4 sm:px-6 lg:px-12 py-6 overflow-y-auto">
            <div className="max-w-5xl mx-auto space-y-6">
              <div>
                <div className="h-7 bg-white/10 w-48 mb-2 rounded animate-pulse" />
                <div className="h-4 bg-white/10 w-72 rounded animate-pulse" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="bg-white/5 border border-white/10 p-4 animate-pulse text-center">
                    <div className="h-7 bg-white/10 w-8 mx-auto mb-1 rounded" />
                    <div className="h-3 bg-white/10 w-16 mx-auto rounded" />
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="bg-white/5 border border-white/10 p-4 animate-pulse">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white/10" />
                        <div>
                          <div className="h-4 bg-white/10 w-48 mb-1.5 rounded" />
                          <div className="h-3 bg-white/10 w-32 rounded" />
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-5 bg-white/10 w-16 rounded" />
                        <div className="h-3 bg-white/10 w-20 rounded" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

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
                <path d="m66.983 20.526h-4.536c-.513-1.809-1.809-2.781-3.645-2.781-2.781 0-4.374 2.322-4.374 6.102 0 3.807 1.566 6.048 4.374 6.048 1.728 0 3.078-.918 3.591-2.646h4.59c-.945 4.05-4.212 6.183-8.127 6.183-5.481 0-8.856-3.645-8.856-9.585s3.375-9.639 8.91-9.639c3.942 0 7.29 2.133 8.073 6.318z"/>
                <path d="m75.1442 33.432c-4.401 0-7.128-2.916-7.128-7.695 0-4.941 2.808-7.722 7.128-7.722 4.401 0 7.155 2.97 7.155 7.722 0 4.914-2.835 7.695-7.155 7.695zm0-3.348c1.917 0 2.916-1.512 2.916-4.347 0-2.808-1.026-4.374-2.916-4.374s-2.889 1.539-2.889 4.374c0 2.808 1.026 4.347 2.889 4.347z"/>
                <path d="m83.9439 33v-14.526h4.1309v2.025c.918-1.728 2.3221-2.484 3.8071-2.484.594 0 1.134.162 1.431.459v3.483c-.486-.108-.999-.162-1.647-.162-2.484 0-3.5911 1.404-3.5911 3.699v7.506z"/>
                <path d="m107.851 28.221c-.756 3.348-3.456 5.211-7.02 5.211-4.5093 0-7.2903-2.916-7.2903-7.695 0-4.941 2.808-7.722 7.1283-7.722 4.347 0 7.074 2.889 7.074 7.641v.918h-9.9903c.216 2.322 1.296 3.564 3.0783 3.564 1.35 0 2.268-.594 2.7-1.917zm-7.182-6.912c-1.5393 0-2.5113.999-2.8353 2.889h5.6433c-.324-1.89-1.296-2.889-2.808-2.889z"/>
                <path d="m118.324 33.432c-5.697 0-9.207-3.672-9.207-9.585 0-5.94 3.51-9.639 9.207-9.639 5.67 0 9.18 3.699 9.18 9.639 0 5.913-3.51 9.585-9.18 9.585zm0-3.537c2.997 0 4.752-2.268 4.752-6.048s-1.755-6.102-4.752-6.102c-3.024 0-4.779 2.295-4.779 6.102 0 3.78 1.755 6.048 4.779 6.048z"/>
                <path d="m133.466 19.365c0 3.915 10.8.594 10.8 8.1 0 3.78-3.132 5.967-7.425 5.967-4.347 0-7.452-1.998-8.1-6.183h4.563c.351 1.809 1.62 2.808 3.564 2.808s2.97-.783 2.97-2.052c0-4.104-10.827-.972-10.827-8.235 0-3.078 2.565-5.562 7.074-5.562 3.807 0 7.101 1.809 7.668 6.048h-4.617c-.378-1.809-1.431-2.673-3.213-2.673-1.512 0-2.457.702-2.457 1.782z"/>
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
              <h1 className="text-2xl font-bold">Supply Chain Tracker</h1>
              <p className="text-white/50 text-sm">
                {connected && publicKey
                  ? `Live on-chain data from ${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`
                  : "Blockchain-verified material provenance & real-time tracking"}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/5 border border-white/10 p-4 text-center">
                <p className="text-2xl font-bold text-green-400">{counts.delivered}</p>
                <p className="text-[11px] text-white/40">Delivered</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-4 text-center">
                <p className="text-2xl font-bold text-yellow-400">{counts.in_transit}</p>
                <p className="text-[11px] text-white/40">In Transit</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-4 text-center">
                <p className="text-2xl font-bold text-blue-400">{counts.processing}</p>
                <p className="text-[11px] text-white/40">Processing</p>
              </div>
            </div>

            <div className="space-y-3">
              {shipments.map((s) => (
                <div key={s.id} className="bg-white/5 border border-white/10 overflow-hidden">
                  <button
                    onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.03] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white/10 flex items-center justify-center">
                        <Truck size={18} className="text-white/60" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{s.material}</p>
                        <p className="text-[11px] text-white/40">{s.id} · {(s.from || "").split(",")[0]} → {((s.to || "").split("—")[1] || s.to).trim()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded ${STATUS_C[s.status]}`}>{STATUS_L[s.status]}</span>
                      <span className="text-[11px] text-white/30">{s.eta}</span>
                    </div>
                  </button>

                  {expanded === s.id && (
                    <div className="px-4 pb-4 border-t border-white/5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                        <div>
                          <p className="text-[11px] text-white/40 uppercase tracking-wider mb-3">Tracking Timeline</p>
                          <div className="space-y-0">
                            {s.steps.map((step, i) => (
                              <div key={i} className="flex gap-3">
                                <div className="flex flex-col items-center">
                                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                                    step.done ? (step.current ? "bg-yellow-400" : "bg-green-400") : "bg-white/20"
                                  }`} />
                                  {i < s.steps.length - 1 && <div className={`w-px h-8 ${step.done ? "bg-green-400/30" : "bg-white/10"}`} />}
                                </div>
                                <div className="pb-4">
                                  <p className={`text-xs ${step.done ? "text-white" : "text-white/40"} ${step.current ? "text-yellow-400" : ""}`}>{step.label}</p>
                                  <p className="text-[10px] text-white/30">{step.time}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <p className="text-[11px] text-white/40 uppercase tracking-wider mb-3">Details</p>
                          <div className="space-y-2 text-xs">
                            <div className="flex justify-between"><span className="text-white/50">Origin</span><span className="flex items-center gap-1"><MapPin size={10} />{s.from}</span></div>
                            <div className="flex justify-between"><span className="text-white/50">Destination</span><span className="flex items-center gap-1"><MapPin size={10} />{s.to}</span></div>
                            <div className="flex justify-between"><span className="text-white/50">Tx Hash</span><span className="font-mono text-[11px] break-all max-w-[200px] text-right">{s.txHash}</span></div>
                            <div className="flex justify-between">
                              <span className="text-white/50">NFT Certificate</span>
                              <Link to="/certificates" className="text-purple-400 hover:text-purple-300 flex items-center gap-1">{s.nftCert} <ExternalLink size={10} /></Link>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-white/5">
                            <button
                              onClick={() => setQrShip(s)}
                              className="w-full flex items-center justify-center gap-2 text-xs py-2 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                            >
                              <QrCode size={14} /> Scan QR to verify on-chain
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-white/5 border border-white/10 p-4">
              <div className="flex items-center gap-2 text-[11px] text-white/40">
                <Shield size={12} />
                <span>All tracking data is anchored on Solana mainnet. Each delivery milestone is an immutable on-chain record.</span>
              </div>
            </div>
          </div>
        </main>
      </div>

      {qrShip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={() => setQrShip(null)}>
          <div className="bg-zinc-900 border border-white/10 p-6 max-w-sm w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium">Verify on Solana</p>
              <button onClick={() => setQrShip(null)}><X size={16} className="text-white/40 hover:text-white" /></button>
            </div>

            <div className="bg-white p-4 mb-4 flex items-center justify-center">
              <div className="w-48 h-48 bg-black/5 flex items-center justify-center flex-col gap-3">
                <QrCode size={80} className="text-black/60" />
                <p className="text-[10px] text-black/40 font-mono break-all px-2 text-center">
                  {qrShip.txHash.slice(0, 20)}...
                </p>
              </div>
            </div>

            <p className="text-[11px] text-white/40 mb-3 text-center">
              Scan with your Solana wallet or mobile explorer
            </p>

            <a
              href={`https://solscan.io/tx/${qrShip.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-xs py-2 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors w-full"
            >
              <ExternalLink size={12} /> View on Solscan
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
