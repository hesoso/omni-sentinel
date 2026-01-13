# Proposal: init-sentinel-core

## Goal

初始化 Omni-Sentinel 项目基础架构，并实现首个数据采集能力（Ingestion Engine）。这是奠定项目高性能、AI-First 观测能力的第一步。

## Motivation

根据 `SP.md` 战略规划，我们需要一个能够处理万级并发、低延迟的数据摄入核心。通过 OpenSpec 驱动，确保从一开始协议定义就是清晰且可被 AI 理解的。

## Capability Breakdown

- **ingestion**: 实现基础的数据采集接口。
  - 支持从外部（如 Python 脚本）接收错误日志及元数据。
  - 采用 Edge Runtime 保证响应速度。
  - 实现 202 Accepted 策略。
  - 搭建 Next.js 15 Monorepo 环境。

## User Review Required

> [!IMPORTANT]
> 此提案将确定项目的初始目录结构和核心依赖方案（Next.js 15, Zod）。
