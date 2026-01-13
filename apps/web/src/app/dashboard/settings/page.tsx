"use client";

import { useState, useEffect } from "react";
import { Settings, Bot, Sparkles, Save, Check } from "lucide-react";

/**
 * 系统设置页面
 * 支持 AI 模型切换等配置
 */
export default function SettingsPage() {
  const [aiModel, setAiModel] = useState("deepseek");
  const [saved, setSaved] = useState(false);

  // 从 localStorage 读取配置
  useEffect(() => {
    const savedModel = localStorage.getItem("ai-model");
    if (savedModel) {
      setAiModel(savedModel);
    }
  }, []);

  // 保存配置
  const handleSave = () => {
    localStorage.setItem("ai-model", aiModel);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-white">
          System <span className="text-purple-500">Settings</span>
        </h1>
        <p className="mt-1 text-xs font-medium text-zinc-500 uppercase tracking-widest">
          系统配置与偏好设置
        </p>
      </div>

      {/* AI Model 选择 */}
      <div className="glass rounded-3xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-purple-500">
              <Bot size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">AI 诊断模型</h3>
              <p className="text-[10px] text-zinc-500">选择用于日志分析的大语言模型</p>
            </div>
          </div>
          <Settings size={16} className="text-zinc-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setAiModel("deepseek")}
            className={`p-4 rounded-2xl border transition-all text-left ${
              aiModel === "deepseek"
                ? "bg-blue-500/10 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.1)]"
                : "bg-white/5 border-white/10 hover:bg-white/10"
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                aiModel === "deepseek" ? "bg-blue-500 text-white" : "bg-zinc-800 text-zinc-400"
              }`}>
                <Bot size={16} />
              </div>
              <span className="text-sm font-bold text-white">DeepSeek Chat</span>
              {aiModel === "deepseek" && (
                <div className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-blue-500">
                  <Check size={12} className="text-white" />
                </div>
              )}
            </div>
            <p className="text-[10px] text-zinc-500">高性价比中文模型，响应速度快</p>
          </button>

          <button
            onClick={() => setAiModel("openai")}
            className={`p-4 rounded-2xl border transition-all text-left ${
              aiModel === "openai"
                ? "bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                : "bg-white/5 border-white/10 hover:bg-white/10"
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                aiModel === "openai" ? "bg-emerald-500 text-white" : "bg-zinc-800 text-zinc-400"
              }`}>
                <Sparkles size={16} />
              </div>
              <span className="text-sm font-bold text-white">OpenAI GPT-4o</span>
              {aiModel === "openai" && (
                <div className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500">
                  <Check size={12} className="text-white" />
                </div>
              )}
            </div>
            <p className="text-[10px] text-zinc-500">最强通用模型，深度推理能力</p>
          </button>
        </div>

        <button
          onClick={handleSave}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
            saved
              ? "bg-emerald-500 text-white"
              : "bg-blue-600 text-white hover:bg-blue-500"
          }`}
        >
          {saved ? (
            <>
              <Check size={16} />
              已保存
            </>
          ) : (
            <>
              <Save size={16} />
              保存设置
            </>
          )}
        </button>
      </div>

      {/* 更多设置（占位） */}
      <div className="glass rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-500">更多设置</span>
          <Settings size={16} className="text-zinc-500" />
        </div>
        <div className="text-center py-8 text-zinc-600">
          <p className="text-sm">更多配置选项即将推出...</p>
        </div>
      </div>
    </div>
  );
}
