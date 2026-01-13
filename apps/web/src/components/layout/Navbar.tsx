"use client";

import { Bell, Search, User } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-white/5 bg-black/20 backdrop-blur-md px-8">
      {/* Breadcrumbs Placeholder */}
      <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase opacity-40">
        <span>Sentinel</span>
        <span>/</span>
        <span className="text-white">Overview</span>
      </div>

      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="relative hidden sm:block">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search logs, projects..." 
            className="h-9 w-64 rounded-xl bg-white/5 border border-white/5 pl-10 pr-4 text-xs font-medium text-white transition-all focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
          />
        </div>

        <div className="flex items-center gap-4">
          <button className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-zinc-400 hover:text-white transition-colors">
            <Bell size={18} />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-blue-500 border-2 border-background" />
          </button>
          
          <div className="h-6 w-px bg-white/5" />

          <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-[0_0_15px_rgba(59,130,246,0.2)]">
            <User size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
