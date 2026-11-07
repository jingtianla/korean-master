# ==============================================================================
# 韩语学习平台 (Korean Master) - Windows PowerShell 本机 Docker 一键回滚脚本
# 用法：
#   回滚生产环境到上一版本：.\deploy\rollback.ps1 -Env prod
#   回滚生产环境到指定版本：.\deploy\rollback.ps1 -Env prod -Tag v1.0.0
# ==============================================================================

param(
    [ValidateSet("test", "prod")]
    [string]$Env = "prod",
    [string]$Tag = ""
)

$ErrorActionPreference = "Stop"
Set-Location -Path $PSScriptRoot

if (-not $env:IMAGE_REPO) {
    $env:IMAGE_REPO = "ghcr.io/jingtianla/korean-master"
}

if ($Env -eq "prod") {
    $ComposeFile = "docker-compose.prod.yml"
    $StateCurrent = ".prod_current_tag"
    $StatePrev = ".prod_previous_tag"
    $HealthUrl = "http://localhost:3000/api/health"
} else {
    $ComposeFile = "docker-compose.test.yml"
    $StateCurrent = ".test_current_tag"
    $StatePrev = ".test_previous_tag"
    $HealthUrl = "http://localhost:3001/api/health"
}

if (-not [string]::IsNullOrWhiteSpace($Tag)) {
    $RollbackTag = $Tag
} elseif (Test-Path $StatePrev) {
    $RollbackTag = (Get-Content $StatePrev -Raw).Trim()
} else {
    Write-Error "❌ 未找到上一版本记录文件 ($StatePrev)，请使用 -Tag v1.0.0 手动指定回滚版本！"
    exit 1
}

if ($RollbackTag -eq "latest") {
    Write-Error "❌ 严禁回滚到 latest 标签！请指定具体版本号。"
    exit 1
}

$env:IMAGE_TAG = $RollbackTag
Write-Host "⏪ 正在将 [$Env] 环境回滚至版本: $($env:IMAGE_REPO):$($env:IMAGE_TAG) ..." -ForegroundColor Yellow

docker compose -f $ComposeFile up -d

Write-Host "⏳ 正在检查回滚后的服务健康状态 ($HealthUrl)..." -ForegroundColor Cyan
for ($i = 1; $i -le 15; $i++) {
    try {
        $resp = Invoke-RestMethod -Uri $HealthUrl -TimeoutSec 3
        if ($resp.status -eq "ok") {
            Set-Content -Path $StateCurrent -Value $RollbackTag -NoNewline
            Write-Host "✅ 回滚成功！[$Env] 环境已恢复至版本: $RollbackTag" -ForegroundColor Green
            exit 0
        }
    } catch {
        Start-Sleep -Seconds 2
    }
}

Write-Error "❌ 回滚后健康检查未通过，请检查容器日志！"
exit 1
