# apps/api/tests/test_user.py

import pytest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, patch, MagicMock
from main import app
from app.models.user import UserProfileUpdate, GoalCreate, EquipmentCreate
from app.api.user import FullUserProfile, UserProfile, Goal, Equipment

client = TestClient(app)

# Mock the Supabase client and its methods for user service tests
@pytest.fixture
def mock_user_supabase_client():
    with patch('app.core.supabase.supabase') as mock_supabase:
        # Mock for select operations (GET /users/me)
        mock_supabase.from_.return_value.select.return_value.eq.return_value.limit.return_value.execute.return_value = AsyncMock(
            data=[{'id': 'test-user-id', 'email': 'test@example.com', 'unit_preference': 'kg'}], count=1
        )
        mock_supabase.from_.return_value.select.return_value.eq.return_value.execute.side_effect = [
            # First call for goals
            AsyncMock(data=[
                {'id': 'goal-1', 'user_id': 'test-user-id', 'primary_goal': 'Build Muscle', 'training_frequency': 4, 'training_duration': 60, 'injuries_limitations': None, 'created_at': '2023-01-01T00:00:00Z'}
            ], count=1),
            # Second call for equipment
            AsyncMock(data=[
                {'id': 'eq-1', 'user_id': 'test-user-id', 'name': 'Dumbbells'}
            ], count=1)
        ]

        # Mock for update operations (PUT /users/me)
        mock_supabase.from_.return_value.update.return_value.eq.return_value.execute.return_value = AsyncMock(
            data=[{'id': 'test-user-id', 'email': 'test@example.com', 'unit_preference': 'lbs'}], count=1
        )
        yield mock_supabase

# Mock the get_current_user_id dependency
@pytest.fixture
def mock_get_current_user_id():
    with patch('app.api.auth.get_current_user_id', new_callable=AsyncMock) as mock_user_id:
        mock_user_id.return_value = "test-user-id"
        yield mock_user_id

# --- GET /users/me Tests ---
def test_get_current_user_profile_success(mock_user_supabase_client, mock_get_current_user_id):
    response = client.get("/api/v1/users/me")

    assert response.status_code == 200
    profile_data = FullUserProfile(**response.json())
    assert profile_data.id == "test-user-id"
    assert profile_data.email == "test@example.com"
    assert profile_data.unit_preference == "kg"
    assert len(profile_data.goals) == 1
    assert profile_data.goals[0].primary_goal == "Build Muscle"
    assert len(profile_data.equipment) == 1
    assert profile_data.equipment[0].name == "Dumbbells"

    # Verify Supabase calls
    mock_user_supabase_client.from_.assert_any_call('users')
    mock_user_supabase_client.from_.assert_any_call('goals')
    mock_user_supabase_client.from_.assert_any_call('equipment')


def test_get_current_user_profile_not_found(mock_user_supabase_client, mock_get_current_user_id):
    # Simulate user not found
    mock_user_supabase_client.from_.return_value.select.return_value.eq.return_value.limit.return_value.execute.return_value = AsyncMock(data=[], count=0)
    
    response = client.get("/api/v1/users/me")
    assert response.status_code == 404
    assert response.json()["detail"] == "User profile not found"

# --- PUT /users/me Tests ---
def test_update_current_user_profile_success(mock_user_supabase_client, mock_get_current_user_id):
    update_data = UserProfileUpdate(unit_preference="lbs")
    response = client.put("/api/v1/users/me", json=update_data.model_dump())

    assert response.status_code == 200
    updated_profile = FullUserProfile(**response.json())
    assert updated_profile.unit_preference == "lbs"

    # Verify Supabase update call
    mock_user_supabase_client.from_.assert_any_call('users')
    mock_user_supabase_client.from_.return_value.update.assert_called_once_with({'unit_preference': 'lbs'})
    mock_user_supabase_client.from_.return_value.update.return_value.eq.assert_called_once_with('id', 'test-user-id')


def test_update_current_user_profile_not_found_after_update(mock_user_supabase_client, mock_get_current_user_id):
    # Simulate user not found after update (e.g., if re-fetch fails)
    mock_user_supabase_client.from_.return_value.update.return_value.eq.return_value.execute.return_value = AsyncMock(data=[{'id': 'test-user-id', 'email': 'test@example.com', 'unit_preference': 'lbs'}], count=1)
    
    # Simulate get_user_profile returning None after an attempted update
    with patch('app.services.user_service.UserService.get_user_profile', new_callable=AsyncMock) as mock_get_profile:
        mock_get_profile.return_value = None
        update_data = UserProfileUpdate(unit_preference="lbs")
        response = client.put("/api/v1/users/me", json=update_data.model_dump())

        assert response.status_code == 404
        assert response.json()["detail"] == "User profile not found after update attempt"
