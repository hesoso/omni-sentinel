# Tasks: realtime-dashboard

## Phase 1: API & Data Layer

- [ ] 修改 `apps/web/app/api/v1/ingest/route.ts`：在数据库插入成功后异步调用 `revalidateTag('logs')`
- [ ] 修改 `apps/web/src/lib/data.ts`：使用 `unstable_cache` 封装 `getRecentLogs` 并添加 `logs` 标签

## Phase 2: UI Implementation

- [ ] 在 `apps/web/src/components/dashboard/` 下创建 `LiveIndicator.tsx`（🔴 Live 动效）
- [ ] 在 `apps/web/src/components/dashboard/` 下创建 `AutoRefresh.tsx`（定时 `router.refresh()`）
- [ ] 在 `apps/web/src/app/dashboard/page.tsx` 中整合实时组件

## Phase 3: Validation

- [ ] 运行 `openspec validate realtime-dashboard --strict` 确保提案合规
- [ ] 启用 `pnpm dev`
- [ ] 使用 `db:seed` 或 API 发送新日志，观察网页是否在几秒内自动跳出新条目
- [ ] 验证类型安全与构建状态
