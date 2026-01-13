# Tasks: add-db-persistence

## Phase 1: Dependencies & Configuration

- [x] 安装核心依赖：`drizzle-orm`, `@neondatabase/serverless`, `dotenv`
- [x] 安装开发依赖：`drizzle-kit`
- [x] 在项目根目录下创建 `.env.example`，包含数据库连接串占位符

## Phase 2: Database Layer

- [x] 在 `apps/web/src/db/` 目录下创建 `schema.ts`:
  - 定义 `logs` 表及其各字段类型
  - 导出 `InsertLog` 和 `SelectLog` 类型
- [x] 在 `apps/web/src/db/` 目录下创建 `index.ts`:
  - 配置基于 `@neondatabase/serverless` 的连接实例
  - 导出 `db` 操作对象

## Phase 3: Route Integration

- [x] 重构 `apps/web/app/api/v1/ingest/route.ts`:
  - 引入 `db` 实例和 `logs` 表
  - 将 `processAsyncIngestion` 占位函数替换为真实的 `db.insert` 操作
  - 确保代码在 Edge Runtime 正常运行

## Validation

- [x] 运行 `openspec validate add-db-persistence --strict` 确保提案合规
- [x] 运行 `pnpm build` 在 `apps/web` 下验证类型安全
