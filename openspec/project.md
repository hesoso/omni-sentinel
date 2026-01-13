# Project Context (Omni-Sentinel)

## Purpose

Omni-Sentinel 是一个 2026 时代的 **AI-First 全栈观测平台**。其核心目标是构建高性能、极速响应的数据摄入引擎，并通过 AI 驱动的自动化诊断，为复杂的分布式系统提供“零白屏”的可视化监控体验。

## Tech Stack

- **Frontend**: Next.js 15+ (App Router, RSC Streaming), Tailwind CSS
- **Backend/Edge**: Next.js Edge Runtime, Python (External Ingestion Support)
- **Database/ORM**: Drizzle ORM, Neon (Serverless Postgres)
- **Infrastructure**: SST (Serverless Stack/Ion), AWS/Cloudflare
- **Cross-platform**: Tauri 2.0 (Rust-based native shell)
- **AI**: Vercel AI SDK
- **Data Safety**: Zod (Runtime validation)

## Project Conventions

### Code Style

- **RSC First**: 优先使用 React Server Components (RSC)，仅在交互边界使用 `'use client'`。
- **Type Safety**: 全路径类型安全，强制要求 Zod 校验外部输入。
- **Commit Message**: 遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范。

### Architecture Patterns

- **IfC (Infrastructure from Code)**: 基础设施直接从代码（Spec/SST）定义，严禁手动在云服务后台配置资源。
- **202 Strategy**: 数据摄入遵循 202 (Accepted) 策略，接收即响应，后台异步持久化，确保 SDK 零延迟。
- **Zero-Fetch Architecture**: 消除客户端 Fetch，利用 RSC 与流式渲染 (Streaming) 获取并推送数据。

### Testing Strategy

- **Spec-Driven Testing**: 验证生成的代码是否严格符合 `openspec/specs` 中的定义。
- **Integration Tests**: 重点覆盖 Edge 路由与 Drizzle Schema 的一致性。

### Git Workflow

- **OpenSpec Workflow**:
  1. 修改 Spec -> 2. 创建 Change -> 3. 编写 Proposal -> 4. 定义 Tasks -> 5. AI 执行实现。

## Domain Context

- **Edge Runtime**: 需要关注边缘运行时的限制（如不支持某些 Node.js 原生包）。
- **Native Bridge**: Tauri 中 JS 与 Rust 之间的通讯模式。

## Important Constraints

- **Performance**: 必须支撑每秒万级并发的数据摄入。
- **Reliability**: 错误日志上报必须脱离主业务链路，保证高可用。

## External Dependencies

- **Neon**: 物理层自动扩缩容的 Serverless Postgres。
- **Vercel AI SDK**: 集成多模型 AI 诊断能力。
