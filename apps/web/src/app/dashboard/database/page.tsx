import { Database, HardDrive, Table, Clock, CheckCircle, XCircle } from "lucide-react";

/**
 * 数据库状态页面
 * 展示数据库连接状态与表结构信息
 */
export default function DatabasePage() {
  const hasDatabase = !!process.env.DATABASE_URL;
  const dbHost = hasDatabase 
    ? new URL(process.env.DATABASE_URL!).hostname 
    : "未配置";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-white">
          Database <span className="text-emerald-500">Explorer</span>
        </h1>
        <p className="mt-1 text-xs font-medium text-zinc-500 uppercase tracking-widest">
          数据库连接状态与表结构
        </p>
      </div>

      {/* 连接状态卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-500">连接状态</span>
            <HardDrive size={16} className="text-emerald-500" />
          </div>
          <div className="flex items-center gap-3">
            {hasDatabase ? (
              <>
                <CheckCircle size={24} className="text-emerald-500" />
                <div>
                  <p className="text-sm font-bold text-white">已连接</p>
                  <p className="text-[10px] text-zinc-500">{dbHost}</p>
                </div>
              </>
            ) : (
              <>
                <XCircle size={24} className="text-amber-500" />
                <div>
                  <p className="text-sm font-bold text-white">Demo Mode</p>
                  <p className="text-[10px] text-zinc-500">使用模拟数据</p>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="glass rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-500">数据库类型</span>
            <Database size={16} className="text-blue-500" />
          </div>
          <div>
            <p className="text-xl font-black text-white">PostgreSQL</p>
            <p className="text-[10px] text-zinc-500">Neon Serverless</p>
          </div>
        </div>
      </div>

      {/* 表结构 */}
      <div className="glass rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-500">表结构</span>
          <Table size={16} className="text-purple-500" />
        </div>
        
        <div className="rounded-xl border border-white/5 overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-white/5">
              <tr>
                <th className="text-left p-3 font-bold text-zinc-400 uppercase tracking-wider">字段名</th>
                <th className="text-left p-3 font-bold text-zinc-400 uppercase tracking-wider">类型</th>
                <th className="text-left p-3 font-bold text-zinc-400 uppercase tracking-wider">说明</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { name: "id", type: "UUID", desc: "主键" },
                { name: "project_id", type: "VARCHAR(50)", desc: "项目标识" },
                { name: "message", type: "TEXT", desc: "日志消息" },
                { name: "stack_trace", type: "TEXT", desc: "堆栈跟踪" },
                { name: "level", type: "VARCHAR(10)", desc: "日志级别" },
                { name: "metadata", type: "JSONB", desc: "扩展元数据" },
                { name: "fingerprint", type: "VARCHAR(64)", desc: "SHA-256 指纹" },
                { name: "created_at", type: "TIMESTAMP", desc: "创建时间" },
              ].map((col) => (
                <tr key={col.name} className="hover:bg-white/5 transition-colors">
                  <td className="p-3 font-mono text-blue-400">{col.name}</td>
                  <td className="p-3 font-mono text-zinc-400">{col.type}</td>
                  <td className="p-3 text-zinc-500">{col.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
