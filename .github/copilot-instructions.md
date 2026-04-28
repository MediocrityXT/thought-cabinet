# ThoughtCabinet Copilot Instructions

## Build, test, and lint commands

```bash
# Frontend
cd app/frontend && npm run dev
cd app/frontend && npm run build
cd app/frontend && npm run lint

# Backend
cd app/backend && python3 main.py

# Backend tests
cd app/backend && python3 -m unittest tests.test_vault_backend
cd app/backend && python3 -m unittest tests.test_vault_backend.VaultBackendTests.test_sample_vault_bootstrap_has_ten_notes
```

There is no frontend test runner configured in `app/frontend/package.json` right now.

## High-level architecture

- `app/backend/main.py` is the backend composition root: it defines the Pydantic models, synthesizes dashboard/blueprint/planner/refinery data, seeds the demo vault, and exposes the `/api/*` routes.
- `app/backend/db.py` is the real persistence layer. Data is stored as Markdown with front matter inside the active vault. User notes live in the vault tree itself; app-owned collections live under `.thoughtcabinet/` in the vault (`tasks`, `evaluations`, `materials`, `conversations`, and `planner_feedback` once used).
- `app/backend/config_store.py` keeps runtime config in `app/data/config.json`, merges defaults, and points the app at the active vault. Backend startup bootstraps `app/vaults/sample-obsidian-vault` and `app/vaults/blank-vault`.
- `app/frontend/src/themes/neon/index.tsx` is the main frontend shell. It hydrates from `/api/workspace`, loads planner/refinery follow-up state, owns nearly all mutations, and passes data into the module pages under `src/pages/`.
- `app/frontend/src/App.tsx` and `src/context/ThemeContext.tsx` make theme selection backend-driven. `NEON` is the real integrated experience, `ZEN` is a placeholder, and the extra theme names in `src/lib/types.ts` currently fall back to the unsupported-theme screen.
- `app/frontend/src/lib/api.ts` and `src/lib/types.ts` mirror the backend contract. When an endpoint or payload changes, update both sides together. `app/openapi.yaml` is helpful context, but `app/backend/main.py` is the implementation source of truth.

## Key conventions

- Treat `app/` as the product code. `prototypes/` contains separate design experiments and is not the main integrated app unless a task explicitly targets a prototype.
- Use `MarkdownDB.create/save/ensure` for vault-backed writes instead of editing files directly. Those helpers keep front matter, timestamps, git initialization, and per-file commits consistent.
- Notes use path-based ids such as `tech/react-rendering`, and the backend routes them with `{id:path}`. New notes are created under `inbox/<slug>.md`, so do not assume flat note filenames.
- Tags are normalized to lowercase and deduplicated by `normalize_tags()`. Domains are often inferred heuristically by `infer_domain()`. Keep those helpers involved when changing note, evaluation, or refinery flows.
- The NEON load path matters: it first calls `/api/workspace`, then fetches planner board and refinery settings separately. Changes to startup data or response shapes should preserve that hydration sequence.
- Startup and tests depend on seeded sample data. `bootstrap_sample_vaults()` creates the sample vault with 10 notes plus seed tasks, evaluations, materials, and conversations, and `tests/test_vault_backend.py` asserts against that shape.
- Frontend imports assume the Vite alias `@ -> src`, and local development relies on the Vite proxy from `/api` to `http://localhost:8000`.
- `npm run lint` currently reports pre-existing hook/effect issues in `ThemeContext`, `useAsyncData`, `Blueprint`, `Refinery`, and `themes/neon`. Do not assume a failing lint run came from your change unless you touched those areas.
