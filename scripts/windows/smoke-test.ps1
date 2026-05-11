param(
  [string]$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path,
  [string]$ApiBase
)

$ErrorActionPreference = "Stop"
. (Join-Path $PSScriptRoot "common.ps1")

if (-not $ApiBase) {
  $session = Read-DevSession -ProjectRoot $ProjectRoot
  if ($null -ne $session) {
    $ApiBase = $session.apiBase
  } else {
    $ApiBase = "http://127.0.0.1:8000/api"
  }
}

Write-Host "Checking API health..."
$health = Invoke-RestMethod -Method Get -Uri "$ApiBase/health"
if ($health.status -ne "ok") {
  throw "Health check failed."
}

Write-Host "Checking settings read and api.yaml availability..."
$settings = Invoke-RestMethod -Method Get -Uri "$ApiBase/settings"
if ($settings.llm.apiKey -eq "sk-xxxx") {
  throw "API key is still placeholder (sk-xxxx). Update it in Settings first."
}

$apiYamlPath = "C:\Users\admin\api.yaml"
if (-not (Test-Path $apiYamlPath)) {
  throw "api.yaml not found at $apiYamlPath"
}

$apiYamlContent = Get-Content -Path $apiYamlPath -Raw -Encoding UTF8
if ($apiYamlContent -notmatch "BASE_URL:" -or $apiYamlContent -notmatch "API_KEY:") {
  throw "api.yaml format invalid."
}

Write-Host "Checking LLM call chain..."
$materialBody = @{
  sourceUrl = "https://example.com/windows-smoke"
  title = "Windows Smoke Material"
} | ConvertTo-Json -Depth 6
$material = Invoke-RestMethod -Method Post -Uri "$ApiBase/refinery/materials" -ContentType "application/json" -Body $materialBody

$evaluationBody = @{ idea = "Windows deployment validation project" } | ConvertTo-Json -Depth 4
$evaluation = Invoke-RestMethod -Method Post -Uri "$ApiBase/evaluations" -ContentType "application/json" -Body $evaluationBody

$conversationBody = @{
  initialMessage = "Summarize in 3 points and propose next action."
  contextId = $material.id
} | ConvertTo-Json -Depth 6
$conversation = Invoke-RestMethod -Method Post -Uri "$ApiBase/refinery/conversations" -ContentType "application/json" -Body $conversationBody

if (-not $evaluation.id -or -not $conversation.id) {
  throw "LLM flow smoke test returned invalid payload."
}

Write-Host "Smoke test passed."
