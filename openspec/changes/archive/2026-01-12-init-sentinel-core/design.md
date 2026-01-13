# Design: init-sentinel-core

## Architecture Overview

Omni-Sentinel 的核心是数据采集引擎。设计重点在于“极速”与“可靠”。

### Ingestion Engine (数据摄入引擎)

- **Runtime Selection**: 使用 **Next.js Edge Runtime**。相比 Node.js，Edge Runtime 具有更快的冷启动速度和更低的内存占用，适合高频、逻辑简单的 I/O 任务。
- **Response Strategy**: **202 Accepted**。
  - 数据采集接口在收到请求后立即返回 202 状态码，而不等待数据库写入完成。
  - 这种设计确保了客户端（监控 SDK/Python 环境）的零阻塞。
- **Schema Validation**: 使用 **Zod** 对输入 payload 进行运行时校验，确保进入系统的数据完全符合 Spec 约定。

## Critical Decisions

- **Next.js 15+ (App Router)**: 利用最新的服务器组件和流渲染能力。
- **Pnpm**: 作为包管理器，利用其缓存机制提升 CI/CD 效率。

## Trade-offs

- **Edge Runtime 限制**: Edge Runtime 不支持所有 Node.js 原生 API (如 `fs`, `process`)，但对于数据透传和简单校验已足够。复杂的后续处理将交给异步操作或其他服务。
