"""FastAPI application for the api service. Structure and health checks only."""

import logging

from fastapi import FastAPI
from fastapi.responses import JSONResponse
from pydantic import ValidationError

from app.logging_setup import RequestLogMiddleware, configure_logging
from app.settings import get_settings

SERVICE = "api"
log = logging.getLogger(SERVICE)


def _settings_errors(exc: ValidationError) -> list[dict[str, str]]:
    # Field and message only — never echo input values, which may be secrets.
    return [
        {"field": ".".join(str(part) for part in err["loc"]), "msg": err["msg"]}
        for err in exc.errors()
    ]


def create_app() -> FastAPI:
    configure_logging()
    app = FastAPI(title="KrishiTech api", version="0.1.0")
    app.add_middleware(RequestLogMiddleware, logger=log)

    try:
        settings = get_settings()
    except ValidationError as exc:
        # Liveness must not depend on config; readiness will report the problem.
        log.warning(
            "settings invalid; /readyz will report not_ready",
            extra={"service": SERVICE, "errors": _settings_errors(exc)},
        )
    else:
        logging.getLogger().setLevel(settings.log_level)
        log.info("startup", extra={"service": SERVICE, "env": settings.app_env})

    @app.get("/healthz")
    async def healthz() -> dict[str, str]:
        """Liveness. No dependencies, no config."""
        return {"status": "ok"}

    @app.get("/readyz")
    async def readyz() -> JSONResponse:
        """Readiness. Settings load from the environment and PACKS_DIR exists."""
        try:
            settings = get_settings()
        except ValidationError as exc:
            return JSONResponse(
                status_code=503,
                content={
                    "status": "not_ready",
                    "reason": "settings invalid",
                    "errors": _settings_errors(exc),
                },
            )
        return JSONResponse({"status": "ready", "service": SERVICE, "env": settings.app_env})

    return app


app = create_app()
