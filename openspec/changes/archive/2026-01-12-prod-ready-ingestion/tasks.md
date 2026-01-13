# Tasks: prod-ready-ingestion

## Phase 1: Database Setup

- [x] 安装数据库核心依赖：`drizzle-orm`, `@neondatabase/serverless`, `dotenv`
- [x] 安装开发依赖：`drizzle-kit`
- [x] 编写 `apps/web/src/db/schema.ts`，定义 `logs` 数据表
- [x] 编写 `apps/web/src/db/index.ts`，配置数据库连接实例

## Phase 2: Security & Logic Implementation

- [x] 在 `apps/web/app/api/v1/ingest/route.ts` 中实现 `x-api-key` 校验
- [x] 实现哈希指纹函数 (SHA-256)
- [x] 处理 CORS `OPTIONS` 预检请求
- [x] 重构 POST 处理函数，整合“校验 -> 指纹计算 -> 异步入库”流程

## Phase 3: Validation

- [x] 运行 `openspec validate prod-ready-ingestion --strict` 确保提案合规
- [x] 运行 `pnpm build` 在 `apps/web` 下验证类型安全
- [x] 使用 `curl` 模拟跨域请求验证 CORS 支持
