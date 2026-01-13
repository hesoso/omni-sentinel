# Proposal: add-log-seeder

## Goal

开发一个内部测试工具，用于在本地/开发环境中快速填充多样化的模拟日志数据。这对于验证 Dashboard 的渲染效率、UI 交互以及后续的 AI 聚合能力至关重要。

## Why

目前数据库为空，手动上报多组数据效率低下。通过脚本化生成数据，可以模拟真实的高频率上报场景，并覆盖多种极端的错误类型。

## What Changes

- **Scripts**: 引入 `apps/web/src/scripts/seed-logs.ts`。
- **Specs**: 增加 `seeding` 能力规格，定义模拟数据的多样性标准。

## User Review Required

> [!IMPORTANT]
> 该工具仅限开发环境使用。
