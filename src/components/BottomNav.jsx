import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, ArrowDownUp, ShoppingCart, Lock, User } from "lucide-react";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/swap", label: "Swap", icon: ArrowDownUp },
  { to: "/marketplace", label: "Marketplace", icon: ShoppingCart },
  { to: "/staking", label: "Staking", icon: Lock },
  { to: "/profile", label: "Profile", icon: User },
];

export default function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav className="bottom-nav fixed bottom-0 left-0 right-0 z-40 md:hidden bg-black/95 backdrop-blur-md border-t border-white/10">
      <div className="flex items-center justify-around px-2 pt-2 pb-4">
        {navItems.map(({ to, label, icon: Icon }) => {
          const active = pathname === to;
          return (
            <NavLink
              key={to}
              to={to}
              className={`flex flex-col items-center gap-0.5 min-w-[56px] ${
                active ? "text-white" : "text-white/40"
              }`}
            >
              <Icon size={18} strokeWidth={active ? 2 : 1.5} />
              <span className="text-[10px] leading-tight">{label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
