# Tasks: add-dashboard-view

## Phase 1: Environment & Foundation

- [x] 安装核心 UI 依赖：`lucide-react`, `date-fns`
- [x] 创建 `apps/web/src/components/layout/` 目录并实现 `Sidebar.tsx` 和 `Navbar.tsx`
- [x] 在 `apps/web/src/app/dashboard/layout.tsx` 中整合布局组件

## Phase 2: Data Access Layer

- [x] 在 `apps/web/src/lib/data.ts` 中封装基于 Drizzle 的日志查询函数 `getLogs`
- [x] 确保 `getLogs` 支持基本的分页和按 `project_id` 过滤

## Phase 3: Dashboard View

- [x] 创建 `apps/web/src/app/dashboard/page.tsx` 主入口
- [x] 实现 `LogList` 异步服务端组件
- [x] 实现相对应的 `LogListSkeleton` 骨架屏组件
- [x] 应用 `Suspense` 整合流式加载流程

## Validation

- [ ] 运行 `openspec validate add-dashboard-view --strict` 确保提案合规
- [ ] 运行 `pnpm build` 验证类型安全
