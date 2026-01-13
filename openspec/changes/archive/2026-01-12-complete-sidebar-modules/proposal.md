# 变更提案：complete-sidebar-modules

## Why

当前 Omni-Sentinel 仪表盘仅实现了 `/dashboard` 主页，但侧边栏导航中列出的其他模块（Live Logs、Database、Security、Settings）均为空壳路由。这导致：

1. **用户体验断裂**：点击导航项后显示 404 或空白页
2. **功能不完整**：缺乏全量日志查看、安全配置管理、系统设置等核心能力
3. **平台可信度下降**：专业观测平台应具备完整的功能矩阵

## What Changes

本变更将补齐所有侧边栏对应的功能页面：

| 路由                  | 功能描述                                      |
| --------------------- | --------------------------------------------- |
| `/dashboard/logs`     | 全屏日志流视图，支持分页与过滤                |
| `/dashboard/database` | 数据库连接状态与表结构预览                    |
| `/dashboard/security` | API Key 管理（脱敏展示）与 Project ID 配置    |
| `/dashboard/settings` | 系统设置，包括 AI 模型切换（OpenAI/DeepSeek） |

## Scope

- **新增路由**：4 个子页面
- **组件增强**：Sidebar 高亮逻辑优化（已部分实现）
- **数据层扩展**：分页查询逻辑
- **安全考量**：敏感信息脱敏处理

## Dependencies

- 依赖现有的 `dashboard` 规格
- 依赖 `ingestion` 规格中的日志数据结构
- 依赖环境变量配置（`DATABASE_URL`, `DEEPSEEK_API_KEY` 等）

## Risks

- **低风险**：主要是 UI 层新增，不涉及核心数据流改动
- **中风险**：Security 页面需谨慎处理敏感信息展示

## Success Criteria

- [ ] 所有 4 个路由可正常访问且无 404
- [ ] 侧边栏导航项正确高亮
- [ ] Live Logs 页面支持分页加载
- [ ] Security 页面展示脱敏后的 API Key
- [ ] Settings 页面可切换 AI 模型配置
