import pytest
from fastapi import HTTPException, status
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, MagicMock, patch
from loguru import logger

from app.services.music_service import MusicService
from app.core.config import settings


@pytest.fixture
def mock_music_service():
    with patch("app.api.music.music_service", autospec=True) as mock_service:
        yield mock_service

@pytest.fixture
def mock_settings():
    with patch("app.services.music_service.settings", autospec=True) as mock_set:
        mock_set.SPOTIPY_CLIENT_ID = "test_client_id"
        mock_set.SPOTIPY_CLIENT_SECRET = "test_client_secret"
        mock_set.SPOTIPY_REDIRECT_URI = "http://localhost:8000/api/v1/music/callback/spotify"
        mock_set.SPOTIPY_SCOPE = "test-scope"
        yield mock_set

@pytest.fixture
def mock_music_service_instance(mock_settings):
    # This fixture provides an actual instance of MusicService with mocked settings
    # Useful for testing internal logic of MusicService if not mocking the entire class
    return MusicService()

def test_connect_spotify_redirects(client: TestClient, mock_music_service: MagicMock):
    """
    Test that the /music/connect/spotify endpoint redirects to Spotify's auth URL.
    """
    # Debug: Print all registered routes in the app instance used by the client
    logger.info("--- Registered routes in test client app ---")
    for route in client.app.routes:
        if hasattr(route, "path") and hasattr(route, "methods"):
            logger.info(f"Test App Registered route: {route.methods if hasattr(route, 'methods') else 'N/A'} {route.path}")
    logger.info("------------------------------------------")

    mock_music_service.get_auth_url.return_value = {
        "auth_url": "https://accounts.spotify.com/authorize?test=true",
        "code_verifier": "test_code_verifier"
    }

    response = client.get("/api/v1/music/connect/spotify") # Correct URL without trailing slash
    logger.info(f"Response URL: {response.url}")
    logger.info(f"Request URL: {response.request.url}")

    assert response.status_code == 200  # Expect 200 OK for JSON response
    response_json = response.json()
    assert "auth_url" in response_json
    assert "code_verifier" in response_json
    assert "https://accounts.spotify.com/authorize?test=true&code_verifier=test_code_verifier" == response_json["auth_url"]
    assert "test_code_verifier" == response_json["code_verifier"]
    mock_music_service.get_auth_url.assert_called_once()


def test_spotify_callback_success(client: TestClient, mock_music_service: MagicMock):
    """
    Test a successful Spotify callback, exchanging code for tokens.
    """
    mock_music_service.exchange_code_for_tokens.return_value = {
        "access_token": "mock_access_token",
        "refresh_token": "mock_refresh_token",
        "expires_in": 3600,
        "scope": "test-scope"
    }

    response = client.get("/api/v1/music/callback/spotify?code=test_code&code_verifier=test_code_verifier")

    assert response.status_code == 200
    assert response.json() == {
        "message": "Spotify connection successful",
        "access_token": "mock_access_token"
    }
    mock_music_service.exchange_code_for_tokens.assert_called_once_with("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11", "test_code", "test_code_verifier")

def test_spotify_callback_missing_code_verifier(client: TestClient):
    """
    Test that callback fails if code_verifier is missing.
    """
    response = client.get("/api/v1/music/callback/spotify?code=test_code")

    assert response.status_code == 400
    assert "Code verifier missing" in response.json()["detail"]


def test_spotify_callback_exchange_failure(client: TestClient, mock_music_service: MagicMock):
    """
    Test callback when token exchange with Spotify fails.
    """
    mock_music_service.exchange_code_for_tokens.side_effect = HTTPException(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Spotify token exchange failed"
    )

    response = client.get("/api/v1/music/callback/spotify?code=test_code&code_verifier=test_code_verifier")

    assert response.status_code == 503
    assert "Spotify token exchange failed" in response.json()["detail"]
    mock_music_service.exchange_code_for_tokens.assert_called_once_with("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11", "test_code", "test_code_verifier")
