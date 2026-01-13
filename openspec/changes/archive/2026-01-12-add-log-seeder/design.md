# Design: add-log-seeder

## Implementation Strategy

我们将通过创建一个独立的 TypeScript 脚本来实现这一工具。

### Tech Stack

- **tsx**: 用于直接运行 TS 脚本。
- **Drizzle ORM**: 直接与数据库交互，以确保性能和类型安全。

### Data Diversity

系统将内置三组样本池：

1. **Levels**: `info`, `warning`, `error`。
2. **Project IDs**: 如 `web-client`, `mobile-app`, `api-gateway`。
3. **Messages**: 常见的 2026 年应用错误（如 `AI_HALLUCINATION_DETECTED`, `EDGE_LATENCY_SPIKE`）。

## Execution Flow

1. 加载 `.env` 中的 `DATABASE_URL`。
2. 建立 Drizzle 连接。
3. 循环 20 次，随机组合各样本池的属性，生成日志记录。
4. 包含 `stack_trace` 以确保 Dashboard 展示完整性。
5. 脚本运行完成后自动断开连接。
