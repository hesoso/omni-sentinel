# Design: prod-ready-ingestion

## Architecture Overview

在现有 Edge Runtime 路由的基础上，插入三个中间层处理：安全中间件、指纹生成器和异步数据库写入器。

### 1. 安全层 (API Key Auth)

- **Mechanism**: 从请求头获取 `x-api-key`。
- **Source of Truth**: 环境变量 `INGESTION_API_KEY`。
- **Edge Compatibility**: 使用简单的字符串比较，避免重型加密库以保持高性能。

### 2. 算法层 (Fingerprinting)

- **Logic**: 取 `message` 和 `stack_trace`（如果存在），拼接后进行哈希运算。
- **Algorithm**: SHA-256 (浏览器/Edge Runtime 原生支持的 `crypto.subtle`)。
- **Benefit**: 允许前端看板根据 `fingerprint` 进行快速聚合计数（Count）。

### 3. 数据层 (Drizzle + Neon)

- **Schema**:
  - `id`: uuid (Primary Key)
  - `project_id`: varchar(128) - 关联项目
  - `message`: text - 错误标题
  - `stack_trace`: text - 堆栈信息
  - `level`: varchar(16) - 级别
  - `fingerprint`: varchar(64) - 聚合指纹 (Index)
  - `created_at`: timestamp - 发生时间
- **Type Safety**: 使用 Drizzle 生成 TS 类型，确保入库数据合规。

### 4. 网络层 (CORS)

- **Preflight**: 响应 `OPTIONS` 请求，返回合法的 `Access-Control-Allow-*` 头。
- **Headers**: 显式允许 `x-api-key` 请求头。

## Critical Decisions

- **Async Execution**: 哈希计算及数据库插入将通过 `Intl.scheduler` 或 `Promise.then` 异步触发，不阻塞 HTTP 响应。
