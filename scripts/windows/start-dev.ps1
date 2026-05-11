param(
  [string]$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path,
  [string]$CondaPython = "C:\Users\admin\miniconda3\python.exe",
  [int]$PreferredBackendPort = 8000,
  [int]$PreferredFrontendPort = 5173
)

$ErrorActionPreference = "Stop"
. (Join-Path $PSScriptRoot "common.ps1")

function Test-BackendHealth {
  param(
    [Parameter(Mandatory = $true)]
    [int]$Port
  )

  try {
    $response = Invoke-RestMethod -Uri "http://127.0.0.1:$Port/api/health" -TimeoutSec 2
    return $response.status -eq "ok"
  } catch {
    return $false
  }
}

function Test-FrontendReachable {
  param(
    [Parameter(Mandatory = $true)]
    [int]$Port
  )

  try {
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:$Port" -UseBasicParsing -TimeoutSec 2
    return $response.StatusCode -ge 200
  } catch {
    return $false
  }
}

if (-not (Test-Path $CondaPython)) {
  throw "Conda base python not found: $CondaPython"
}

$backendScript = Join-Path $PSScriptRoot "run-backend.ps1"
$frontendScript = Join-Path $PSScriptRoot "run-frontend.ps1"

$startBackend = $true
if (Test-PortFree -Port $PreferredBackendPort) {
  $backendPort = $PreferredBackendPort
} elseif (Test-BackendHealth -Port $PreferredBackendPort) {
  $backendPort = $PreferredBackendPort
  $startBackend = $false
} else {
  $backendPort = Get-FreePort -PreferredPort ($PreferredBackendPort + 1)
}

$apiBase = "http://127.0.0.1:$backendPort"
$startFrontend = $true
if (Test-PortFree -Port $PreferredFrontendPort) {
  $frontendPort = $PreferredFrontendPort
} elseif (Test-FrontendReachable -Port $PreferredFrontendPort) {
  $frontendPort = $PreferredFrontendPort
  $startFrontend = $false
} else {
  $frontendPort = Get-FreePort -PreferredPort ($PreferredFrontendPort + 1) -AvoidPorts @($backendPort)
}

$sessionPath = Write-DevSession -ProjectRoot $ProjectRoot -BackendPort $backendPort -FrontendPort $frontendPort

if ($startBackend) {
  Write-Host "Launching backend terminal on port $backendPort"
  & cmd.exe /c start "ThoughtCabinet Backend" powershell.exe -NoLogo -NoExit -ExecutionPolicy Bypass -File "$backendScript" -ProjectRoot "$ProjectRoot" -Port $backendPort -CondaPython "$CondaPython"
  Start-Sleep -Seconds 2
} else {
  Write-Host "Reusing running backend on port $backendPort"
}

if ($startFrontend) {
  Write-Host "Launching frontend terminal on port $frontendPort"
  & cmd.exe /c start "ThoughtCabinet Frontend" powershell.exe -NoLogo -NoExit -ExecutionPolicy Bypass -File "$frontendScript" -ProjectRoot "$ProjectRoot" -Port $frontendPort -ApiBase "$apiBase"
} else {
  Write-Host "Reusing running frontend on port $frontendPort"
}

Write-Host ""
Write-Host "Backend:  http://127.0.0.1:$backendPort"
Write-Host "Frontend: http://127.0.0.1:$frontendPort"
Write-Host "Session:  $sessionPath"
