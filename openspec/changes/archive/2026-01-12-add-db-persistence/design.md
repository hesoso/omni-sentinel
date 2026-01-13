# Design: add-db-persistence

## Architecture Overview

本项目采用 **Infrastructure from Code (IfC)** 的理念。数据库 Schema 的定义应作为单一事实来源。

### Database Stack

- **ORM**: **Drizzle ORM**。
  - 选择理由：2026 年首选的轻量级工具，对 TypeScript 支持极佳，且能完美运行在 Edge Runtime 环境下（通过 `@neondatabase/serverless`）。
- **Provider**: **Neon** (Serverless Postgres)。
  - 选择理由：支持物理层面的自动扩缩容，且提供高性能的 HTTP 驱动，适合无服务器环境。

### Schema Design

`logs` 表结构将严格对齐 `ingestion` 规格书：

- `id`: uuid (Primary Key)。
- `project_id`: text (Index)。
- `message`: text。
- `stack_trace`: text (Nullable)。
- `level`: text (枚举/约束)。
- `metadata`: jsonb (存储动态元数据)。
- `timestamp`: timestamp。

### Connection Strategy

在 `apps/web/src/db/index.ts` 中配置连接池。考虑到 Edge Runtime，我们将使用 `pool` 模式以优化短连性能。

## Trade-offs

- **Jsonb 性能**: 使用 `jsonb` 存储 `metadata` 虽然灵活，但在海量数据查询时可能比固定列慢。考虑到观测数据的多变性，这种灵活性是必要的。
- **Edge Runtime 兼容性**: 必须确保所选的 Drizzle 驱动兼容 Edge 环境，避免使用 Node.js 特有的 TCP 模块。
