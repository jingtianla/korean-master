# ==============================================================================
# 韩语学习平台 (Korean Master) - 统一研发命令入口
# 支持 macOS / Linux / Windows (安装了 make 的环境)
# 若 Windows 未安装 make，可直接运行对应的 pnpm setup / pnpm dev / pnpm check / pnpm build
# ==============================================================================

.PHONY: help setup dev check test build format lint

help:
	@echo "=========================================================="
	@echo "Korean Master 常用研发命令："
	@echo "  make setup   - 初始化项目依赖、环境变量与 Git Hooks"
	@echo "  make dev     - 启动本地开发服务器 (http://localhost:3000)"
	@echo "  make check   - 运行全量自检 (格式+Lint+类型+单测覆盖率+构建)"
	@echo "  make test    - 运行单元测试与 60% 覆盖率检查"
	@echo "  make build   - 执行生产环境构建"
	@echo "=========================================================="

setup:
	pnpm install
	node scripts/setup.mjs

dev:
	pnpm dev

check:
	pnpm check

test:
	pnpm test:coverage

build:
	pnpm build

format:
	pnpm format

lint:
	pnpm lint
