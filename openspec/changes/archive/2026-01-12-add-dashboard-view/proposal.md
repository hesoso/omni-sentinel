# Proposal: add-dashboard-view

## Goal

实现 Omni-Sentinel 的 Phase 2 核心功能：监控看板。提供一个生产级的日志查看界面，支撑开发者进行错误排查和性能分析。

## Why

目前系统已经具备了高性能的数据采集能力，但数据仍停留在数据库中。为了释放采集引擎的价值，必须提供一个可视化的管理界面，实践 **Zero-Fetch Architecture** 和 **RSC First** 的技术路线。

## What Changes

- **Specs**: 引入全新的 `dashboard` 能力规格书。
- **Infrastructure**: 安装 `lucide-react` 和 `date-fns` 提升 UI 与数据处理能力。
- **Components**: 建立标准的 Dashboard 布局系统（Sidebar, Navbar）。
- **Data Layer**: 封装服务端数据抓取逻辑，直接对接 Drizzle 产生的 Schema。
- **Views**: 落地 `/dashboard` 主页面，并应用 Suspense 流式加载优化。

## User Review Required

> [!NOTE]
> 本阶段重点在于读操作和 UI 框架，暂不涉及复杂的写操作（如删除日志或配置告警）。
