import { useState } from "react";
import { Link } from "react-router-dom";
import { Twitter, Menu, X, ShoppingCart, Search, Filter, Star, Truck, Shield, Coins, Plus, Minus } from "lucide-react";
import WalletConnector from "./components/WalletConnector";

const MATERIALS = [
  { id: 1, name: "Structural Steel Beams", category: "Structural", price: 62.5, unit: "per beam", rating: 4.9, reviews: 128, supplier: "SteelWorks Corp", image: "🔩", inStock: true, delivery: "3-5 days", paidWith: "SOL" },
  { id: 2, name: "Portland Cement Mix", category: "Concrete", price: 12.5, unit: "per bag", rating: 4.7, reviews: 256, supplier: "CementPro Ltd", image: "🧱", inStock: true, delivery: "2-3 days", paidWith: "USDC" },
  { id: 3, name: "Marine Plywood Sheets", category: "Wood", price: 45, unit: "per sheet", rating: 4.5, reviews: 89, supplier: "WoodSupply Inc", image: "🪵", inStock: true, delivery: "4-6 days", paidWith: "SOL" },
  { id: 4, name: "Reinforcement Rebar", category: "Structural", price: 3.27, unit: "per kg", rating: 4.8, reviews: 167, supplier: "SteelWorks Corp", image: "🔗", inStock: true, delivery: "3-5 days", paidWith: "SOL" },
  { id: 5, name: "Insulation Fiberglass", category: "Insulation", price: 1.8, unit: "per sqft", rating: 4.6, reviews: 72, supplier: "InsulTech", image: "🧊", inStock: true, delivery: "2-4 days", paidWith: "USDC" },
  { id: 6, name: "Copper Wiring 12AWG", category: "Electrical", price: 4.2, unit: "per ft", rating: 4.9, reviews: 198, supplier: "WireTech Co", image: "⚡", inStock: true, delivery: "1-3 days", paidWith: "SOL" },
  { id: 7, name: "PVC Pipes 4-inch", category: "Plumbing", price: 8.5, unit: "per pipe", rating: 4.4, reviews: 134, supplier: "PipeWorks", image: "🔧", inStock: false, delivery: "5-7 days", paidWith: "USDC" },
  { id: 8, name: "Aluminum Sheets 4x8", category: "Metal", price: 85, unit: "per sheet", rating: 4.7, reviews: 91, supplier: "MetalPrime", image: "📄", inStock: true, delivery: "3-5 days", paidWith: "SOL" },
  { id: 9, name: "Drywall Sheets", category: "Interior", price: 14, unit: "per sheet", rating: 4.3, reviews: 156, supplier: "BuildRight", image: "📋", inStock: true, delivery: "2-3 days", paidWith: "USDC" },
  { id: 10, name: "Roofing Shingles", category: "Roofing", price: 25, unit: "per bundle", rating: 4.6, reviews: 88, supplier: "RoofPro", image: "🏠", inStock: true, delivery: "4-6 days", paidWith: "SOL" },
  { id: 11, name: "Concrete Blocks", category: "Concrete", price: 2.8, unit: "per block", rating: 4.5, reviews: 203, supplier: "CementPro Ltd", image: "⬜", inStock: true, delivery: "2-3 days", paidWith: "USDC" },
  { id: 12, name: "Glass Panels 6mm", category: "Interior", price: 120, unit: "per panel", rating: 4.8, reviews: 67, supplier: "GlassTech", image: "🪟", inStock: true, delivery: "5-7 days", paidWith: "SOL" },
];

const CATEGORIES = ["All", "Structural", "Concrete", "Wood", "Electrical", "Insulation", "Metal", "Interior", "Plumbing", "Roofing"];

export default function Marketplace() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const filtered = MATERIALS.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.supplier.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "All" || m.category === category;
    return matchSearch && matchCategory;
  });

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) return prev.map((c) => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart((prev) => prev.map((c) => c.id === id ? { ...c, qty: Math.max(0, c.qty + delta) } : c).filter((c) => c.qty > 0));
  };

  const cartTotal = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  const cartCount = cart.reduce((sum, c) => sum + c.qty, 0);

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
            <button onClick={() => setShowCart(true)} className="relative hover:text-white transition-colors flex items-center gap-1">
              <ShoppingCart size={14} />
              {cartCount > 0 && <span className="text-[10px] bg-white text-black px-1.5 rounded-full font-bold">{cartCount}</span>}
            </button>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors inline-flex items-center"><Twitter size={14} /></a>
            <WalletConnector />
          </div>
          <div className="flex items-center gap-3 md:hidden">
            <button onClick={() => setShowCart(true)} className="relative text-white">
              <ShoppingCart size={20} />
              {cartCount > 0 && <span className="absolute -top-1 -right-1 text-[8px] bg-white text-black w-4 h-4 rounded-full flex items-center justify-center font-bold">{cartCount}</span>}
            </button>
            <button className="text-white" onClick={() => setMenuOpen((p) => !p)}>{menuOpen ? <X size={24} /> : <Menu size={24} />}</button>
          </div>
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
              <h1 className="text-2xl font-bold">Marketplace</h1>
              <p className="text-white/50 text-sm">Pay with SOL, USDC, or CTKN</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search materials..."
                  className="w-full bg-white/5 border border-white/10 pl-9 pr-3 py-2 text-xs text-white placeholder-white/30 outline-none focus:border-white/25 transition-colors"
                />
              </div>
              <div className="flex gap-1 overflow-x-auto">
                {CATEGORIES.slice(0, 6).map((c) => (
                  <button key={c} onClick={() => setCategory(c)} className={`text-[10px] px-3 py-1.5 whitespace-nowrap transition-colors ${category === c ? "bg-white text-black" : "bg-white/5 text-white/40 hover:bg-white/10"}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((item) => (
                <div key={item.id} className="bg-white/5 border border-white/10 p-4 hover:border-white/20 transition-colors flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl">{item.image}</span>
                    <div className="flex items-center gap-1">
                      <Star size={10} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-[10px] text-white/50">{item.rating}</span>
                      <span className="text-[10px] text-white/30">({item.reviews})</span>
                    </div>
                  </div>
                  <h3 className="text-sm font-medium mb-1">{item.name}</h3>
                  <p className="text-[11px] text-white/40 mb-2">{item.supplier}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] px-1.5 py-0.5 bg-white/10 text-white/50">{item.category}</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-white/10 text-white/50 flex items-center gap-1">
                      <Truck size={8} /> {item.delivery}
                    </span>
                  </div>
                  <div className="mt-auto">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-lg font-bold">${item.price.toFixed(2)} <span className="text-[10px] text-white/40 font-normal">{item.unit}</span></p>
                      <span className="text-[10px] text-white/30 flex items-center gap-1"><Coins size={10} /> {item.paidWith}</span>
                    </div>
                    <button
                      onClick={() => addToCart(item)}
                      disabled={!item.inStock}
                      className="w-full py-2 text-xs font-medium bg-white text-black hover:bg-white/90 transition-colors disabled:bg-white/20 disabled:text-white/30 disabled:cursor-not-allowed"
                    >
                      {item.inStock ? "Add to Cart" : "Out of Stock"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {showCart && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end" onClick={() => setShowCart(false)}>
          <div className="w-full max-w-md bg-black/95 border-l border-white/10 flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h2 className="text-sm font-medium">Cart ({cartCount})</h2>
              <button onClick={() => setShowCart(false)}><X size={18} className="text-white/50" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.length === 0 ? (
                <div className="text-center py-12 text-white/30 text-xs">Cart is empty</div>
              ) : (
                cart.map((c) => (
                  <div key={c.id} className="flex items-center gap-3 p-3 bg-white/5">
                    <span className="text-2xl">{c.image}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{c.name}</p>
                      <p className="text-[10px] text-white/40">${c.price.toFixed(2)} {c.unit}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQty(c.id, -1)} className="w-6 h-6 bg-white/10 flex items-center justify-center text-xs hover:bg-white/20"><Minus size={10} /></button>
                      <span className="text-xs w-6 text-center">{c.qty}</span>
                      <button onClick={() => updateQty(c.id, 1)} className="w-6 h-6 bg-white/10 flex items-center justify-center text-xs hover:bg-white/20"><Plus size={10} /></button>
                    </div>
                    <p className="text-xs font-medium w-16 text-right">${(c.price * c.qty).toFixed(2)}</p>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div className="p-4 border-t border-white/10 space-y-3">
                <div className="flex justify-between text-sm"><span className="text-white/50">Total</span><span className="font-bold">${cartTotal.toFixed(2)}</span></div>
                <button className="w-full py-3 bg-white text-black font-medium text-sm hover:bg-white/90 transition-colors flex items-center justify-center gap-2">
                  <Coins size={14} /> Pay with Crypto
                </button>
                <div className="flex items-center gap-2 text-[10px] text-white/30 justify-center">
                  <Shield size={10} /> Secure on-chain payment via Solana
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
