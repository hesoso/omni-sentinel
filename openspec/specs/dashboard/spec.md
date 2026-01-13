# dashboard Specification

## Purpose

TBD - created by archiving change add-dashboard-view. Update Purpose after archive.

## Requirements

### Requirement: RSC 渲染优先

看板主页面 SHALL 使用 Server Components 实现，数据获取必须在服务端完成。

#### Scenario: 初始页面加载

- **Given**: 用户访问 `/dashboard`
- **When**: 页面进行服务端渲染时
- **Then**: 必须在服务端直接从数据库获取日志列表

### Requirement: 流式加载 (Streaming)

日志列表 SHALL 使用 React Suspense 处理异步数据获取，以实现流式渲染。

#### Scenario: 使用 Suspense 占位

- **Given**: 一个包含异步数据抓取的组件
- **When**: 在页面中调用时
- **Then**: 必须外层包裹 `<Suspense>` 并提供 Skeleton 预览

### Requirement: 响应式设计

系统 SHALL 适配各种屏幕尺寸，确保跨设备体验一致。

#### Scenario: 布局自适应

- **Given**: 不同尺寸的视口
- **When**: 渲染看板时
- **Then**: 侧边栏和内容区必须按照断点规则自动调整布局

### Requirement: 模块化路由

系统 SHALL 实现完整的子路由结构，支持独立的功能模块页面。

#### Scenario: 子路由可访问性

- **Given**: 用户通过侧边栏导航
- **When**: 点击任意导航项
- **Then**: 必须能够访问对应的子路由页面，包括：
  - `/dashboard` (Overview)
  - `/dashboard/logs` (Live Logs)
  - `/dashboard/database` (Database)
  - `/dashboard/security` (Security)
  - `/dashboard/settings` (Settings)

### Requirement: 实时流视图 (Live Logs)

Live Logs 页面 SHALL 提供全屏、高密度的日志查看体验，支持分页与过滤。

#### Scenario: 分页加载

- **Given**: 系统中存在超过 100 条日志
- **When**: 用户访问 `/dashboard/logs`
- **Then**: 必须分页展示日志，每页最多 100 条，并提供翻页控件

#### Scenario: 全屏布局

- **Given**: 用户进入 Live Logs 页面
- **When**: 页面渲染完成
- **Then**: 日志列表必须占据主内容区的全部宽度，无侧边信息栏

### Requirement: 安全管理 (Security)

Security 页面 SHALL 展示系统的安全配置信息，采用只读模式。

#### Scenario: API Key 脱敏展示

- **Given**: 环境变量中配置了 `DEEPSEEK_API_KEY=sk-xxx`
- **When**: 用户访问 `/dashboard/security`
- **Then**: 必须以脱敏格式展示，如 `sk-1a8c***fc387`

#### Scenario: Project ID 列表

- **Given**: 日志数据中包含多个不同的 `project_id`
- **When**: 用户访问 Security 页面
- **Then**: 必须展示所有唯一的 Project ID 列表

### Requirement: 系统设置 (Settings)

Settings 页面 SHALL 提供系统行为的配置能力。

#### Scenario: AI 模型切换

- **Given**: 用户进入 `/dashboard/settings`
- **When**: 选择不同的 AI 模型（OpenAI / DeepSeek）
- **Then**: 选择必须被保存，且后续的 AI 诊断请求使用新选择的模型
