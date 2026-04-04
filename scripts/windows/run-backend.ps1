param(
  [string]$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path,
  [int]$Port = 8000,
  [string]$CondaPython = "C:\Users\admin\miniconda3\python.exe"
)

$ErrorActionPreference = "Stop"
. (Join-Path $PSScriptRoot "common.ps1")

function Test-BackendHealth {
  param(
    [Parameter(Mandatory = $true)]
    [int]$HealthPort
  )

  try {
    $response = Invoke-RestMethod -Uri "http://127.0.0.1:$HealthPort/api/health" -TimeoutSec 2
    return $response.status -eq "ok"
  } catch {
    return $false
  }
}

if (-not (Test-Path $CondaPython)) {
  throw "Conda base python not found: $CondaPython"
}

if (-not (Test-PortFree -Port $Port)) {
  if (Test-BackendHealth -HealthPort $Port) {
    Write-Host "Backend already running on http://127.0.0.1:$Port"
    exit 0
  }

  throw "Backend port $Port is already in use by another process. Run start-dev.ps1 to auto-pick a free port."
}

$backendPath = Join-Path $ProjectRoot "app\backend"
$tmpPath = Join-Path $backendPath ".tmp"
New-Item -ItemType Directory -Path $tmpPath -Force | Out-Null

Remove-Item Env:HTTP_PROXY -ErrorAction SilentlyContinue
Remove-Item Env:HTTPS_PROXY -ErrorAction SilentlyContinue
Remove-Item Env:ALL_PROXY -ErrorAction SilentlyContinue
Remove-Item Env:GIT_HTTP_PROXY -ErrorAction SilentlyContinue
Remove-Item Env:GIT_HTTPS_PROXY -ErrorAction SilentlyContinue
Remove-Item Env:PIP_NO_INDEX -ErrorAction SilentlyContinue

$env:TEMP = $tmpPath
$env:TMP = $tmpPath

Set-Location $backendPath
Write-Host "Backend listening on http://127.0.0.1:$Port"
& $CondaPython -m uvicorn main:app --host 0.0.0.0 --port $Port
exit $LASTEXITCODE
