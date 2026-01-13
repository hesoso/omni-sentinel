# Tasks: init-sentinel-core

## Phase 1: Environment Setup

- [x] 初始化 Next.js 15 项目应用目录结构，应用于 `apps/web`
- [x] 配置 pnpm 作为项目包管理器
- [x] 安装核心依赖: `zod`, `clsx`, `tailwind-merge`

## Phase 2: Core Ingestion Spec

- [x] 定义 `ingestion` 规格书，包含错误上报的数据模型
- [x] 验证规格书符合 OpenSpec 校验规则

## Phase 3: Initial Implementation (Dry Run)

- [x] 创建 `/api/v1/ingest` 路由占位符
- [x] 配置路由使用 `Edge Runtime`

## Validation

- [x] 运行 `openspec validate init-sentinel-core --strict` 确保提案合规
