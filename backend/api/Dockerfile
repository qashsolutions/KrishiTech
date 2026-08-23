# syntax=docker/dockerfile:1
# KrishiTech api service — Cloud Run image (ADR 0004).

# --- Build stage: uv resolves and installs the locked runtime dependencies only. ---
FROM ghcr.io/astral-sh/uv:0.12.5 AS uv
FROM python:3.12-slim-bookworm AS builder
COPY --from=uv /uv /uvx /bin/
ENV UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy \
    UV_PYTHON_DOWNLOADS=0
WORKDIR /srv
COPY pyproject.toml uv.lock ./
RUN uv sync --locked --no-dev
COPY app ./app
COPY gateways ./gateways

# --- Runtime stage: no uv, no dev dependencies, non-root user. ---
FROM python:3.12-slim-bookworm
RUN groupadd --system app \
    && useradd --system --gid app --home-dir /srv --shell /usr/sbin/nologin app
WORKDIR /srv
COPY --from=builder --chown=app:app /srv /srv
ENV PATH="/srv/.venv/bin:$PATH" \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8080
USER app
EXPOSE 8080
# Cloud Run injects $PORT; shell form is needed to expand it. exec keeps uvicorn as PID 1.
CMD ["sh", "-c", "exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT}"]
