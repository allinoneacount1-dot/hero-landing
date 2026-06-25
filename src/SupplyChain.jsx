import { useState } from "react";
import { Link } from "react-router-dom";
import { Twitter, Menu, X, Truck, MapPin, Package, CheckCircle, Clock, Shield, ExternalLink, QrCode } from "lucide-react";
import WalletConnector from "./components/WalletConnector";

const shipments = [
  {
    id: "SHP-4821",
    material: "Structural Steel Beams × 200",
    from: "SteelWorks Corp, Pittsburgh PA",
    to: "Site A — Manhattan Project",
    status: "in_transit",
    eta: "Jun 27, 2026",
    steps: [
      { label: "Order Confirmed", time: "Jun 24, 08:12", done: true },
      { label: "Picked up from supplier", time: "Jun 24, 14:30", done: true },
      { label: "In transit — Chicago Hub", time: "Jun 25, 03:45", done: true, current: true },
      { label: "Arrived at destination", time: "ETA Jun 27", done: false },
      { label: "Delivered & verified", time: "—", done: false },
    ],
    txHash: "5Kj8f2...d4F2a1",
    nftCert: "NFT-001",
  },
  {
    id: "SHP-4819",
    material: "Portland Cement Mix × 500 bags",
    from: "CementPro Ltd, Denver CO",
    to: "Site A — Manhattan Project",
    status: "delivered",
    eta: "Delivered",
    steps: [
      { label: "Order Confirmed", time: "Jun 21, 10:00", done: true },
      { label: "Picked up from supplier", time: "Jun 21, 16:20", done: true },
      { label: "In transit", time: "Jun 22, 02:15", done: true },
      { label: "Arrived at destination", time: "Jun 22, 11:00", done: true },
      { label: "Delivered & verified", time: "Jun 22, 11:30", done: true },
    ],
    txHash: "8Nm3k7...a7B1c9",
    nftCert: "NFT-002",
  },
  {
    id: "SHP-4815",
    material: "Marine Plywood Sheets × 150",
    from: "WoodSupply Inc, Portland OR",
    to: "Site B — Brooklyn Expansion",
    status: "delivered",
    eta: "Delivered",
    steps: [
      { label: "Order Confirmed", time: "Jun 19, 09:00", done: true },
      { label: "Picked up from supplier", time: "Jun 19, 15:45", done: true },
      { label: "In transit", time: "Jun 20, 01:30", done: true },
      { label: "Arrived at destination", time: "Jun 20, 14:20", done: true },
      { label: "Delivered & verified", time: "Jun 20, 14:45", done: true },
    ],
    txHash: "3Px9m2...c2E5d7",
    nftCert: "NFT-003",
  },
  {
    id: "SHP-4810",
    material: "Reinforcement Rebar × 300",
    from: "SteelWorks Corp, Pittsburgh PA",
    to: "Site A — Manhattan Project",
    status: "processing",
    eta: "Jun 28, 2026",
    steps: [
      { label: "Order Confirmed", time: "Jun 18, 11:00", done: true },
      { label: "Picked up from supplier", time: "—", done: false, current: true },
      { label: "In transit", time: "—", done: false },
      { label: "Arrived at destination", time: "—", done: false },
      { label: "Delivered & verified", time: "—", done: false },
    ],
    txHash: "7Rt2p8...f8D4e2",
    nftCert: "NFT-004",
  },
];

const statusColors = {
  in_transit: "text-yellow-400 bg-yellow-400/10",
  delivered: "text-green-400 bg-green-400/10",
  processing: "text-blue-400 bg-blue-400/10",
};

const statusLabels = {
  in_transit: "In Transit",
  delivered: "Delivered",
  processing: "Processing",
};

export default function SupplyChain() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [expanded, setExpanded] = useState(null);

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
              <h1 className="text-2xl font-bold">Supply Chain Tracker</h1>
              <p className="text-white/50 text-sm">Blockchain-verified material provenance & real-time tracking</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/5 border border-white/10 p-4 text-center">
                <p className="text-2xl font-bold text-green-400">2</p>
                <p className="text-[11px] text-white/40">Delivered</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-4 text-center">
                <p className="text-2xl font-bold text-yellow-400">1</p>
                <p className="text-[11px] text-white/40">In Transit</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-4 text-center">
                <p className="text-2xl font-bold text-blue-400">1</p>
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
                        <p className="text-[11px] text-white/40">{s.id} · {s.from.split(",")[0]} → {s.to.split("—")[1] || s.to}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded ${statusColors[s.status]}`}>{statusLabels[s.status]}</span>
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
                            <div className="flex justify-between"><span className="text-white/50">Tx Hash</span><span className="font-mono text-[11px]">{s.txHash}</span></div>
                            <div className="flex justify-between">
                              <span className="text-white/50">NFT Certificate</span>
                              <Link to="/certificates" className="text-purple-400 hover:text-purple-300 flex items-center gap-1">{s.nftCert} <ExternalLink size={10} /></Link>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-white/5">
                            <button className="w-full flex items-center justify-center gap-2 text-xs py-2 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
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
    </div>
  );
}
