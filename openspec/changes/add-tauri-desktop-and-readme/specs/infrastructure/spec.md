# infrastructure Specification (Delta)

## ADDED Requirements

### Requirement: 桌面端支持

系统 SHALL 包含一个基于 Tauri 2.0 的桌面外壳，支持静态导出 (SSG) 模式加载看板。

#### Scenario: 静态资源加载

- **Given**: Next.js 应用以 `output: 'export'` 模式构建
- **When**: Tauri 桌面应用启动
- **Then**: 必须正确加载 `out/` 目录中的静态 HTML/CSS/JS 资源

#### Scenario: 原生系统通知

- **Given**: 桌面应用检测到关键日志事件
- **When**: 触发通知逻辑
- **Then**: 必须调用操作系统原生通知 API 显示提醒

#### Scenario: 跨平台构建

- **Given**: Tauri 项目配置完成
- **When**: 执行 `pnpm tauri build`
- **Then**: 必须能够生成 macOS (.dmg)、Windows (.msi)、Linux (.deb) 安装包
