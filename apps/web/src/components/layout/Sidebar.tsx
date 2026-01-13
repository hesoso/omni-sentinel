"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BarChart3, 
  Activity, 
  Settings, 
  Database, 
  ShieldCheck, 
  Zap 
} from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: "Overview", icon: BarChart3, href: "/dashboard" },
  { name: "Live Logs", icon: Activity, href: "/dashboard/logs" },
  { name: "Database", icon: Database, href: "/dashboard/database" },
  { name: "Security", icon: ShieldCheck, href: "/dashboard/security" },
  { name: "Settings", icon: Settings, href: "/dashboard/settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-white/5 bg-black/40 backdrop-blur-xl">
      <div className="flex h-full flex-col p-4">
        {/* Brand */}
        <div className="mb-10 flex items-center gap-3 px-2 pt-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/20 text-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.2)]">
            <Zap size={20} className="fill-current" />
          </div>
          <span className="text-xl font-black tracking-tighter text-white">Sentinel</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-all hover:bg-white/5",
                  isActive 
                    ? "bg-blue-600/10 text-blue-500" 
                    : "text-zinc-400 hover:text-white"
                )}
              >
                <item.icon 
                  size={18} 
                  className={cn(
                    "transition-colors",
                    isActive ? "text-blue-500" : "group-hover:text-white"
                  )} 
                />
                {item.name}
                {isActive && (
                  <div className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="mt-auto rounded-2xl bg-gradient-to-br from-zinc-900/50 to-black p-4 border border-white/5">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-2">Current Stack</p>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-zinc-300">Edge Runtime v1.0</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
