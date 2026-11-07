# ==============================================================================
# Korean Master - Windows PowerShell Local Docker Deploy Script
# Usage:
#   Test Env: .\deploy\deploy.ps1 -Env test -Tag test
#   Prod Env: .\deploy\deploy.ps1 -Env prod -Tag v0.1.0
# ==============================================================================

param(
    [ValidateSet("test", "prod")]
    [string]$Env = "test",
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
    if ([string]::IsNullOrWhiteSpace($Tag) -or $Tag -eq "latest") {
        Write-Error "[ERROR] Production deployment requires a specific version tag (e.g. -Tag v0.1.0). 'latest' is strictly forbidden!"
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
        Write-Host "[Backup] Saved previous version tag: $PrevTag" -ForegroundColor Cyan
    }
}

$env:IMAGE_TAG = $Tag
$FullImage = "$($env:IMAGE_REPO):$($env:IMAGE_TAG)"
Write-Host "[Deploy] Starting [$Env] environment with image: $FullImage ..." -ForegroundColor Yellow

$localExists = docker images -q $FullImage
if (-not $localExists) {
    Write-Host "[Deploy] Image not found locally, pulling or building $FullImage ..." -ForegroundColor Cyan
    docker compose -f $ComposeFile pull 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[Deploy] Building local image $FullImage from Dockerfile..." -ForegroundColor Cyan
        docker build -t $FullImage ..
    }
}

docker compose -f $ComposeFile up -d

Write-Host "[HealthCheck] Verifying service health ($HealthUrl)..." -ForegroundColor Cyan
for ($i = 1; $i -le 20; $i++) {
    try {
        $resp = Invoke-RestMethod -Uri $HealthUrl -TimeoutSec 3
        if ($resp.status -eq "ok") {
            Set-Content -Path $StateCurrent -Value $Tag -NoNewline
            Write-Host "[SUCCESS] [$Env] environment is UP and HEALTHY! Running version: $Tag ($HealthUrl)" -ForegroundColor Green
            exit 0
        }
    } catch {
        Start-Sleep -Seconds 2
    }
}

Write-Error "[ERROR] Health check timed out! Run .\deploy\rollback.ps1 -Env $Env to rollback."
exit 1
