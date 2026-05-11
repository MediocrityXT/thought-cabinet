param(
  [string]$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
)

$ErrorActionPreference = "Stop"

$frontendPath = Join-Path $ProjectRoot "app\frontend"
Set-Location $frontendPath

Remove-Item Env:HTTP_PROXY -ErrorAction SilentlyContinue
Remove-Item Env:HTTPS_PROXY -ErrorAction SilentlyContinue
Remove-Item Env:ALL_PROXY -ErrorAction SilentlyContinue
Remove-Item Env:GIT_HTTP_PROXY -ErrorAction SilentlyContinue
Remove-Item Env:GIT_HTTPS_PROXY -ErrorAction SilentlyContinue

$npmCache = Join-Path $frontendPath ".npm-cache"
New-Item -ItemType Directory -Path $npmCache -Force | Out-Null
$env:npm_config_offline = "false"
$env:npm_config_cache = $npmCache
$env:npm_config_userconfig = (Join-Path $frontendPath ".npmrc.local")

npm ci --offline=false --prefer-online --ignore-scripts

Write-Host "Frontend dependencies installed at $frontendPath"
