# Capability: ingestion

## ADDED Requirements

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
