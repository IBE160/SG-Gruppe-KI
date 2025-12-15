
import pytest
from fastapi import HTTPException, status
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from apps.api.app.main import app # Import the main app to test the router
from app.dependencies.auth_middleware import get_current_user_id

client = TestClient(app)

# Mock get_current_user_id to return a fixed user ID for testing
async def mock_get_current_user_id():
    return "test_user_id_to_delete"

# Override the dependency for testing delete_account
# This needs to be done directly on the app instance being tested
app.dependency_overrides[get_current_user_id] = mock_get_current_user_id

@pytest.fixture
def mock_admin_supabase_client():
    with patch('app.api.auth.get_admin_supabase_client') as mock_get_admin_client:
        mock_supabase_admin = MagicMock()
        mock_get_admin_client.return_value = mock_supabase_admin
        yield mock_supabase_admin

async def test_delete_account_success(mock_admin_supabase_client):
    # Mock successful deletion responses
    mock_admin_supabase_client.from_.return_value.delete.return_value.eq.return_value.execute.return_value.error = None
    mock_admin_supabase_client.auth.admin.delete_user.return_value.error = None

    response = client.delete("/api/v1/users/me")

    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {
        "data": {
            "message": "Account deletion process started. All associated data will be purged as per GDPR."
        }
    }
    # Verify calls to delete associated data
    mock_admin_supabase_client.from_.assert_any_call("Goals")
    mock_admin_supabase_client.from_.assert_any_call("WorkoutLogs")
    mock_admin_supabase_client.from_.assert_any_call("Equipment")
    # Verify call to delete user from Supabase Auth
    mock_admin_supabase_client.auth.admin.delete_user.assert_called_with("test_user_id_to_delete")

async def test_delete_account_failure_goals_deletion(mock_admin_supabase_client):
    mock_admin_supabase_client.from_.return_value.delete.return_value.eq.return_value.execute.side_effect = [
        MagicMock(error=MagicMock(message="Failed to delete goals")), # Goals deletion fails
        MagicMock(error=None), # Subsequent deletions would succeed if reached
        MagicMock(error=None)
    ]
    mock_admin_supabase_client.auth.admin.delete_user.return_value.error = None

    response = client.delete("/api/v1/users/me")

    assert response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR
    assert response.json() == {"detail": "Failed to delete associated goals."}
    assert mock_admin_supabase_client.from_.call_args_list[0].args[0] == "Goals" # Ensure goals was attempted first

async def test_delete_account_failure_user_auth_deletion(mock_admin_supabase_client):
    mock_admin_client_response = MagicMock()
    mock_admin_client_response.error = MagicMock(message="Supabase auth error")
    mock_admin_supabase_client.from_.return_value.delete.return_value.eq.return_value.execute.return_value.error = None # Data deletion succeeds
    mock_admin_supabase_client.auth.admin.delete_user.return_value = mock_admin_client_response # User deletion fails

    response = client.delete("/api/v1/users/me")

    assert response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR
    assert response.json() == {"detail": "Failed to delete user from authentication system."}
    mock_admin_supabase_client.auth.admin.delete_user.assert_called_with("test_user_id_to_delete")

async def test_delete_account_unauthenticated():
    # Temporarily remove dependency override to test unauthenticated access
    del app.dependency_overrides[get_current_user_id]
    
    response = client.delete("/api/v1/users/me")
    
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json()["detail"] == "Authorization header missing or malformed"

    # Restore override for other tests
    app.dependency_overrides[get_current_user_id] = mock_get_current_user_id
