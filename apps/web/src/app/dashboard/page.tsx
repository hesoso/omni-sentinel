import { Suspense } from "react";
import { getRecentLogs, getDashboardStats, getLogById } from "@/lib/data";
import { 
  Activity, 
  AlertCircle, 
  Terminal, 
  Layers,
  ShieldCheck,
  Search
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { LiveIndicator } from "@/components/dashboard/LiveIndicator";
import { AutoRefresh } from "@/components/dashboard/AutoRefresh";
import { AIAssistantWrapper } from "@/components/dashboard/AIAssistantWrapper";
import Link from "next/link";

// --- Components ---

/**
 * 日志列表异步组件 (RSC)
 */
async function LogList({ selectedId }: { selectedId?: string }) {
  const recentLogs = await getRecentLogs(8);
  
  if (recentLogs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-zinc-600">
        <Terminal size={40} className="mb-4 opacity-20" />
        <p className="text-sm font-medium">No ingestion events found in database.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {recentLogs.map((log) => (
        <Link 
          key={log.id} 
          href={`/dashboard?logId=${log.id}`}
          scroll={false}
          className={`block group relative overflow-hidden rounded-2xl border transition-all hover:bg-zinc-900/50 ${
            selectedId === log.id 
              ? 'border-blue-500/50 bg-blue-500/5 shadow-[0_0_20px_rgba(59,130,246,0.1)]' 
              : 'border-white/5 bg-zinc-900/30'
          }`}
        >
          <div className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className={`mt-1 flex h-2 w-2 rounded-full ${
                  log.level === 'error' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]' : 'bg-blue-500'
                }`} />
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-zinc-100 line-clamp-1 group-hover:text-white transition-colors">
                    {log.message}
                  </h3>
                  <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    <span className="flex items-center gap-1 text-blue-400">
                      <Layers size={10} /> 
                      {log.projectId}
                    </span>
                    <span>•</span>
                    <span>{formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}</span>
                  </div>
                </div>
              </div>
              {selectedId === log.id && (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white animate-in zoom-in duration-300">
                  <Search size={10} />
                </div>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

/**
 * 骨架屏占位
 */
function LogListSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-20 w-full animate-pulse rounded-2xl bg-white/5" />
      ))}
    </div>
  );
}

// --- Main Page ---

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ logId?: string }>;
}) {
  const { logId } = await searchParams;
  const stats = await getDashboardStats();
  const selectedLog = logId ? await getLogById(logId) : null;

  return (
    <div className="space-y-10">
      <AutoRefresh />

      {/* Header */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            System <span className="text-blue-500">Observer</span>
          </h1>
          <p className="mt-2 text-sm font-medium text-zinc-500 uppercase tracking-widest">
            Real-time ingestion performance and error analysis.
          </p>
        </div>
        <div className="pb-1">
          <div className="flex items-center gap-4 rounded-2xl bg-white/5 px-4 py-2 border border-white/5">
             <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Status</span>
             <div className="h-4 w-px bg-white/10" />
             <LiveIndicator />
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Events", value: stats?.totalEvents, icon: Activity, color: "text-blue-500" },
          { label: "Active Project", value: stats?.activeProjects, icon: Layers, color: "text-emerald-500" },
          { label: "System Health", value: "Optimal", icon: ShieldCheck, color: "text-amber-500" },
          { label: "Error Rate", value: stats?.errorRate, icon: AlertCircle, color: "text-red-500" },
        ].map((item, i) => (
          <div key={i} className="glass rounded-3xl p-6 relative overflow-hidden group">
             <div className="flex items-center justify-between mb-4">
               <span className="text-[10px] font-bold tracking-widest uppercase opacity-40">{item.label}</span>
               <item.icon size={16} className={item.color} />
             </div>
             <div className="text-2xl font-black tracking-tight text-white">{item.value}</div>
             <div className="absolute right-0 bottom-0 opacity-[0.03] scale-150 translate-x-1/2 translate-y-1/2">
                <item.icon size={120} />
             </div>
          </div>
        ))}
      </section>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 gap-10">
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold tracking-tight text-white">Live Ingestion Stream</h2>
              <div className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[8px] font-black uppercase text-blue-500 border border-blue-500/20">
                Polling Active
              </div>
            </div>
            <Link href="/dashboard" className="text-[10px] font-bold uppercase tracking-widest text-blue-500 hover:underline">Reset Focus</Link>
          </div>
          <Suspense fallback={<LogListSkeleton />}>
            <LogList selectedId={logId} />
          </Suspense>
        </section>
      </div>

      {/* 悬浮 AI 助手 */}
      <AIAssistantWrapper selectedLog={selectedLog} />
    </div>
  );
}
