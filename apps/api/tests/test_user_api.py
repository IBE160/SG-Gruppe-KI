# apps/api/tests/test_user_api.py
import pytest
from fastapi.testclient import TestClient
from uuid import uuid4, UUID
from app.main import app
from app.core.auth import get_current_user_id
from app.models.user import UserProfileData

MOCK_USER_ID = uuid4()

@pytest.fixture
def client():
    """
    Fixture to create a TestClient with a mocked user dependency.
    """
    def override_get_current_user_id():
        return MOCK_USER_ID

    app.dependency_overrides[get_current_user_id] = override_get_current_user_id
    
    with TestClient(app) as c:
        yield c
    
    app.dependency_overrides.clear()

# This is a simplified mock response, now as a Pydantic model
mock_user_profile_model = UserProfileData(
    id=MOCK_USER_ID,
    email="user@example.com",
    unit_preference="kg",
    primary_goal="Build Muscle",
    training_frequency=4,
    training_duration=60,
    injuries_limitations="None",
    equipment=["Dumbbells", "Barbell"]
)

def test_read_current_user(client: TestClient, mocker):
    # We also need to mock the service layer that the endpoint calls
    mocker.patch(
        "app.api.user.UserService.get_user_profile",
        return_value=mock_user_profile_model
    )
    response = client.get("/api/v1/users/me")
    assert response.status_code == 200
    assert response.json()["id"] == str(MOCK_USER_ID)

def test_update_current_user(client: TestClient, mocker):
    update_data = {
        "unit_preference": "lbs",
        "primary_goal": "Lose Weight",
    }
    # Create a new model for the updated response
    updated_model = mock_user_profile_model.model_copy(update=update_data)

    # Mock the service layer's update method
    mocker.patch(
        "app.api.user.UserService.update_user_profile",
        return_value=updated_model
    )
    response = client.put("/api/v1/users/me", json=update_data)
    assert response.status_code == 200
    assert response.json()["unit_preference"] == "lbs"

def test_update_current_user_partial(client: TestClient, mocker):
    update_data = {"unit_preference": "lbs"}
    updated_model = mock_user_profile_model.model_copy(update=update_data)
    
    mocker.patch(
        "app.api.user.UserService.update_user_profile",
        return_value=updated_model
    )
    response = client.put("/api/v1/users/me", json=update_data)
    assert response.status_code == 200
    assert response.json()["unit_preference"] == "lbs"