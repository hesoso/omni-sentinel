# ingestion Specification

## Purpose
TBD - created by archiving change init-sentinel-core. Update Purpose after archive.
## Requirements
### Requirement: 高性能接口响应

采集接口 MUST 尽可能快地响应客户端，通过异步处理降低阻塞。

#### Scenario: 正常的错误上报

- **Given**: 发送一个有效的 JSON payload 到 `/api/v1/ingest`
- **When**: 接口接收到请求并完成初步合规校验
- **Then**: 接口必须立即返回 `202 Accepted` 状态码

### Requirement: 数据合规性校验

系统 SHALL 确保所有进入的数据都符合预定义的结构，防止污染数据库。

#### Scenario: 发送格式正确的 Payload

- **Given**: 一个包含 `project_id`, `message`, `stack_trace` 和 `level` 的 JSON 数据
- **When**: 接口通过 Zod 进行验证
- **Then**: 验证通过并进入处理队列

#### Scenario: 发送格式错误的 Payload

- **Given**: 一个缺失 `project_id` 的 JSON 数据
- **When**: 接口通过 Zod 进行验证
- **Then**: 接口必须返回 `400 Bad Request` 并提供错误明细

### Requirement: 边缘侧执行 (Edge Runtime)

为了全球加速和低冷启动延迟，采集逻辑 SHALL 运行在 Edge Runtime。

#### Scenario: 验证执行环境

- **Given**: 部署配置
- **When**: 检查路由配置
- **Then**: 该接口必须显式声明使用 `edge` runtime

### Requirement: 数据持久化存储

系统 SHALL 将通过校验的所有数据可靠地存入数据库，以便后续分析。

#### Scenario: 成功存入数据库

- **Given**: 一个通过校验的日志数据包
- **When**: 接口返回 202 状态码后
- **Then**: 数据 MUST 在后台异步写入 PostgreSQL 数据库的 `logs` 表

### Requirement: 类型安全的操作 (ORM)

为了降低系统维护成本和提高代码质量，数据库操作 SHALL 使用类型安全的 ORM。

#### Scenario: 使用 Drizzle ORM

- **Given**: 需要执行数据库写入操作的代码
- **When**: 编写代码时
- **Then**: 必须使用 Drizzle ORM 定义的 Schema 进行操作，严禁编写原生 SQL 字符串进行插入

### Requirement: 错误指纹生成

系统 SHALL 生成错误指纹 (Fingerprint) 用于数据聚合，以减少冗余显示。

#### Scenario: 相似错误的聚合

- **Given**: 系统接收到两条具有相同 `message` 和 `stack_trace` 的日志
- **When**: 计算指纹时
- **Then**: 生成的 `fingerprint` 字段必须一致

### Requirement: API Key 校验

系统 SHALL 支持 API Key 校验，以确保接口仅被授权来源调用。

#### Scenario: 携带有效 API Key

- **Given**: 请求头中包含正确的 `x-api-key`
- **When**: 接口接收请求时
- **Then**: 接口必须正常处理请求并返回 202

#### Scenario: 缺失或错误的 API Key

- **Given**: 请求头缺失 `x-api-key` 或 Key 不正确
- **When**: 接口接收请求时
- **Then**: 接口必须返回 `401 Unauthorized` 或 `403 Forbidden`

### Requirement: 跨域请求支持 (CORS)

系统 SHALL 支持来自浏览器端的跨域请求，以便集成到 Web 应用中。

#### Scenario: 预检请求处理

- **Given**: 浏览器发起 `OPTIONS` 请求
- **When**: 路由接收到请求时
- **Then**: 必须返回包含正确 CORS 头部（如 `Access-Control-Allow-Origin`）的响应

