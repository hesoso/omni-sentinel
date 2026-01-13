# infrastructure Specification (Delta)

## ADDED Requirements

### Requirement: 跨环境适配

系统 SHALL 具备识别运行环境的能力，支持 Cloud 和 Self-hosted 两种部署模式。

#### Scenario: 环境自动检测

- **Given**: 系统启动时
- **When**: 读取环境变量配置
- **Then**: 必须能够根据配置自动选择合适的运行模式，无需代码修改

#### Scenario: 数据库驱动切换

- **Given**: `DATABASE_URL` 包含不同协议头
- **When**: 连接数据库时
- **Then**: 必须自动选择正确的驱动（HTTP for Neon, TCP for 标准 PostgreSQL）

### Requirement: 基础设施定义 (IaC)

系统 SHALL 包含 SST v3 配置文件，使用代码定义云基础设施资源。

#### Scenario: AWS 资源声明

- **Given**: `sst.config.ts` 配置文件
- **When**: 执行 `sst deploy`
- **Then**: 必须创建 AWS Lambda 函数和 CloudFront 分发

#### Scenario: Secret 管理

- **Given**: 敏感配置（DATABASE_URL, API Key）
- **When**: 部署到 AWS
- **Then**: 必须通过 SST Secret 机制安全注入，不硬编码在配置中

### Requirement: 容器化规格

系统 SHALL 提供生产级 Dockerfile，基于 Node.js 20+ 的多阶段构建。

#### Scenario: 多阶段构建

- **Given**: Dockerfile 定义
- **When**: 执行 `docker build`
- **Then**: 必须使用不少于 3 个阶段（deps → build → runner），最终镜像不包含构建工具链

#### Scenario: 镜像体积优化

- **Given**: 启用 Next.js standalone 输出
- **When**: 构建最终镜像
- **Then**: 镜像大小 SHALL NOT 超过 300MB

#### Scenario: 安全配置

- **Given**: 容器运行时
- **When**: 启动应用进程
- **Then**: MUST NOT 以 root 用户运行，必须使用非特权用户
