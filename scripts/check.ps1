# Windows PowerShell 一键全量自检脚本
# 用法：在项目根目录运行 .\scripts\check.ps1 或 pnpm check

$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "🔍 开始执行 Korean Master 全量代码自检 (pnpm check)..." -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

Write-Host "`n[1/5] 检查代码格式 (Prettier)..." -ForegroundColor Yellow
pnpm format:check

Write-Host "`n[2/5] 执行静态代码检查 (ESLint)..." -ForegroundColor Yellow
pnpm lint

Write-Host "`n[3/5] 执行 TypeScript 类型检查 (tsc --noEmit)..." -ForegroundColor Yellow
pnpm typecheck

Write-Host "`n[4/5] 运行单元测试与 60% 覆盖率门禁 (Vitest)..." -ForegroundColor Yellow
pnpm test:coverage

Write-Host "`n[5/5] 验证生产环境构建 (Next.js Build)..." -ForegroundColor Yellow
pnpm build

Write-Host "`n✅ 恭喜！所有自检项 100% 通过，可以放心提交与推送代码！" -ForegroundColor Green
