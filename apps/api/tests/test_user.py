# apps/api/tests/test_user.py
import pytest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock
from uuid import UUID, uuid4
import json

from app.main import app
from app.services.user_service import UserService
from app.models.user import UserProfileData, UserProfileUpdate
from app.core.auth import get_current_user_id

# Create a TestClient for your FastAPI application
client = TestClient(app)

# Mock data
MOCK_USER_ID = uuid4()
MOCK_USER_EMAIL = "test@example.com"
MOCK_USER_PROFILE = UserProfileData(
    id=MOCK_USER_ID,
    email=MOCK_USER_EMAIL,
    unit_preference="kg",
    primary_goal="Build Muscle",
    training_frequency=4,
    training_duration=60,
    injuries_limitations="None",
    equipment=["Dumbbells"],
)

@pytest.fixture
def mock_get_current_user_id():
    """
    Fixture to mock get_current_user_id dependency.
    """
    app.dependency_overrides[get_current_user_id] = lambda: MOCK_USER_ID
    yield
    app.dependency_overrides.clear()

@pytest.fixture
def mock_user_service(mocker):
    """
    Fixture to mock the UserService dependency.
    """
    mock_service_instance = mocker.Mock(spec=UserService)
    mock_service_instance.get_user_profile = AsyncMock(return_value=MOCK_USER_PROFILE)
    mock_service_instance.update_user_profile = AsyncMock(return_value=MOCK_USER_PROFILE)

    app.dependency_overrides[UserService] = lambda: mock_service_instance
    yield mock_service_instance
    app.dependency_overrides.clear()

def test_get_user_profile_success(mock_get_current_user_id, mock_user_service):
    """
    Test successful retrieval of user profile.
    """
    response = client.get("/api/v1/users/me")

    assert response.status_code == 200
    # Pydantic v2 .model_dump() serializes UUID to a UUID object, not a string by default.
    # The HTTP response JSON will always have a string. We need to compare JSON-like dicts.
    # A simple way is to load the dumped json string back into a dict.
    assert response.json() == json.loads(MOCK_USER_PROFILE.model_dump_json())
    mock_user_service.get_user_profile.assert_called_once_with(MOCK_USER_ID)

def test_get_user_profile_not_found(mock_get_current_user_id, mock_user_service):
    """
    Test user profile not found.
    """
    mock_user_service.get_user_profile.return_value = None
    response = client.get("/api/v1/users/me")

    assert response.status_code == 404
    assert response.json()["detail"] == "User profile not found"

def test_get_user_profile_unauthenticated():
    """
    Test retrieval of user profile without authentication.
    """
    if get_current_user_id in app.dependency_overrides:
        del app.dependency_overrides[get_current_user_id]
    
    response = client.get("/api/v1/users/me")

    assert response.status_code == 401
    app.dependency_overrides[get_current_user_id] = lambda: MOCK_USER_ID


def test_update_user_profile_success(mock_get_current_user_id, mock_user_service):
    """
    Test successful update of user profile.
    """
    update_data = UserProfileUpdate(unit_preference="lbs", primary_goal="Lose Weight")
    
    updated_profile_data = MOCK_USER_PROFILE.model_dump()
    updated_profile_data['unit_preference'] = "lbs"
    updated_profile_data['primary_goal'] = "Lose Weight"
    
    mock_user_service.update_user_profile.return_value = UserProfileData(**updated_profile_data)

    response = client.put("/api/v1/users/me", json=update_data.model_dump())

    assert response.status_code == 200
    assert response.json()["unit_preference"] == "lbs"
    assert response.json()["primary_goal"] == "Lose Weight"
    mock_user_service.update_user_profile.assert_called_once_with(MOCK_USER_ID, update_data)

def test_update_user_profile_validation_error(mock_get_current_user_id):
    """
    Test update of user profile with invalid data.
    """
    invalid_data = {"unit_preference": "invalid_unit"}
    response = client.put("/api/v1/users/me", json=invalid_data)

    assert response.status_code == 422
    assert "detail" in response.json()
    assert "unit_preference" in response.json()["detail"][0]["loc"]
