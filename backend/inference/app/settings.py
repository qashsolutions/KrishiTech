"""Runtime settings for the inference service.

Read from the process environment only. No .env file is read by the application;
`.env.example` documents the variables for humans and for `uv run --env-file`.
"""

from functools import lru_cache
from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=None, extra="ignore", frozen=True)

    app_env: Literal["dev", "staging", "prod"] = "dev"
    log_level: Literal["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"] = "INFO"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Load and cache settings. Raises pydantic.ValidationError if the environment is invalid."""
    return Settings()
