# Changelog

本项目的版本变更均遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/) 与 [语义化版本 (Semantic Versioning)](https://semver.org/lang/zh-CN/) 规范。

## [0.1.0] - 2026-11-07

### Added (新增功能)
- **音变规则实验室**：支持韩语句子连音化、鼻音化、紧音化、送气化、颚音化五大规则实时检测、口语转写、罗马音标注与中文原理解析。
- **四十音发音点读馆**：内置基础元音、复合元音、松音、紧音与代表收音卡片，支持常速/慢速韩语发音及中文母语者正音指南。
- **《延世韩国语》汉字词源本**：支持按汉字词属性、关键词检索，提供繁体汉字词根拆解、例句点读与生词本收藏。
- **分级语法与随堂自测**：支持初/中/高级韩语语法筛选、单选自测判分与错题本自动收录。
- **DevOps 协作研发体系**：集成 Husky + lint-staged + commitlint 本地自检门禁、Vitest 单元测试（覆盖率 94.51%）、GitHub Actions (`ci.yml` / `cd-test.yml` / `release.yml`)、多阶段非 root `Dockerfile` 与一键部署/回滚脚本。
