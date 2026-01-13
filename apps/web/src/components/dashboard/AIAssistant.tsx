"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { Sparkles, Send, Bot, User, RotateCcw, X, Square, Maximize2, Minimize2 } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface AIAssistantProps {
  selectedLog?: any;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function AIAssistant({ selectedLog, isOpen = false, onToggle }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastAnalyzedLogId = useRef<string | null>(null);

  // 停止生成
  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  }, []);

  // 发送消息并处理流式响应
  const sendMessage = useCallback(async (userMessage: string) => {
    if (!userMessage.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userMessage,
    };
    
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    const aiMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: aiMsgId, role: "assistant", content: "" }]);

    try {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: userMessage }],
          logContext: selectedLog,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) throw new Error("AI 请求失败");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error("无法读取响应流");

      let fullContent = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullContent += chunk;

        setMessages(prev =>
          prev.map(msg =>
            msg.id === aiMsgId ? { ...msg, content: fullContent } : msg
          )
        );
      }
    } catch (error: any) {
      if (error.name !== "AbortError") {
        console.error("[AIAssistant] Error:", error);
        setMessages(prev =>
          prev.map(msg =>
            msg.id === aiMsgId
              ? { ...msg, content: "❌ AI 诊断失败，请重试。" }
              : msg
          )
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, selectedLog]);

  // 当选中新日志时自动触发诊断
  useEffect(() => {
    const currentLogId = selectedLog?.id;
    if (currentLogId && currentLogId !== lastAnalyzedLogId.current) {
      lastAnalyzedLogId.current = currentLogId;
      setMessages([]);
      sendMessage(`请分析这条错误日志：${selectedLog.message}`);
    }
  }, [selectedLog?.id]);

  // 自动滚动到底部
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input);
      setInput("");
    }
  };

  // 折叠状态：显示悬浮按钮
  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-500/30 hover:bg-blue-500 hover:scale-110 transition-all duration-200"
        title="打开 AI 诊断助手"
      >
        <Bot size={24} />
        {messages.length > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold">
            {messages.length}
          </span>
        )}
      </button>
    );
  }

  // 展开状态：显示完整对话框
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col w-[520px] max-w-[calc(100vw-48px)] h-150 max-h-[calc(100vh-120px)] rounded-3xl border border-white/10 bg-zinc-950/95 backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/20 text-blue-500">
            <Bot size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">AI Diagnostic Engine</h3>
            <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">DeepSeek Powered</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <button 
              onClick={() => setMessages([])}
              className="p-2 text-zinc-500 hover:text-white transition-colors"
              title="清空对话"
            >
              <RotateCcw size={14} />
            </button>
          )}
          <button 
            onClick={onToggle}
            className="p-2 text-zinc-500 hover:text-white transition-colors"
            title="最小化"
          >
            <Minimize2 size={14} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4 scroll-smooth custom-scrollbar"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 animate-pulse">
               <Bot size={32} />
            </div>
            <h4 className="text-sm font-bold text-zinc-200 mb-1">Ready to Assist</h4>
            <p className="text-xs text-zinc-500 max-w-[200px]">
              点击左侧日志列表中的任意条目，AI 将自动分析并给出修复建议。
            </p>
          </div>
        ) : (
          messages.map((m) => (
            <div 
              key={m.id} 
              className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[90%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`shrink-0 h-8 w-8 rounded-lg flex items-center justify-center ${
                  m.role === 'user' ? 'bg-zinc-800 text-zinc-400' : 'bg-blue-600 text-white'
                }`}>
                  {m.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div className={`rounded-2xl p-3 text-xs leading-relaxed overflow-hidden ${
                  m.role === 'user' 
                    ? 'bg-zinc-800 text-zinc-200 rounded-tr-none' 
                    : 'bg-white/5 text-zinc-300 border border-white/5 rounded-tl-none'
                }`}>
                  <div className="prose prose-invert prose-xs max-w-none overflow-x-auto prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-white/5">
                    <ReactMarkdown 
                      components={{
                        pre: ({node, ...props}) => <pre className="overflow-x-auto p-3 rounded-xl mt-2 mb-2" {...props} />,
                        code: ({node, ...props}) => <code className="text-blue-400 font-mono" {...props} />
                      }}
                    >
                      {m.content || "..."}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        {isLoading && messages[messages.length - 1]?.content === "" && (
          <div className="flex gap-3">
             <div className="shrink-0 h-8 w-8 rounded-lg bg-blue-600/50 flex items-center justify-center animate-pulse">
                <Bot size={14} className="text-white" />
             </div>
             <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></span>
             </div>
          </div>
        )}
      </div>


      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 bg-black/40 border-t border-white/5">
        <div className="relative">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入问题继续对话..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
          />
          {isLoading ? (
            <button 
              type="button"
              onClick={stopGeneration}
              className="absolute right-2 top-1.5 p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-400 transition-all"
              title="停止生成"
            >
              <Square size={14} />
            </button>
          ) : (
            <button 
              type="submit"
              disabled={!input}
              className="absolute right-2 top-1.5 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 transition-all"
            >
              <Send size={14} />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
