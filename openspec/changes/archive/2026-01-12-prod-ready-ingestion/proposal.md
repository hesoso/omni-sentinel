# Proposal: prod-ready-ingestion

## Goal

对 Ingestion Engine 进行生产化加固，确保其具备基本的安全性、数据聚合分析能力及跨域访问支持。

## Why

虽然已经初步搭建了路由和基础架构，但要达到生产标准，还需要解决以下问题：

1. **安全性**: 缺乏 API Key 校验，接口容易被滥用。
2. **数据洪峰**: 相似错误若不经过指纹（Fingerprint）处理，会造成数据库冗余且难以聚合。
3. **兼容性**: 需要支持浏览器端的跨域请求。
4. **持久化**: 补全前序工作中尚未落地的数据库存储逻辑。

## What Changes

- **Capability Sync**: 更新 `ingestion` 规格书，加入指纹算法、API Key 校验和 CORS 要求。
- **Database**: 引入 Drizzle ORM 并定义生产级 `logs` 表 Schema。
- **Security**: 实现环境变量驱动的 `x-api-key` 校验。
- **Algorithm**: 实现基于 SHA-256 的错误指纹计算逻辑。
- **Network**: 处理 OPTIONS 预检请求并注入 CORS Header。

## User Review Required

> [!IMPORTANT]
> 此变更将涵盖数据库、安全和算法三个层面，是 Ingestion 模块的最终加固。
