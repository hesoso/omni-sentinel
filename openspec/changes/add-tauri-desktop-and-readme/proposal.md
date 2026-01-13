# 变更提案：add-tauri-desktop-and-readme

## Why

Omni-Sentinel 已完成 Web 端核心功能和多模式部署能力。作为收官阶段，需要：

1. **跨端分发**：利用 Tauri 2.0 交付原生桌面体验（macOS/Windows/Linux）
2. **开源准备**：编写专业级 README，展示项目架构和技术实力
3. **项目归档**：整理所有 OpenSpec 变更，形成完整的开发文档

## What Changes

| 模块     | 变更内容                              |
| -------- | ------------------------------------- |
| 桌面端   | 新增 `apps/desktop` Tauri 2.0 应用    |
| 构建配置 | Web 端支持 SSG 静态导出模式           |
| 原生能力 | Rust 实现系统通知功能                 |
| 文档     | 专业级 README.md（架构图 + 部署指南） |

## Scope

- **新增目录**：`apps/desktop`（Tauri 项目）
- **修改文件**：`apps/web/next.config.ts`（支持 export）、根目录 `README.md`
- **扩展规格**：`infrastructure` 新增桌面端需求

## Tauri 2.0 选型理由

| 特性       | Tauri 2.0     | Electron     |
| ---------- | ------------- | ------------ |
| 打包体积   | ~10MB         | ~150MB       |
| 内存占用   | 低            | 高           |
| 安全性     | Rust 内存安全 | Node.js 风险 |
| 移动端支持 | iOS/Android   | 不支持       |

## Dependencies

- Rust toolchain（构建 Tauri）
- Next.js `output: 'export'`（SSG 模式）

## Risks

- **中风险**：需要 Rust 开发环境
- **低风险**：静态导出可能影响部分动态功能

## Success Criteria

- [ ] `apps/desktop` 可成功构建并运行
- [ ] 桌面端正确加载 Web 看板
- [ ] 系统通知功能正常工作
- [ ] README.md 包含架构图和部署指南
