# Tasks: integrate-vercel-ai-sdk

## Phase 1: Infrastructure & API

- [ ] 安装核心依赖：`pnpm add ai @ai-sdk/openai` (in apps/web)
- [ ] 配置环境变量：`OPENAI_API_KEY`
- [ ] 创建后端路由 `apps/web/app/api/chat/route.ts`：实现流式分析逻辑

## Phase 2: Prompt Engineering

- [ ] 定义系统提示词 (System Prompt)：集成数据库 schema 和项目架构背景
- [ ] 编写 Prompt 模板：解析日志 `message` 与 `stack_trace`

## Phase 3: UI Integration

- [ ] 创建客户端组件 `AIAssistant.tsx`：处理流式响应渲染
- [ ] 在 `DashboardPage` 中替换右侧的占位符区域
- [ ] 实现点击日志条目自动触发 AI 分析的交互逻辑

## Phase 4: Validation

- [ ] 运行 `openspec validate integrate-vercel-ai-sdk --strict`
- [ ] 手动测试：点击错误日志，观察 AI 是否流式输出了正确的修复建议
- [ ] 验证 Markdown 代码块在 UI 中的高亮效果
