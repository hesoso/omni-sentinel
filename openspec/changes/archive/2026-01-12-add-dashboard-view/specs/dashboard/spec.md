# Capability: dashboard

## ADDED Requirements

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
