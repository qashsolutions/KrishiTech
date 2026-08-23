# api service

One of the two Cloud Run services decided in `docs/adr/0004-backend-stack.md`.
Python 3.12 · FastAPI · `uv` · dev port **8080**.

## Owns

- **Orchestration** — the HTTP entry point that sequences agents for a case.
- **Quota** — slot accounting and entitlement checks.
- **Identity** — phone-as-person sessions and the number-change flow.
- **Packs** — reads crop, language and region packs at runtime from `PACKS_DIR`.
  Packs are data on disk, never an importable package. The loader is not yet implemented.
- **Provider access** — every external provider SDK call, inside `gateways/` only.

## Must never own

- Image analysis or any model-backed inference. That is the `inference` service; a slow
  inference request must never hold a connection on the service that serves login and quota.
- Imports from `backend/inference/`. The two services share nothing but the language.
- Provider SDK calls outside `gateways/`.
- Hardcoded crops, languages, regions or brands — those come from packs and `input-match`.

Scaffold status: health checks and structure only. No pack loading, no auth, no database.

## Run

```
cd backend/api
uv sync                                    # creates .venv with runtime + dev deps
cp .env.example .env                       # then edit; .env is git-ignored
uv run --env-file .env uvicorn app.main:app --port 8080 --reload
```

- `GET /healthz` → `{"status":"ok"}` — liveness, no dependencies.
- `GET /readyz`  → `{"status":"ready",...}` or `503 {"status":"not_ready",...}` — settings valid, `PACKS_DIR` exists.

## Check

```
uv run ruff format --check . && uv run ruff check . && uv run mypy && uv run pytest
```

## Container

```
docker build -t krishitech-api .
docker run --rm -p 8080:8080 -e PACKS_DIR=/packs -v "$PWD/../../packs:/packs:ro" krishitech-api
```

Logs are one JSON object per line on stdout; every request produces exactly one line.
