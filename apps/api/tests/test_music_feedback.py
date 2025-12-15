import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from datetime import datetime
from app.services.music_service import MusicService
from app.models.music import MusicFeedbackRequest
from fastapi import HTTPException, status
from loguru import logger
from fastapi.testclient import TestClient
from app.main import app
from app.core.supabase import get_current_user_id # Import the actual dependency function

# Fixtures from previous unit tests are still valid and used for the service tests.

# --- Integration Tests for API Endpoint ---
client = TestClient(app)

# Helper to mock the get_current_user_id dependency
def override_get_current_user_id():
    return "test_user_id"

@pytest.fixture(autouse=True)
def mock_dependencies():
    app.dependency_overrides[get_current_user_id] = override_get_current_user_id
    yield
    app.dependency_overrides = {} # Clear overrides after test

@pytest.mark.asyncio
async def test_post_music_feedback_success():
    # Mock the MusicService.log_music_feedback method
    with patch("app.services.music_service.MusicService.log_music_feedback", new_callable=AsyncMock) as mock_log_music_feedback:
        feedback_payload = {
            "session_id": "session_int_123",
            "track_id": "track_int_456",
            "feedback_type": "like",
            "timestamp": datetime.now().isoformat(),
            "context": {"bpm": 125}
        }
        
        response = client.post("/api/v1/music/feedback", json=feedback_payload)
        
        assert response.status_code == 200
        assert response.json() == {"message": "Music feedback logged successfully"}
        mock_log_music_feedback.assert_called_once()
        # Verify arguments passed to the service method
        call_args, call_kwargs = mock_log_music_feedback.call_args
        assert call_args[0] == "test_user_id"
        assert isinstance(call_args[1], MusicFeedbackRequest)
        assert call_args[1].track_id == "track_int_456"

@pytest.mark.asyncio
async def test_post_music_feedback_service_failure():
    # Mock the MusicService.log_music_feedback method to raise an HTTPException
    with patch("app.services.music_service.MusicService.log_music_feedback", new_callable=AsyncMock) as mock_log_music_feedback:
        mock_log_music_feedback.side_effect = HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="Failed to log music feedback"
        )
        
        feedback_payload = {
            "session_id": "session_int_123",
            "track_id": "track_int_456",
            "feedback_type": "like",
            "timestamp": datetime.now().isoformat(),
            "context": {"bpm": 125}
        }
        
        response = client.post("/api/v1/music/feedback", json=feedback_payload)
        
        assert response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR
        assert response.json() == {"detail": "Failed to log music feedback"}
        mock_log_music_feedback.assert_called_once()

@pytest.mark.asyncio
async def test_post_music_feedback_invalid_payload():
    invalid_payload = {
        "session_id": "session_int_123",
        "feedback_type": "like",
        # Missing track_id
        "timestamp": datetime.now().isoformat(),
        "context": {"bpm": 125}
    }
    
    response = client.post("/api/v1/music/feedback", json=invalid_payload)
    
    assert response.status_code == 422 # Unprocessable Entity for Pydantic validation error
