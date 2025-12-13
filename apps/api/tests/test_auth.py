# apps/api/tests/test_auth.py
import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock
import uuid
from app.main import app
from app.core.supabase import get_supabase_client

# This fixture will be used by all tests in this file
@pytest.fixture
def client():
    mock_supabase = MagicMock()
    
    # Use dependency_overrides to replace the real get_supabase_client
    # with a function that returns our mock.
    app.dependency_overrides[get_supabase_client] = lambda: mock_supabase
    
    with TestClient(app) as c:
        yield c
    
    # Clean up the override after the tests
    app.dependency_overrides = {}


def test_register_user_success(client):
    # Configure the mock to simulate a successful registration
    mock_supabase = app.dependency_overrides[get_supabase_client]()
    mock_supabase.auth.sign_up.return_value = MagicMock(
        user=MagicMock(id=str(uuid.uuid4()), email="test@example.com"),
        error=None
    )

    response = client.post("/api/v1/register", json={"email": "test@example.com", "password": "Password123!"})
    
    assert response.status_code == 201
    assert response.json()["email"] == "test@example.com"
    mock_supabase.auth.sign_up.assert_called_once()


def test_register_user_failure_invalid_input(client):
    # This test does not need the mock, it's testing Pydantic validation
    response = client.post("/api/v1/register", json={"email": "invalid-email", "password": "123"})
    assert response.status_code == 422

def test_register_user_failure_service_error(client):
    # Configure the mock to simulate a registration error
    mock_supabase = app.dependency_overrides[get_supabase_client]()
    mock_supabase.auth.sign_up.return_value = MagicMock(
        user=None,
        error=MagicMock(message="User already registered")
    )

    response = client.post("/api/v1/register", json={"email": "existing@example.com", "password": "Password123!"})
    
    assert response.status_code == 400
    assert "User already registered" in response.json()["detail"]["error"]["message"]
    mock_supabase.auth.sign_up.assert_called_once()


def test_login_user_success(client):
    # Configure the mock to simulate a successful login
    mock_supabase = app.dependency_overrides[get_supabase_client]()
    mock_supabase.auth.sign_in_with_password.return_value = MagicMock(
        session=MagicMock(access_token="mock_access_token"),
        error=None
    )

    response = client.post("/api/v1/login", json={"email": "test@example.com", "password": "Password123!"})
    
    assert response.status_code == 200
    assert response.json()["access_token"] == "mock_access_token"
    mock_supabase.auth.sign_in_with_password.assert_called_once()


def test_login_user_failure_invalid_credentials(client):
    # Configure the mock to simulate a login error
    mock_supabase = app.dependency_overrides[get_supabase_client]()
    mock_supabase.auth.sign_in_with_password.return_value = MagicMock(
        session=None,
        error=MagicMock(message="Invalid login credentials")
    )
    
    response = client.post("/api/v1/login", json={"email": "wrong@example.com", "password": "WrongPassword!"})
    
    assert response.status_code == 401
    assert "Invalid login credentials" in response.json()["detail"]["error"]["message"]
    mock_supabase.auth.sign_in_with_password.assert_called_once()