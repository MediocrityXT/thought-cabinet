Set-StrictMode -Version Latest

function Test-PortFree {
  param(
    [Parameter(Mandatory = $true)]
    [int]$Port
  )

  $listener = $null

  try {
    $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $Port)
    $listener.Start()
    return $true
  } catch {
    return $false
  } finally {
    if ($null -ne $listener) {
      $listener.Stop()
    }
  }
}

function Get-FreePort {
  param(
    [Parameter(Mandatory = $true)]
    [int]$PreferredPort,
    [int[]]$AvoidPorts = @(),
    [int]$SearchLimit = 100
  )

  if (($AvoidPorts -notcontains $PreferredPort) -and (Test-PortFree -Port $PreferredPort)) {
    return $PreferredPort
  }

  for ($offset = 1; $offset -le $SearchLimit; $offset++) {
    $candidate = $PreferredPort + $offset
    if (($AvoidPorts -notcontains $candidate) -and (Test-PortFree -Port $candidate)) {
      return $candidate
    }
  }

  throw "No free port found near $PreferredPort."
}

function Get-DevSessionPath {
  param(
    [Parameter(Mandatory = $true)]
    [string]$ProjectRoot
  )

  return Join-Path $ProjectRoot "logs\dev-session.json"
}

function Write-DevSession {
  param(
    [Parameter(Mandatory = $true)]
    [string]$ProjectRoot,
    [Parameter(Mandatory = $true)]
    [int]$BackendPort,
    [Parameter(Mandatory = $true)]
    [int]$FrontendPort
  )

  $logDir = Join-Path $ProjectRoot "logs"
  $sessionPath = Get-DevSessionPath -ProjectRoot $ProjectRoot
  $session = [ordered]@{
    backendPort = $BackendPort
    frontendPort = $FrontendPort
    apiBase = "http://127.0.0.1:$BackendPort/api"
    frontendUrl = "http://127.0.0.1:$FrontendPort"
    writtenAt = (Get-Date).ToString("s")
  }

  New-Item -ItemType Directory -Path $logDir -Force | Out-Null
  $session | ConvertTo-Json | Set-Content -Path $sessionPath -Encoding UTF8
  return $sessionPath
}

function Read-DevSession {
  param(
    [Parameter(Mandatory = $true)]
    [string]$ProjectRoot
  )

  $sessionPath = Get-DevSessionPath -ProjectRoot $ProjectRoot
  if (-not (Test-Path $sessionPath)) {
    return $null
  }

  return Get-Content -Path $sessionPath -Raw -Encoding UTF8 | ConvertFrom-Json
}
