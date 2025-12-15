
import pytest
from fastapi import HTTPException, status
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from apps.api.app.main import app # Import the main app to test the router
from app.api.export import router # Import the router directly for dependency override
from app.dependencies.auth_middleware import get_current_user_id

client = TestClient(app)

# Mock get_current_user_id to return a fixed user ID for testing
async def mock_get_current_user_id():
    return "test_user_id"

# Override the dependency for testing
app.dependency_overrides[get_current_user_id] = mock_get_current_user_id

@pytest.fixture
def mock_supabase_client():
    with patch('app.api.export.get_supabase_client') as mock_get_client:
        mock_supabase = MagicMock()
        mock_get_client.return_value = mock_supabase
        yield mock_supabase

async def test_request_data_export_success(mock_supabase_client):
    # Mock Supabase responses for each table
    mock_supabase_client.from_.return_value.select.return_value.eq.return_value.single.return_value.execute.return_value.data = {"id": "test_user_id", "email": "test@example.com"}
    mock_supabase_client.from_.return_value.select.return_value.eq.return_value.execute.side_effect = [
        MagicMock(data=[{"goal": "build muscle"}]), # Goals
        MagicMock(data=[{"name": "dumbbells"}]),    # Equipment
        MagicMock(data=[{"workout": "legs", "duration": 60}]), # WorkoutLogs
    ]

    response = client.post("/api/v1/users/me/export")

    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {
        "data": {
            "message": "Data export initiated.",
            "exported_data": {
                "user_profile": {"id": "test_user_id", "email": "test@example.com"},
                "user_goals": [{"goal": "build muscle"}],
                "user_equipment": [{"name": "dumbbells"}],
                "user_workout_logs": [{"workout": "legs", "duration": 60}],
            }
        }
    }
    # Verify Supabase calls
    mock_supabase_client.from_.assert_any_call("Users")
    mock_supabase_client.from_.assert_any_call("Goals")
    mock_supabase_client.from_.assert_any_call("Equipment")
    mock_supabase_client.from_.assert_any_call("WorkoutLogs")


async def test_request_data_export_supabase_error(mock_supabase_client):
    mock_supabase_client.from_.return_value.select.return_value.eq.return_value.single.return_value.execute.side_effect = Exception("Supabase connection error")

    response = client.post("/api/v1/users/me/export")

    assert response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR
    assert response.json() == {"detail": "Failed to initiate data export."}

async def test_request_data_export_unauthenticated():
    # Temporarily remove dependency override to test unauthenticated access
    del app.dependency_overrides[get_current_user_id]
    
    response = client.post("/api/v1/users/me/export")
    
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json()["detail"] == "Not authenticated"

    # Restore override for other tests
    app.dependency_overrides[get_current_user_id] = mock_get_current_user_id
