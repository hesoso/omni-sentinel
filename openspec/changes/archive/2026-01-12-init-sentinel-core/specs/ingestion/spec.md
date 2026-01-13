# Capability: ingestion

数据采集能力，负责接收来自各端（Python, JS 等）的错误上报数据。

## ADDED Requirements

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
