# seeding Specification

## Purpose
TBD - created by archiving change add-log-seeder. Update Purpose after archive.
## Requirements
### Requirement: 测试数据多样性

Seeding 脚本 SHALL 能够生成具有多样性的模拟日志，以覆盖看板展示的各种边界情况。

#### Scenario: 自动生成日志

- **Given**: 指定填充数量（如 20 条）
- **When**: 运行 seeding 脚本时
- **Then**: 生成的日志必须包含至少 3 种不同的 `level` 和 3 个不同的 `project_id`

### Requirement: 字段完整性

生成的模拟数据 SHALL 包含数据库 Schema 中定义的所有核心字段。

#### Scenario: 填充核心字段

- **Given**: 一个新生成的日志记录
- **When**: 插入数据库时
- **Then**: 必须包含有效的 `message`, `stack_trace`, `timestamp` 以及（可选的）`fingerprint`

