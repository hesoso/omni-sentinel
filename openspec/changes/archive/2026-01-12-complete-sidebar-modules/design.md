# 技术设计：complete-sidebar-modules

## 架构概览

```
apps/web/src/app/dashboard/
├── page.tsx              # 现有 Overview 页面
├── layout.tsx            # 现有布局（含 Sidebar）
├── logs/
│   └── page.tsx          # [NEW] Live Logs 页面
├── database/
│   └── page.tsx          # [NEW] Database 页面
├── security/
│   └── page.tsx          # [NEW] Security 页面
└── settings/
    └── page.tsx          # [NEW] Settings 页面
```

## 路由设计

### 1. Live Logs (`/dashboard/logs`)

**技术方案**：

- 复用现有 `LogList` 组件，但改为全屏布局
- 实现服务端分页：`getLogsWithPagination(page, limit)`
- 添加过滤器 UI（按 Level、Project ID）

**数据流**：

```
URL ?page=1&level=error
    ↓
Server Component (RSC)
    ↓
Drizzle Query (LIMIT 100, OFFSET)
    ↓
LogList 渲染
```

### 2. Database (`/dashboard/database`)

**技术方案**：

- 展示数据库连接状态（来自 `DATABASE_URL` 解析）
- 显示 `logs` 表的基本统计信息（总条数、最新记录时间）
- 静态展示表结构（无需实时查询 schema）

### 3. Security (`/dashboard/security`)

**技术方案**：

- 从环境变量读取配置信息
- **脱敏处理**：API Key 只显示前 4 位 + `***` + 后 4 位
- Project ID 列表展示（从日志中聚合唯一值）

**安全考量**：

- 所有敏感信息仅在服务端处理
- 前端仅接收脱敏后的字符串
- 不提供修改功能（只读视图）

### 4. Settings (`/dashboard/settings`)

**技术方案**：

- AI 模型切换 Dropdown（OpenAI / DeepSeek）
- 配置持久化方案：暂时使用 localStorage（未来可扩展为 DB 存储）
- 实时生效：修改后立即影响 `/api/chat` 的模型选择

**组件结构**：

```tsx
<SettingsCard title="AI Model">
  <Select value={model} onChange={setModel}>
    <Option value="deepseek">DeepSeek Chat</Option>
    <Option value="openai">OpenAI GPT-4o</Option>
  </Select>
</SettingsCard>
```

## 侧边栏高亮优化

当前实现已使用 `usePathname()`，但存在子路由匹配问题：

| 当前路径                 | 预期高亮项 | 当前行为  |
| ------------------------ | ---------- | --------- |
| `/dashboard`             | Overview   | ✅ 正确   |
| `/dashboard/logs`        | Live Logs  | ✅ 正确   |
| `/dashboard/logs?page=2` | Live Logs  | ❓ 需验证 |

**优化方案**：保持现有逻辑，已满足需求。

## 数据层扩展

### 新增函数 (`lib/data.ts`)

```typescript
// 分页查询
export async function getLogsWithPagination(page: number, limit: number = 100);

// 统计信息
export async function getLogStats();

// 唯一 Project ID 列表
export async function getDistinctProjectIds();
```

## 复用策略

- **LogList 组件**：复用于 Overview 和 Live Logs
- **Glass Card 样式**：复用于所有设置页面
- **数据获取模式**：统一使用 RSC + Suspense
