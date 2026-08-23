"""Runtime settings for the api service.

Read from the process environment only. No .env file is read by the application;
`.env.example` documents the variables for humans and for `uv run --env-file`.
"""

from functools import lru_cache
from typing import Literal

from pydantic import DirectoryPath
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=None, extra="ignore", frozen=True)

    app_env: Literal["dev", "staging", "prod"] = "dev"
    log_level: Literal["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"] = "INFO"

    # Directory holding crop, language and region packs, read at runtime.
    # Required: the api cannot be ready without its packs. Packs are never imported as code.
    # The pack loader is not yet implemented; only the directory's existence is checked.
    packs_dir: DirectoryPath


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Load and cache settings. Raises pydantic.ValidationError if the environment is invalid."""
    return Settings()
