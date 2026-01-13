# Proposal: add-db-persistence

## Goal

为数据采集引擎补全数据库持久化能力。实现将校验通过的日志数据存入 PostgreSQL 数据库，并使用 Drizzle ORM 进行类型安全的操作。

## Why

目前 `init-sentinel-core` 仅实现了 API 路由的占位符和基础校验，数据在接收后仅在控制台打印，并未持久化。为了支持后续的监控看板和 AI 诊断，必须将数据可靠地存入数据库。

## What Changes

- **Infrastructure**: 集成 Neon Serverless Postgres 和 Drizzle ORM。
- **Database Schema**: 定义 `logs` 表结构，包含 `id`, `project_id`, `message`, `stack_trace`, `level`, `metadata`, `timestamp` 等字段。
- **API Implementation**: 重构 `/api/v1/ingest` 路由，将异步模拟逻辑替换为真实的数据库插入操作。

## User Review Required

> [!NOTE]
> 暂时不需要运行数据库迁移（Migration），本阶段重点在于代码层面的 Schema 定义、连接配置及路由逻辑重构。
