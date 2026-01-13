# Proposal: realtime-dashboard

## Goal

为监控仪表盘引入实时更新能力，确保在新日志上报时，已打开的看板能够自动发现并呈现最新数据，无需用户手动刷新。

## Why

在生产环境中，错误日志通常是突发的。实时刷新能让运维和开发人员第一时间感知异常，极大地缩短了响应时间（MTTR）。

## What Changes

- **API (Ingest)**: 在成功接收并持久化日志后，触发 `revalidateTag('logs')` 使缓存失效。
- **Data Layer (lib/data)**: 为查询函数应用 Next.js 缓存标签，支持按需重定向。
- **UI (Dashboard)**: 引入实时状态指示灯（Pulsing Dot）和客户端自动刷新组件（Polling/Router Refresh）。

## User Review Required

> [!NOTE]
> 初期将采用 `router.refresh()` 配合 10s 轮询的方案，由于采用了 RSC + 缓存，服务器压力较小。后续可升级至 SSE。
