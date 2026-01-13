# Proposal: integrate-vercel-ai-sdk

## Goal

为 Omni-Sentinel 引入 AI 智能诊断能力，使系统能够自动分析上报的错误日志，并生成具有上下文感知能力的根因分析与代码修复建议。

## Motivation

传统的监控系统仅停留在“告警”阶段。通过集成大模型，我们可以将监控推向“解决”阶段，极大地降低开发者的心智负担，加速故障恢复速度。

## Capability Breakdown

- **AI 诊断核心 (`ai`)**: 定义了错误分析与修复建议的生成标准。
- **流式对话接口**: 基于 Vercel AI SDK 实现打字机式交互，提升 UI 体验。
- **上下文感知 (Context Awareness)**: 通过 Prompt 工程注入数据库 Schema 和项目背景，使 AI 能够生成更精准的方案。

## Dependencies

- `ai`: Vercel AI SDK 核心库。
- `@ai-sdk/openai`: OpenAI 提供商适配器（或根据需求切换为 Anthropic/Google）。
