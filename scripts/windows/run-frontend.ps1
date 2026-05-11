param(
  [string]$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path,
  [int]$Port = 5173,
  [string]$ApiBase = "http://127.0.0.1:8000"
)

function Disable-ViteWindowsNetworkProbe {
  param(
    [Parameter(Mandatory = $true)]
    [string]$FrontendPath
  )

  $viteChunkPath = Join-Path $FrontendPath "node_modules\vite\dist\node\chunks\config.js"
  if (-not (Test-Path $viteChunkPath)) {
    return
  }

  $originalBlock = @'
	exec("net use", (error$1, stdout) => {
		if (error$1) return;
		const lines = stdout.split("\n");
		for (const line of lines) {
			const m = parseNetUseRE.exec(line);
			if (m) windowsNetworkMap.set(m[2], m[1]);
		}
		if (windowsNetworkMap.size === 0) safeRealpathSync = fs.realpathSync.native;
		else safeRealpathSync = windowsMappedRealpathSync;
	});
'@

  $patchedBlock = @'
	safeRealpathSync = fs.realpathSync.native;
'@

  $content = Get-Content -Path $viteChunkPath -Raw -Encoding UTF8
  if (-not $content.Contains($originalBlock)) {
    return
  }

  $updated = $content.Replace($originalBlock, $patchedBlock)
  if ($updated -ne $content) {
    Set-Content -Path $viteChunkPath -Value $updated -Encoding UTF8
    Write-Host "Patched Vite Windows realpath probe."
  }
}

function Test-FrontendReachable {
  param(
    [Parameter(Mandatory = $true)]
    [int]$FrontendPort
  )

  try {
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:$FrontendPort" -UseBasicParsing -TimeoutSec 2
    return $response.StatusCode -ge 200
  } catch {
    return $false
  }
}

$frontendPath = Join-Path $ProjectRoot "app\frontend"
$ErrorActionPreference = "Stop"
. (Join-Path $PSScriptRoot "common.ps1")

if (-not (Test-PortFree -Port $Port)) {
  if (Test-FrontendReachable -FrontendPort $Port) {
    Write-Host "Frontend already running on http://127.0.0.1:$Port"
    exit 0
  }

  throw "Frontend port $Port is already in use by another process. Run start-dev.ps1 to auto-pick a free port."
}

Set-Location $frontendPath

Remove-Item Env:HTTP_PROXY -ErrorAction SilentlyContinue
Remove-Item Env:HTTPS_PROXY -ErrorAction SilentlyContinue
Remove-Item Env:ALL_PROXY -ErrorAction SilentlyContinue
Remove-Item Env:GIT_HTTP_PROXY -ErrorAction SilentlyContinue
Remove-Item Env:GIT_HTTPS_PROXY -ErrorAction SilentlyContinue
$env:npm_config_offline = "false"
$env:THOUGHTCABINET_API_URL = $ApiBase
$env:THOUGHTCABINET_FRONTEND_PORT = $Port

Disable-ViteWindowsNetworkProbe -FrontendPath $frontendPath

Write-Host "Frontend listening on http://127.0.0.1:$Port"
Write-Host "Proxying /api to $ApiBase"
npm run dev -- --host 0.0.0.0 --port $Port --strictPort --configLoader runner
