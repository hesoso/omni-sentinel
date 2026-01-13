import { deepseek } from '@ai-sdk/deepseek';
import { streamText } from 'ai';

// 允许最长 30 秒的流式响应
export const maxDuration = 30;

/**
 * AI 智能诊断接口
 * 处理来自 Dashboard 的日志分析请求
 * 使用 DeepSeek 作为 AI 提供商
 */
export async function POST(req: Request) {
  try {
    const { messages, logContext } = await req.json();

    console.log('process.env.DEEPSEEK_API_KEY', process.env.DEEPSEEK_API_KEY)

    // 演示模式：如果未配置 API KEY，返回模拟流式响应
    if (!process.env.DEEPSEEK_API_KEY) {
      console.warn("[AI Chat] DEEPSEEK_API_KEY is missing. Entering Demo Mode.");
      
      const demoResponse = `### [Demo Mode] AI 诊断报告

**根本原因分析 (Root Cause Analysis)**:
根据日志中的 \`${logContext?.message || "未知错误"}\`，这通常是由后端服务调用超时或网络链路抖动引起的。在典型的 Node.js 环境中，这可能意味着请求在 ${logContext?.metadata?.timeout || "5000ms"} 内未得到响应。

**修复方案 (Fix Suggestion)**:
建议增加重试机制或优化超时配置。您可以参考以下代码进行修复：

\`\`\`typescript
// 建议：增加 Axios 或 Fetch 的超时容错
const fetchData = async () => {
  try {
    const response = await fetch('/api/data', {
      signal: AbortSignal.timeout(8000), // 增加至 8s
    });
    return await response.json();
  } catch (err) {
    console.error("请求超时，正在准备重试...", err);
    // 触发退避重试逻辑...
  }
};
\`\`\`

*注意：以上为演示数据。配置 DEEPSEEK_API_KEY 后即可获得真实的智能诊断。*`;

      // 模拟流式效果 (直接返回 Response)
      return new Response(demoResponse, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }

    // 构造具备项目上下文的系统提示词
    const systemPrompt = `你是一位顶级的全栈软件架构师与调试专家，专门负责 Omni-Sentinel 监控平台的错误诊断。
你的任务是分析用户提供的错误日志，并给出：
1. **根本原因分析 (Root Cause Analysis)**: 解释为什么会发生这个错误。
2. **修复方案 (Fix Suggestion)**: 提供具体的、可直接运行的代码修复建议（使用 Markdown 代码块格式）。

项目背景：
- 这是一个基于 Next.js 15 和 Drizzle ORM 构建的现代监控平台。
- 数据库 Schema (Logs Table): id, project_id, message, stack_trace, level, metadata, created_at。
- 环境：生产/开发混合环境。

待分析的日志上下文：
${JSON.stringify(logContext, null, 2)}

请基于以上背景，用专业且富有洞察力的中文进行分析。始终保持回复简洁、直击痛点。`;

    const result = streamText({
      model: deepseek('deepseek-chat'),
      messages,
      system: systemPrompt,
    });

    // 使用 textStream 手动构建 SSE 响应
    const stream = result.textStream;
    
    return new Response(
      new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder();
          for await (const chunk of stream) {
            // 发送纯文本块
            controller.enqueue(encoder.encode(chunk));
          }
          controller.close();
        },
      }),
      {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Transfer-Encoding': 'chunked',
        },
      }
    );
  } catch (error) {
    console.error('[AI Chat] Error:', error);
    return new Response(JSON.stringify({ error: 'AI Diagnostic Engine failure' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
