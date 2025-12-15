import pytest
from fastapi import HTTPException, status
from fastapi.testclient import TestClient
from unittest.mock import MagicMock, patch
from uuid import uuid4
from datetime import datetime
import json # Import json

from app.main import app
from app.models.workout_log import WorkoutLogCreate, WorkoutLogResponse
from app.services.log_service import LogService
from app.core.supabase import get_current_user_id

client = TestClient(app)

# Helper to mock the get_current_user_id dependency
def override_get_current_user_id():
    return uuid4() # Return a consistent UUID for testing

@pytest.fixture(autouse=True)
def mock_dependencies():
    app.dependency_overrides[get_current_user_id] = override_get_current_user_id
    yield
    app.dependency_overrides = {} # Clear overrides after test

@pytest.fixture
def mock_log_service():
    with patch("app.api.logs.log_service", autospec=True) as mock_service:
        yield mock_service

@pytest.mark.asyncio
async def test_bulk_log_workout_sets_success(mock_log_service):
    user_id = override_get_current_user_id()
    mock_log_service.create_bulk_log_entries.return_value = [
        WorkoutLogResponse(
            id=uuid4(),
            user_id=user_id,
            plan_id=None,
            completed_at=datetime.utcnow(),
            exercise_name="Squat",
            set_number=1,
            actual_reps=10,
            actual_weight=100.0,
            rpe=8.0
        )
    ]

    log_entries = [
        WorkoutLogCreate(
            exercise_name="Squat",
            set_number=1,
            actual_reps=10,
            actual_weight=100.0,
            rpe=8.0,
            id=uuid4(),
            completed_at=datetime.utcnow()
        )
    ]

    response = client.post("/api/v1/logs/bulk", json=[json.loads(entry.model_dump_json()) for entry in log_entries]) # Send as JSON strings
    
    assert response.status_code == 201
    assert mock_log_service.create_bulk_log_entries.called
    assert response.json()[0]["exercise_name"] == "Squat"

@pytest.mark.asyncio
async def test_bulk_log_workout_sets_service_failure(mock_log_service):
    # Create a mock that raises HTTPException when called
    mock_create_bulk = MagicMock(side_effect=HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail="Failed to create bulk workout log entries."
    ))
    mock_log_service.create_bulk_log_entries = mock_create_bulk

    log_entries = [
        WorkoutLogCreate(
            exercise_name="Squat",
            set_number=1,
            actual_reps=10,
            actual_weight=100.0,
            rpe=8.0,
            id=uuid4(),
            completed_at=datetime.utcnow()
        )
    ]

    response = client.post("/api/v1/logs/bulk", json=[json.loads(entry.model_dump_json()) for entry in log_entries])    
    assert response.status_code == 500
    assert response.json()["detail"] == "Failed to create bulk workout log entries."
    assert mock_log_service.create_bulk_log_entries.called
