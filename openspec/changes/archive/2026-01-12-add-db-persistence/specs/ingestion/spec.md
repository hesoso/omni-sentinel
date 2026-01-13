# Capability: ingestion

## ADDED Requirements

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
