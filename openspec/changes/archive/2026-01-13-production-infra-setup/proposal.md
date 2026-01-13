# 变更提案：production-infra-setup

## Why

Omni-Sentinel 业务逻辑已闭环，但缺乏工业级的部署灵活性：

1. **单一部署模式**：当前仅支持 Vercel 开发模式，无私有化部署能力
2. **数据库驱动固化**：硬编码 Neon HTTP 驱动，不支持 TCP 连接（私有化场景需求）
3. **构建产物臃肿**：未启用 Next.js standalone 输出，镜像体积过大
4. **无 IaC 定义**：缺少基础设施即代码配置

## What Changes

本变更将实现"一套代码，双模部署"的工业级架构：

| 模块     | 变更内容                                           |
| -------- | -------------------------------------------------- |
| SST 配置 | 新增 `sst.config.ts`，定义 AWS Lambda + CloudFront |
| 数据库层 | 重构连接工厂，自动识别 HTTP/TCP 协议               |
| 构建优化 | 开启 `output: 'standalone'`                        |
| 容器化   | 多阶段构建 Dockerfile                              |
| 部署脚本 | 新增 `deploy:cloud` 和 `deploy:docker` 命令        |

## Scope

- **新增文件**：`sst.config.ts`, `Dockerfile`, `.dockerignore`
- **修改文件**：`apps/web/src/db/index.ts`, `apps/web/next.config.ts`, `package.json`
- **新增规格**：`infrastructure` 能力域

## Dependencies

- SST v3（Ion 架构）
- `@neondatabase/serverless`（HTTP 驱动）
- `postgres` 或 `pg`（TCP 驱动，可选）

## Risks

- **中风险**：SST 配置复杂度较高，需测试 AWS 部署流程
- **低风险**：数据库驱动切换逻辑需验证兼容性

## Success Criteria

- [ ] `pnpm deploy:cloud` 成功部署到 AWS
- [ ] `pnpm deploy:docker` 成功构建并运行容器
- [ ] 数据库连接工厂正确识别 HTTP/TCP 协议
- [ ] standalone 模式下镜像大小 < 300MB
