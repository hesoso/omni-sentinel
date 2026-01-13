# 技术设计：production-infra-setup

## 架构概览

```mermaid
graph TB
    subgraph "部署模式"
        A[源代码] --> B{部署目标}
        B -->|Cloud| C[SST Deploy]
        B -->|Self-hosted| D[Docker Build]

        C --> E[AWS Lambda]
        C --> F[CloudFront CDN]

        D --> G[Container Registry]
        G --> H[Kubernetes/Docker Compose]
    end

    subgraph "数据库连接"
        E --> I{协议检测}
        H --> I
        I -->|postgres://| J[TCP Driver]
        I -->|postgresql://| K[HTTP Driver - Neon]
    end
```

## 文件结构

```
omni-sentinel/
├── sst.config.ts              # [NEW] SST v3 配置
├── Dockerfile                 # [NEW] 多阶段构建
├── .dockerignore              # [NEW] Docker 忽略规则
├── package.json               # [MODIFY] 添加部署脚本
└── apps/web/
    ├── next.config.ts         # [MODIFY] 开启 standalone
    └── src/db/
        └── index.ts           # [MODIFY] 连接工厂
```

## 1. SST v3 配置 (`sst.config.ts`)

**技术方案**：

```typescript
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "omni-sentinel",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    const DATABASE_URL = new sst.Secret("DatabaseUrl");
    const DEEPSEEK_API_KEY = new sst.Secret("DeepseekApiKey");

    new sst.aws.Nextjs("Web", {
      path: "apps/web",
      link: [DATABASE_URL, DEEPSEEK_API_KEY],
      environment: {
        DATABASE_URL: DATABASE_URL.value,
        DEEPSEEK_API_KEY: DEEPSEEK_API_KEY.value,
      },
    });
  },
});
```

**关键决策**：

- 使用 SST v3 Ion 架构（基于 Pulumi）
- 通过 `sst.Secret` 管理敏感配置
- `link` 机制自动注入环境变量到 Lambda

## 2. 数据库连接工厂 (`db/index.ts`)

**技术方案**：

```typescript
import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleHttp } from "drizzle-orm/neon-http";
import { drizzle as drizzleTcp } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

function createDbConnection() {
  const url = process.env.DATABASE_URL;

  if (!url) {
    console.warn("[DB] DATABASE_URL is not set. Using placeholder.");
    const sql = neon(
      "postgresql://placeholder:placeholder@localhost:5432/placeholder"
    );
    return drizzleHttp(sql, { schema });
  }

  // 协议检测：HTTP vs TCP
  if (url.startsWith("postgresql://") && url.includes("neon.tech")) {
    // Neon Serverless HTTP
    const sql = neon(url);
    return drizzleHttp(sql, { schema });
  } else {
    // 标准 PostgreSQL TCP
    const pool = new Pool({ connectionString: url });
    return drizzleTcp(pool, { schema });
  }
}

export const db = createDbConnection();
```

**决策理由**：

- Neon 使用 HTTP 驱动（低延迟，无连接池）
- 私有化 PostgreSQL 使用 TCP 驱动（传统连接池）
- 运行时自动检测，无需配置切换

## 3. Next.js Standalone 输出 (`next.config.ts`)

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    // 优化服务端打包
    serverMinification: true,
  },
};

export default nextConfig;
```

**优化效果**：

- 生产镜像从 ~1GB 降至 ~200MB
- 仅包含运行时必需的依赖
- 自动生成 `server.js` 入口

## 4. Dockerfile（多阶段构建）

```dockerfile
# 阶段 1: 依赖安装
FROM node:20-alpine AS deps
WORKDIR /app
RUN corepack enable pnpm
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/
RUN pnpm install --frozen-lockfile

# 阶段 2: 构建
FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable pnpm
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

# 阶段 3: 运行时
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public
USER nextjs
EXPOSE 3000
CMD ["node", "apps/web/server.js"]
```

## 5. 部署脚本 (`package.json`)

```json
{
  "scripts": {
    "deploy:cloud": "sst deploy --stage production",
    "deploy:cloud:dev": "sst dev",
    "deploy:docker": "docker build -t omni-sentinel:latest . && docker run -p 3000:3000 omni-sentinel:latest"
  }
}
```

## 环境变量矩阵

| 变量               | Cloud (SST)     | Docker             |
| ------------------ | --------------- | ------------------ |
| `DATABASE_URL`     | SST Secret 注入 | `-e` 参数或 `.env` |
| `DEEPSEEK_API_KEY` | SST Secret 注入 | `-e` 参数或 `.env` |
| `NODE_ENV`         | 自动设置        | Dockerfile 硬编码  |

## 验证计划

1. **Cloud 部署**：`pnpm deploy:cloud:dev` 验证开发环境
2. **Docker 构建**：`docker build` 验证镜像可构建
3. **协议检测**：分别使用 Neon URL 和标准 PostgreSQL URL 测试连接
