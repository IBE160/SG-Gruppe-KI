# apps/api/tests/test_onboarding.py
import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock
from uuid import uuid4
from app.main import app
from app.models.onboarding import OnboardingData
from app.core.auth import get_current_user_id
from app.core.supabase import get_supabase_client

MOCK_USER_ID = uuid4()

@pytest.fixture
def client():
    """
    Fixture to create a TestClient with mocked dependencies.
    """
    mock_supabase = MagicMock()
    
    # Mock the chain of calls for Supabase
    mock_from_instance = MagicMock()
    mock_supabase.from_.return_value = mock_from_instance
    mock_from_instance.update.return_value.eq.return_value.execute.return_value = MagicMock(data=[])
    mock_from_instance.insert.return_value.execute.return_value = MagicMock(data=[])

    app.dependency_overrides[get_supabase_client] = lambda: mock_supabase
    app.dependency_overrides[get_current_user_id] = lambda: str(MOCK_USER_ID)
    
    with TestClient(app) as c:
        yield c
    
    app.dependency_overrides.clear()


def test_complete_onboarding_success(client):
    onboarding_data = OnboardingData(
        goal="Build Muscle",
        trainingFrequency=4,
        trainingDuration=60,
        equipment=["Dumbbells", "Full Gym"],
        unitPreference="kg"
    )

    response = client.post("/api/v1/onboarding", json=onboarding_data.model_dump())

    assert response.status_code == 201
    assert response.json() == {"message": "Onboarding data received successfully"}

    # You could add assertions here to check if the mock_supabase was called correctly
    # For example:
    mock_supabase_client = app.dependency_overrides[get_supabase_client]()
    mock_supabase_client.from_.assert_any_call('users')
    mock_supabase_client.from_.assert_any_call('goals')
    mock_supabase_client.from_.assert_any_call('equipment')


def test_complete_onboarding_missing_required_fields(client):
    onboarding_data = {"goal": "Lose Weight"}  # Missing required fields

    response = client.post("/api/v1/onboarding", json=onboarding_data)

    assert response.status_code == 422


def test_complete_onboarding_supabase_error(client):
    # Configure the mock to raise an error
    mock_supabase_client = app.dependency_overrides[get_supabase_client]()
    mock_supabase_client.from_.return_value.insert.return_value.execute.side_effect = Exception("DB Error")

    onboarding_data = OnboardingData(
        goal="Build Muscle",
        trainingFrequency=4,
        trainingDuration=60,
        equipment=["Dumbbells"],
        unitPreference="kg"
    )

    response = client.post("/api/v1/onboarding", json=onboarding_data.model_dump())

    assert response.status_code == 500
    assert "Failed to save onboarding data" in response.json()['detail']
