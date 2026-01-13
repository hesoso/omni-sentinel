# Design: integrate-vercel-ai-sdk

## Architecture Overview

AI 诊断引擎将作为一个独立的请求链路存在，通过 Vercel AI SDK 与 LLM 进行流式交互。

### AI Streaming Flow

1. **Trigger**: 用户在看板点击某个日志。
2. **Payload**: 前端提取该日志的 `message`, `level` 和 `stack_trace`。
3. **API Request**: 发送至 `/api/chat`。
4. **LLM Execution**: 系统提示词注入项目上下文 -> 请求 OpenAI/Google API。
5. **Streaming Response**: 使用 `streamText` 将分析结果实时推送至前端。

### UI Integration Details

- **Anomaly Detection Area**: 将原有的静态占位符卡片替换为一个动态的诊断窗口。
- **Typewriter Effect**: 利用 `useChat` 钩子自动处理流式文本的拼接与渲染。
- **Syntax Highlighting**: 分析结果中的代码建议将通过 Markdown 渲染组件显示，确保护理高亮。

## Critical Decisions

- **Provider Choice**: 默认使用 OpenAI (gpt-4o)，但通过 SDK 抽象保持可切换性。
- **Context Injection**: 仅在 System Prompt 中注入 Schema 定义，避免将敏感数据泄露给 AI。
