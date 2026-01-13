# Design: add-dashboard-view

## Architecture Overview

本项目严格遵守 Next.js 15+ 的 App Router 架构，强调 **Server Components (RSC)** 与 **Streaming**。

### Layout System

采用三栏式布局构型：

- **Sidebar**: 左侧常驻导航，包含项目列表、过滤器快捷方式。
- **Navbar**: 顶部动作条，包含用户状态、全局搜索。
- **Content**: 中央数据区，采用响应式网格或列表形式展示日志。

### Data Fetching Strategy

- **Lib Data**: 在 `src/lib/data.ts` 中定义 `fetchLogs` 函数。该函数标记为 `async` 且仅在服务端运行。
- **Streaming**: 在 `page.tsx` 中直接调用 `fetchLogs`，但不使用 `await` 阻塞渲染整个页面。通过定义 `LogList` 组件并配合 `<Suspense fallback={<Skeleton />}>` 实现列表的异步注入。

### UI & Styling

- **Iconography**: 使用 `lucide-react` 统一视觉符号。
- **Design System**: 沿用 `globals.css` 中的 HSL 深色主题和玻璃拟态效果，确保 Landing Page 与 Dashboard 的视觉一致性。

## Trade-offs

- **Server-side Sorting & Filtering**: 虽然在服务端做过滤会减少传输数据量，但响应性稍逊于全量拉取后在客户端过滤。权衡海量数据上报的情况，我们坚持**服务端分页与过滤**的原则。
