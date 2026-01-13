# Design: realtime-dashboard

## Technical Architecture

我们将利用 Next.js 15+ 的 App Router 缓存机制来实现高效的实时感。

### Server-Side: Invalidation

1. **API Route**: 在 `api/v1/ingest` 的后台执行流程中，调用 `revalidateTag`。
2. **Tagging**: 在 `lib/data.ts` 中，使用 `unstable_cache` 或直接在 fetch 层面（如果迁移到内部 API 调用）标记 `logs` 标签。
   - _Note_: 鉴于我们目前直连 DB，我们将使用 `unstable_cache` 封装查询。

### Client-Side: Automatic Refresh

1. **Realtime Indicator**: 创建一个名为 `LiveIndicator` 的组件，通过 CSS 动画展示“🔴 Live”闪烁效果。
2. **Refresh Logic**: 创建 `AutoRefresh` 客户端组件。
   - 功能：每隔 10 秒调用一次 `router.refresh()`。
   - 优势：`router.refresh()` 仅会触发 Server Components 重新获取数据并差异化更新 DOM，而不会刷新页面状态或丢失客户端状态（如滚动位置）。

## Trade-offs

- **Polling vs SSE**: 我们选择了轮询，因为它实现简单且在 Next.js 模型下性能卓越。
- **Revalidation Granularity**: 使用标签重验证而非路径重验证，以避免不必要的整个页面刷新。
