# inference service

One of the two Cloud Run services decided in `docs/adr/0004-backend-stack.md`.
Python 3.12 · FastAPI · `uv` · dev port **8081**.

## Owns

- **Image analysis** — turning a crop image into structured observations. Model-backed
  first; progressively replaced by deterministic computer vision inside `pipeline/`
  (ADR 0004 Consequences). Own scaling profile and resource ceiling, so a slow or
  CPU-bound request never holds a connection on the `api` service.

## Must never own

- Identity, sessions, quota, entitlements, or consent — `api` owns those.
- Pack loading or pack authoring. Packs are read by `api`.
- Writes to the farm graph.
- The diagnosis *decision*. This service produces observations; ranking hypotheses and
  stating confidence is an agent's job, sequenced by the orchestrator in `api`.
- Imports from `backend/api/`. The two services share nothing but the language.
- Provider SDK calls outside a `gateways/` boundary. No provider SDK is installed here yet;
  which `gateways/` package serves this service is not yet decided (see `pipeline/README.md`).

Scaffold status: health checks and structure only. No OpenCV, no ML dependency, no model call.

## Run

```
cd backend/inference
uv sync                                    # creates .venv with runtime + dev deps
cp .env.example .env                       # then edit; .env is git-ignored
uv run --env-file .env uvicorn app.main:app --port 8081 --reload
```

- `GET /healthz` → `{"status":"ok"}` — liveness, no dependencies.
- `GET /readyz`  → `{"status":"ready",...}` or `503 {"status":"not_ready",...}` — settings valid.

## Check

```
uv run ruff format --check . && uv run ruff check . && uv run mypy && uv run pytest
```

## Container

```
docker build -t krishitech-inference .
docker run --rm -p 8081:8080 krishitech-inference
```

Logs are one JSON object per line on stdout; every request produces exactly one line.
