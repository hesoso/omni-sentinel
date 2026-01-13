import Image from "next/image";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background font-sans selection:bg-accent/30">
      {/* Background Decor */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="hero-gradient absolute -top-1/4 -left-1/4 h-[800px] w-[800px] animate-pulse-slow opacity-20" />
        <div className="hero-gradient absolute -bottom-1/4 -right-1/4 h-[600px] w-[600px] animate-pulse-slow opacity-10" />
      </div>

      <nav className="glass fixed top-6 left-1/2 z-50 flex h-14 -translate-x-1/2 items-center gap-8 rounded-full px-6 py-2 transition-all hover:px-8">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
          <span className="text-sm font-bold tracking-wider uppercase opacity-80">Sentinel</span>
        </div>
        <div className="h-4 w-px bg-border/40" />
        <div className="flex gap-6 text-xs font-medium uppercase tracking-widest opacity-60">
          <a href="#" className="hover:text-accent transition-colors">Core</a>
          <a href="#" className="hover:text-accent transition-colors">Nodes</a>
          <a href="#" className="hover:text-accent transition-colors">Specs</a>
        </div>
      </nav>

      <main className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-center px-6 pt-40 pb-20 text-center">
        {/* Badge */}
        <div className="glass mb-8 animate-fade-in inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-bold tracking-[0.2em] uppercase text-blue-400">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
          </span>
          Next Gen Observability
        </div>

        {/* Hero Title */}
        <h1 className="mb-6 max-w-4xl text-5xl font-black tracking-tighter sm:text-7xl md:text-8xl">
          <span className="block text-foreground/40">Observing the</span>
          <span className="shimmer-text block">Invisible Future.</span>
        </h1>

        <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">
          Omni-Sentinel is a high-performance, AI-first observability platform designed for 2026. 
          Zero-fetch, real-time ingestion on the Edge.
        </p>

        {/* CTA */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <button className="flex h-14 items-center justify-center gap-3 rounded-full bg-foreground px-8 text-sm font-bold text-background transition-all hover:scale-105 active:scale-95">
            Integrate SDK
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
            </svg>
          </button>
          <button className="glass flex h-14 items-center justify-center px-8 text-sm font-bold transition-all hover:bg-white/5 active:scale-95 rounded-full">
            Explore Documentation
          </button>
        </div>

        {/* Dashboard Preview / Status */}
        <div className="glass mt-24 aspect-video w-full max-w-5xl overflow-hidden rounded-3xl p-1 shadow-2xl">
          <div className="flex h-full w-full flex-col overflow-hidden rounded-[22px] bg-black/40">
            {/* Window Header */}
            <div className="flex h-10 items-center gap-2 border-b border-white/5 px-4">
              <div className="h-2 w-2 rounded-full bg-white/10" />
              <div className="h-2 w-2 rounded-full bg-white/10" />
              <div className="h-2 w-2 rounded-full bg-white/10" />
              <div className="ml-4 text-[10px] font-medium tracking-[0.1em] uppercase opacity-30">Ingestion Dashboard / Real-time Metrics</div>
            </div>
            {/* Window Content */}
            <div className="flex flex-1 items-center justify-center p-12">
               <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-3">
                 {[
                   { label: 'Event Throughput', value: '42.8k', unit: 'req/s', trend: '+12%' },
                   { label: 'Avg Latency', value: '1.24', unit: 'ms', trend: '-8%' },
                   { label: 'Node Distribution', value: '18', unit: 'clusters', trend: 'Global' }
                 ].map((stat, i) => (
                   <div key={i} className="glass flex flex-col items-start gap-1 rounded-2xl p-6 text-left">
                     <span className="text-[10px] font-bold tracking-widest uppercase opacity-40">{stat.label}</span>
                     <div className="flex items-baseline gap-1">
                       <span className="text-3xl font-black tracking-tight">{stat.value}</span>
                       <span className="text-sm font-medium opacity-40">{stat.unit}</span>
                     </div>
                     <span className={`mt-2 text-[10px] font-bold ${stat.trend.startsWith('+') ? 'text-emerald-500' : stat.trend.startsWith('-') ? 'text-blue-500' : 'text-zinc-500'}`}>
                        {stat.trend} from last hour
                     </span>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-20 border-t border-white/5 py-12 text-center">
        <p className="text-xs font-medium tracking-widest uppercase opacity-20">
          Built with OpenSpec & Next.js 15 — 2026.
        </p>
      </footer>
    </div>
  );
}
