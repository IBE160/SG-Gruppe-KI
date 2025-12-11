import pytest
from fastapi.testclient import TestClient # Import TestClient
from main import app # Assuming main.py is in the apps/api directory
from app.api.auth import get_current_user_id # Import the actual dependency

# Mock the get_current_user_id dependency for testing
# This ensures tests can run without actual authentication
def override_get_current_user_id():
    return "test_user_id_123"

app.dependency_overrides[get_current_user_id] = override_get_current_user_id

@pytest.fixture(scope="module")
def client(): # TestClient is synchronous
    with TestClient(app) as c:
        yield c

def test_read_current_user(client: TestClient):
    response = client.get("/api/v1/me")
    assert response.status_code == 200
    assert response.json() == {"user_id": "test_user_id_123", "email": "user@example.com", "unit_preference": "kg", "primary_goal": "Build Muscle", "training_frequency": 4, "training_duration": 60, "injuries_limitations": "None", "equipment": ["Dumbbells", "Barbell"]}

def test_update_current_user(client: TestClient):
    update_data = {
        "unit_preference": "lbs",
        "primary_goal": "Lose Weight",
        "training_frequency": 3,
        "training_duration": 45,
        "injuries_limitations": "Lower back pain",
        "equipment": ["Resistance Bands"]
    }
    response = client.put("/api/v1/me", json=update_data)
    assert response.status_code == 200
    assert response.json()["message"] == "User test_user_id_123 profile updated successfully"
    assert response.json()["updated_data"] == update_data

def test_update_current_user_partial(client: TestClient):
    update_data = {
        "unit_preference": "lbs",
    }
    response = client.put("/api/v1/me", json=update_data)
    assert response.status_code == 200
    assert response.json()["message"] == "User test_user_id_123 profile updated successfully"
    assert response.json()["updated_data"]["unit_preference"] == "lbs"
