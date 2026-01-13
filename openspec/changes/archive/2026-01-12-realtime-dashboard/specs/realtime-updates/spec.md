# Capability: realtime-updates

## ADDED Requirements

### Requirement: 数据自动发现 (Auto-Discovery)

当系统接收到新的日志上报时，仪表盘 SHALL 在不需要用户交互的情况下反映这些变化。

#### Scenario: 自动刷新列表

- **Given**: 一个处于打开状态的仪表盘页面
- **When**: 外部系统通过 `/api/v1/ingest` 发送一条新日志且处理成功时
- **Then**: 仪表盘应在 15 秒内自动更新日志列表，显示最新的记录

### Requirement: 实时状态指示 (Live Visualization)

仪表盘 SHALL 清晰地展示当前的监控运行状态，以增强实时沉浸感。

#### Scenario: 实时指示灯

- **Given**: 仪表盘的 Live Ingestion 流模块
- **When**: 页面渲染时
- **Then**: 必须显示一个具有呼吸灯效的 “🔴 Live” 标识
