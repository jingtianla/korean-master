# ==============================================================================
# Korean Master - Windows PowerShell Local Docker Rollback Script
# Usage:
#   Rollback Prod to previous version: .\deploy\rollback.ps1 -Env prod
#   Rollback Prod to specific version: .\deploy\rollback.ps1 -Env prod -Tag v0.1.0
# ==============================================================================

param(
    [ValidateSet("test", "prod")]
    [string]$Env = "prod",
    [string]$Tag = ""
)

$ErrorActionPreference = "Stop"
Set-Location -Path $PSScriptRoot
if ($env:Path -notlike "*DockerDesktop\resources\bin*") {
    $env:Path += ";$env:LOCALAPPDATA\Programs\DockerDesktop\resources\bin"
}

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
    Write-Error "[ERROR] No previous version record found ($StatePrev). Specify -Tag v0.1.0 manually."
    exit 1
}

if ($RollbackTag -eq "latest") {
    Write-Error "[ERROR] Rolling back to 'latest' is strictly forbidden! Specify an explicit version tag."
    exit 1
}

$env:IMAGE_TAG = $RollbackTag
Write-Host "[Rollback] Rolling back [$Env] environment to: $($env:IMAGE_REPO):$($env:IMAGE_TAG) ..." -ForegroundColor Yellow

docker compose -f $ComposeFile up -d

Write-Host "[HealthCheck] Verifying rolled-back service health ($HealthUrl)..." -ForegroundColor Cyan
for ($i = 1; $i -le 20; $i++) {
    try {
        $resp = Invoke-RestMethod -Uri $HealthUrl -TimeoutSec 3
        if ($resp.status -eq "ok") {
            Set-Content -Path $StateCurrent -Value $RollbackTag -NoNewline
            Write-Host "[SUCCESS] Rollback complete! [$Env] environment restored to version: $RollbackTag" -ForegroundColor Green
            exit 0
        }
    } catch {
        Start-Sleep -Seconds 2
    }
}

Write-Error "[ERROR] Health check failed after rollback!"
exit 1
