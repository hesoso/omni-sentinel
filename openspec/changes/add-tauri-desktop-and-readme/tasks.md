# 任务清单：add-tauri-desktop-and-readme

## Phase 1: Tauri 初始化

- [x] **1.1 创建 apps/desktop 目录**

  - 使用 `pnpm create tauri-app` 初始化
  - 配置为 vanilla-ts 模板
  - 验证：目录结构创建成功

- [x] **1.2 配置 tauri.conf.json**

  - 设置应用名称、版本、窗口尺寸
  - 配置 `frontendDist` 指向 Web 构建产物
  - 启用 notification 插件
  - 验证：`pnpm tauri info` 输出正常

- [x] **1.3 添加到 pnpm workspace**
  - 修改 `pnpm-workspace.yaml` 包含 `apps/desktop`
  - 验证：`pnpm install` 无错误

## Phase 2: Web 构建配置

- [x] **2.1 支持 SSG 导出模式**

  - 修改 `apps/web/next.config.ts`
  - 添加 `BUILD_TARGET` 环境变量检测
  - SSG 模式禁用图片优化
  - 验证：`BUILD_TARGET=desktop pnpm build` 生成 `out/` 目录

- [x] **2.2 处理 Edge Runtime 限制**
  - SSG 模式下 API 路由不可用
  - 配置静态页面的 fallback 处理
  - 验证：静态导出无错误

## Phase 3: Rust 原生功能

- [x] **3.1 安装通知插件**

  - 在 `src-tauri/Cargo.toml` 添加 `tauri-plugin-notification`
  - 初始化插件到 Tauri Builder
  - 验证：编译通过

- [x] **3.2 实现通知命令**
  - 编写 `show_notification` Tauri 命令
  - 从前端可调用
  - 验证：系统通知正常弹出

## Phase 4: README 编写

- [x] **4.1 项目标题与简介**

  - Logo、徽章、一句话描述
  - 项目截图

- [x] **4.2 架构图**

  - Mermaid 格式完整架构
  - 技术选型表格

- [x] **4.3 OpenSpec 说明**

  - 驱动开发流程介绍
  - 已完成变更列表链接

- [x] **4.4 快速开始**

  - 环境要求
  - 安装步骤
  - 启动命令

- [x] **4.5 部署指南**

  - Serverless (SST + AWS)
  - Docker 私有化
  - Desktop 构建

- [x] **4.6 许可证与贡献**
  - MIT 许可
  - 贡献指南链接

## Phase 5: 构建脚本与集成

- [x] **5.1 添加根目录脚本**

  - `build:desktop` - 构建桌面应用
  - `dev:desktop` - 桌面开发模式

- [x] **5.2 验证完整构建流程**
  - `pnpm build:desktop` 端到端测试
  - 验证桌面应用可启动并加载看板

## Phase 6: 项目归档

- [x] **6.1 运行 openspec archive**

  - 整理所有变更记录

- [x] **6.2 最终验证**
  - 检查所有规格完整性
  - 确认文档准确性

---

## 依赖关系

```
Phase 1 (Tauri) ← 独立
Phase 2 (SSG) ← 独立
    ↓
Phase 3 (Rust) ← 依赖 Phase 1
    ↓
Phase 4 (README) ← 独立，可并行
    ↓
Phase 5 (集成) ← 依赖 Phase 1-3
    ↓
Phase 6 (归档)
```

## 预估工时

- Phase 1: 30 分钟
- Phase 2: 20 分钟
- Phase 3: 30 分钟
- Phase 4: 45 分钟
- Phase 5: 20 分钟
- Phase 6: 10 分钟

**总计**: 约 2.5 小时
