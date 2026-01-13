import { ShieldCheck, Key, Layers, Eye, EyeOff } from "lucide-react";

/**
 * 脱敏处理 API Key
 */
function maskApiKey(key: string | undefined): string {
  if (!key) return "未配置";
  if (key.length < 12) return "***";
  return key.slice(0, 7) + "***" + key.slice(-4);
}

/**
 * 安全管理页面
 * 展示 API Key（脱敏）和 Project ID 列表
 */
export default function SecurityPage() {
  const deepseekKey = process.env.DEEPSEEK_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;
  const databaseUrl = process.env.DATABASE_URL;

  // 模拟 Project ID 列表（实际应从数据库聚合）
  const projectIds = ["web-app-v3", "api-gateway", "worker-service", "mobile-app"];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-white">
          Security <span className="text-amber-500">Center</span>
        </h1>
        <p className="mt-1 text-xs font-medium text-zinc-500 uppercase tracking-widest">
          API 密钥管理与安全配置
        </p>
      </div>

      {/* API Keys */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-500">DeepSeek API Key</span>
            <Key size={16} className="text-blue-500" />
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${deepseekKey ? 'bg-emerald-500/20 text-emerald-500' : 'bg-amber-500/20 text-amber-500'}`}>
              {deepseekKey ? <Eye size={18} /> : <EyeOff size={18} />}
            </div>
            <div>
              <p className="text-sm font-mono font-bold text-white">{maskApiKey(deepseekKey)}</p>
              <p className="text-[10px] text-zinc-500">{deepseekKey ? "已配置" : "未配置"}</p>
            </div>
          </div>
        </div>

        <div className="glass rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-500">OpenAI API Key</span>
            <Key size={16} className="text-emerald-500" />
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${openaiKey ? 'bg-emerald-500/20 text-emerald-500' : 'bg-amber-500/20 text-amber-500'}`}>
              {openaiKey ? <Eye size={18} /> : <EyeOff size={18} />}
            </div>
            <div>
              <p className="text-sm font-mono font-bold text-white">{maskApiKey(openaiKey)}</p>
              <p className="text-[10px] text-zinc-500">{openaiKey ? "已配置" : "未配置"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Database URL */}
      <div className="glass rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-500">数据库连接</span>
          <ShieldCheck size={16} className="text-purple-500" />
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${databaseUrl ? 'bg-emerald-500/20 text-emerald-500' : 'bg-amber-500/20 text-amber-500'}`}>
            {databaseUrl ? <Eye size={18} /> : <EyeOff size={18} />}
          </div>
          <div>
            <p className="text-sm font-mono font-bold text-white">
              {databaseUrl ? `postgres://***@${new URL(databaseUrl).hostname}` : "未配置"}
            </p>
            <p className="text-[10px] text-zinc-500">{databaseUrl ? "Neon PostgreSQL" : "使用 Demo Mode"}</p>
          </div>
        </div>
      </div>

      {/* Project IDs */}
      <div className="glass rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-500">已注册项目</span>
          <Layers size={16} className="text-blue-500" />
        </div>
        <div className="flex flex-wrap gap-2">
          {projectIds.map((id) => (
            <span
              key={id}
              className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-400"
            >
              {id}
            </span>
          ))}
        </div>
      </div>

      {/* 安全提示 */}
      <div className="rounded-2xl bg-amber-500/5 border border-amber-500/20 p-4">
        <p className="text-xs text-amber-400">
          <strong>安全提示：</strong> 此页面仅展示脱敏后的配置信息。所有敏感数据均在服务端处理，前端无法访问完整密钥。
        </p>
      </div>
    </div>
  );
}
