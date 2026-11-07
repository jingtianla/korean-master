# ==============================================================================
# 韩语学习平台 (Korean Master) - Windows PowerShell 本机 Docker 部署脚本
# 用法：
#   部署测试环境：.\deploy\deploy.ps1 -Env test -Tag test
#   部署生产环境：.\deploy\deploy.ps1 -Env prod -Tag v1.0.0
# ==============================================================================

param(
    [ValidateSet("test", "prod")]
    [string]$Env = "test",
    [string]$Tag = ""
)

$ErrorActionPreference = "Stop"
Set-Location -Path $PSScriptRoot

if (-not $env:IMAGE_REPO) {
    $env:IMAGE_REPO = "ghcr.io/jingtianla/korean-master"
}

if ($Env -eq "prod") {
    if ([string]::IsNullOrWhiteSpace($Tag) -or $Tag -eq "latest") {
        Write-Error "❌ [错误] 生产环境部署必须指定具体的版本号（例如 -Tag v1.0.0），严禁使用 latest！"
        exit 1
    }
    $ComposeFile = "docker-compose.prod.yml"
    $StateCurrent = ".prod_current_tag"
    $StatePrev = ".prod_previous_tag"
    $HealthUrl = "http://localhost:3000/api/health"
} else {
    if ([string]::IsNullOrWhiteSpace($Tag)) { $Tag = "test" }
    $ComposeFile = "docker-compose.test.yml"
    $StateCurrent = ".test_current_tag"
    $StatePrev = ".test_previous_tag"
    $HealthUrl = "http://localhost:3001/api/health"
}

if (Test-Path $StateCurrent) {
    $PrevTag = (Get-Content $StateCurrent -Raw).Trim()
    if ($PrevTag -and ($PrevTag -ne $Tag)) {
        Set-Content -Path $StatePrev -Value $PrevTag -NoNewline
        Write-Host "📦 已自动备份上一版本标签: $PrevTag" -ForegroundColor Cyan
    }
}

$env:IMAGE_TAG = $Tag
Write-Host "🚀 正在本机部署 [$Env] 环境，镜像版本: $($env:IMAGE_REPO):$($env:IMAGE_TAG) ..." -ForegroundColor Yellow

docker compose -f $ComposeFile pull
docker compose -f $ComposeFile up -d

Write-Host "⏳ 正在执行健康检查 ($HealthUrl)..." -ForegroundColor Cyan
for ($i = 1; $i -le 15; $i++) {
    try {
        $resp = Invoke-RestMethod -Uri $HealthUrl -TimeoutSec 3
        if ($resp.status -eq "ok") {
            Set-Content -Path $StateCurrent -Value $Tag -NoNewline
            Write-Host "✅ [$Env] 环境部署成功并通过健康检查！当前版本: $Tag" -ForegroundColor Green
            exit 0
        }
    } catch {
        Start-Sleep -Seconds 2
    }
}

Write-Error "❌ 健康检查超时失败！请运行 .\deploy\rollback.ps1 -Env $Env 回滚。"
exit 1
