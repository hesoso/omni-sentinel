# 任务清单：complete-sidebar-modules

## Phase 1: 路由结构搭建

- [x] **1.1 创建 Live Logs 路由**

  - 创建 `apps/web/src/app/dashboard/logs/page.tsx`
  - 实现全屏日志列表布局
  - 验证：访问 `/dashboard/logs` 显示日志列表

- [x] **1.2 创建 Database 路由**

  - 创建 `apps/web/src/app/dashboard/database/page.tsx`
  - 显示数据库连接状态占位 UI
  - 验证：访问 `/dashboard/database` 无 404

- [x] **1.3 创建 Security 路由**

  - 创建 `apps/web/src/app/dashboard/security/page.tsx`
  - 显示安全设置占位 UI
  - 验证：访问 `/dashboard/security` 无 404

- [x] **1.4 创建 Settings 路由**
  - 创建 `apps/web/src/app/dashboard/settings/page.tsx`
  - 显示系统设置占位 UI
  - 验证：访问 `/dashboard/settings` 无 404

## Phase 2: 数据层扩展

- [x] **2.1 实现分页查询函数**

  - 在 `lib/data.ts` 添加 `getLogsWithPagination(page, limit)`
  - 支持 Demo Mode 降级
  - 验证：单元测试或手动调用

- [x] **2.2 实现统计查询函数**
  - 添加 `getLogStats()` 返回总数、错误率等
  - 添加 `getDistinctProjectIds()` 返回唯一项目列表

## Phase 3: Live Logs 页面完善

- [x] **3.1 实现分页 UI**

  - 添加分页控件（上一页/下一页）
  - 使用 URL searchParams 管理页码状态

- [x] **3.2 实现过滤器** (可选)
  - 按 Level 过滤（error/info/warn）
  - 按 Project ID 过滤

## Phase 4: Security 页面完善

- [x] **4.1 展示 API Key 信息**

  - 从环境变量读取 `DEEPSEEK_API_KEY`
  - 脱敏处理：`sk-1a8c***fc387`

- [x] **4.2 展示 Project ID 列表**
  - 调用 `getDistinctProjectIds()` 获取数据
  - 以标签形式展示

## Phase 5: Settings 页面完善

- [x] **5.1 AI 模型切换 UI**

  - 创建 Dropdown 组件
  - 选项：DeepSeek Chat / OpenAI GPT-4o

- [x] **5.2 配置持久化**
  - 使用 localStorage 存储用户选择
  - 修改 `/api/chat` 读取配置

## Phase 6: 验证与收尾

- [x] **6.1 生产构建验证**

  - 运行 `pnpm build` 确保无错误

- [x] **6.2 全链路测试**
  - 验证所有路由可访问
  - 验证侧边栏高亮正确
  - 验证 AI 模型切换生效

---

## 依赖关系

```
Phase 1 (路由) → Phase 2 (数据层)
                    ↓
              Phase 3 (Live Logs)
              Phase 4 (Security)
              Phase 5 (Settings)
                    ↓
              Phase 6 (验证)
```

## 预估工时

- Phase 1: 30 分钟
- Phase 2: 20 分钟
- Phase 3: 40 分钟
- Phase 4: 30 分钟
- Phase 5: 40 分钟
- Phase 6: 20 分钟

**总计**: 约 3 小时
