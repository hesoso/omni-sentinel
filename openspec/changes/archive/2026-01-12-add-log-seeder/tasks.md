# Tasks: add-log-seeder

## Phase 1: Environment & Setup

- [ ] 创建 `apps/web/src/scripts` 目录
- [ ] 在 `apps/web/package.json` 中配置 `db:seed` 脚本

## Phase 2: Implementation

- [ ] 编写 `apps/web/src/scripts/seed-logs.ts` 核心逻辑
- [ ] 模拟 `message` 和 `stackTrace` 的随机生成器
- [ ] 集成指纹生成算法（复用 API 层的逻辑或简易对照版）

## Phase 3: Validation

- [ ] 运行 `openspec validate add-log-seeder --strict` 确保提案合规
- [ ] 执行 `pnpm --filter web db:seed` 注入测试数据
- [ ] 访问 Dashboard 确认数据展现正确
