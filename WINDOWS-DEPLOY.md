# ThoughtCabinet Windows Deployment (v0.1)

## 1) Prepare `api.yaml`

Create or update:

`C:\Users\admin\api.yaml`

```yaml
BASE_URL: 'https://api.xxx.com/v1/chat/completions'
API_KEY: 'sk-xxxx'
```

`API_KEY` must be a real key for LLM features and smoke tests.

## 2) Install dependencies (Conda base)

From repo root:

```powershell
.\scripts\windows\setup-backend.ps1
.\scripts\windows\setup-frontend.ps1
```

Backend script uses `C:\Users\admin\miniconda3\python.exe` (base env).

## 3) Start services

Recommended: one command opens two Windows terminals and auto-picks free ports.

```powershell
.\scripts\windows\start-dev.ps1
```

The launcher writes the chosen ports to:

`D:\AllCode\thought-cabinet\logs\dev-session.json`

It also reuses an already healthy backend/frontend on the default ports when possible, instead of blindly opening duplicates.

Manual mode is still available:

```powershell
.\scripts\windows\run-backend.ps1 -Port 8000
.\scripts\windows\run-frontend.ps1 -Port 5173 -ApiBase http://127.0.0.1:8000
```

The frontend proxy target is now driven by `THOUGHTCABINET_API_URL`, so the launcher can safely use a non-default backend port if `8000` is occupied.

## 4) Smoke test

After backend is running:

```powershell
.\scripts\windows\smoke-test.ps1
```

This verifies:
- `/api/health`
- `/api/settings` read and `C:\Users\admin\api.yaml` availability
- LLM flow endpoints: `refinery/materials`, `evaluations`, `refinery/conversations`
