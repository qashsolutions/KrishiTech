from collections.abc import Iterator
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.settings import get_settings


@pytest.fixture(autouse=True)
def _fresh_settings() -> Iterator[None]:
    get_settings.cache_clear()
    yield
    get_settings.cache_clear()


def test_healthz_ok_without_any_config(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.delenv("PACKS_DIR", raising=False)
    with TestClient(app) as client:
        response = client.get("/healthz")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_readyz_ready_when_settings_load(monkeypatch: pytest.MonkeyPatch, tmp_path: Path) -> None:
    monkeypatch.setenv("PACKS_DIR", str(tmp_path))
    with TestClient(app) as client:
        response = client.get("/readyz")
    assert response.status_code == 200
    assert response.json()["status"] == "ready"


def test_readyz_not_ready_without_packs_dir(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.delenv("PACKS_DIR", raising=False)
    with TestClient(app) as client:
        response = client.get("/readyz")
    assert response.status_code == 503
    body = response.json()
    assert body["status"] == "not_ready"
    assert [e["field"] for e in body["errors"]] == ["packs_dir"]
