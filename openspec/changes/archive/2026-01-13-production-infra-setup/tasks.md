# 任务清单：production-infra-setup

## Phase 1: SST 初始化

- [x] **1.1 安装 SST 依赖**

  - 安装 `sst` 开发依赖
  - 初始化 SST 项目结构
  - 验证：`npx sst version` 输出版本号

- [x] **1.2 创建 SST 配置文件**
  - 创建 `sst.config.ts`
  - 配置 Next.js 站点资源
  - 定义 Secret 链接（DATABASE_URL, DEEPSEEK_API_KEY）
  - 验证：`npx sst diff` 显示资源列表

## Phase 2: 数据库层抽象

- [x] **2.1 安装 TCP 驱动依赖**

  - 安装 `pg` 和 `drizzle-orm/node-postgres`
  - 验证：`pnpm list pg` 显示已安装

- [x] **2.2 重构连接工厂**
  - 修改 `apps/web/src/db/index.ts`（HTTP 驱动，Edge 兼容）
  - 新增 `apps/web/src/db/index-tcp.ts`（TCP 驱动，私有化部署）
  - 验证：启动开发服务器无报错

## Phase 3: 构建优化

- [x] **3.1 开启 Standalone 输出**
  - 修改 `apps/web/next.config.ts`
  - 添加 `output: "standalone"` 配置
  - 验证：`pnpm build` 生成 `.next/standalone` 目录

## Phase 4: 容器化

- [x] **4.1 创建 Dockerfile**

  - 编写多阶段构建脚本
  - 包含依赖安装、构建、运行时三阶段
  - 验证：`docker build -t omni-sentinel .` 成功

- [x] **4.2 创建 .dockerignore**

  - 排除 node_modules、.git、.next 等目录
  - 优化构建上下文大小

- [x] **4.3 验证容器运行**
  - 运行 `docker run -p 3000:3000 omni-sentinel`
  - 访问 http://localhost:3000 验证功能
  - 验证：页面正常加载

## Phase 5: 部署脚本

- [x] **5.1 添加部署命令**

  - 修改根目录 `package.json`
  - 添加 `deploy:cloud`, `deploy:cloud:dev`, `deploy:docker` 脚本

- [x] **5.2 文档更新**
  - 更新 README.md 添加部署说明
  - 添加环境变量配置指南

## Phase 6: 验证与收尾

- [x] **6.1 生产构建验证**

  - 运行 `pnpm build` 确保无错误

- [x] **6.2 Docker 镜像大小检查**

  - 运行 `docker images omni-sentinel`
  - 确认镜像小于 300MB

- [x] **6.3 SST 开发模式验证** (可选)
  - 需要 AWS 凭证配置
  - 运行 `npx sst dev` 启动开发隧道

---

## 依赖关系

```
Phase 1 (SST) ← 独立
Phase 2 (DB) ← 独立
Phase 3 (Standalone) ← 独立
      ↓
Phase 4 (Docker) ← 依赖 Phase 3
      ↓
Phase 5 (Scripts) ← 依赖 Phase 1, 4
      ↓
Phase 6 (验证)
```

## 预估工时

- Phase 1: 20 分钟
- Phase 2: 30 分钟
- Phase 3: 10 分钟
- Phase 4: 40 分钟
- Phase 5: 15 分钟
- Phase 6: 30 分钟

**总计**: 约 2.5 小时
