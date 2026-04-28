param(
  [string]$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path,
  [string]$CondaPython = "C:\Users\admin\miniconda3\python.exe"
)

$ErrorActionPreference = "Stop"

function Invoke-Checked {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Command,
    [string[]]$Arguments = @()
  )

  & $Command @Arguments
  if ($LASTEXITCODE -ne 0) {
    throw "Command failed: $Command $($Arguments -join ' ')"
  }
}

if (-not (Test-Path $CondaPython)) {
  throw "Conda base python not found: $CondaPython"
}

$backendPath = Join-Path $ProjectRoot "app\backend"
$tmpPath = Join-Path $backendPath ".tmp"
$pipCachePath = Join-Path $backendPath ".pip-cache"
New-Item -ItemType Directory -Path $tmpPath -Force | Out-Null
New-Item -ItemType Directory -Path $pipCachePath -Force | Out-Null

Remove-Item Env:HTTP_PROXY -ErrorAction SilentlyContinue
Remove-Item Env:HTTPS_PROXY -ErrorAction SilentlyContinue
Remove-Item Env:ALL_PROXY -ErrorAction SilentlyContinue
Remove-Item Env:GIT_HTTP_PROXY -ErrorAction SilentlyContinue
Remove-Item Env:GIT_HTTPS_PROXY -ErrorAction SilentlyContinue
Remove-Item Env:PIP_NO_INDEX -ErrorAction SilentlyContinue

$env:TEMP = $tmpPath
$env:TMP = $tmpPath
$env:PIP_CACHE_DIR = $pipCachePath

Set-Location $backendPath
Invoke-Checked -Command $CondaPython -Arguments @("-m", "pip", "install", "--upgrade", "pip")
Invoke-Checked -Command $CondaPython -Arguments @("-m", "pip", "install", "--no-cache-dir", "-r", "requirements.txt")

Write-Host "Backend dependencies installed with Conda base Python at $backendPath"
