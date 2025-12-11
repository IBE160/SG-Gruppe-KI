# apps/api/tests/test_auth.py
import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from main import app # Assuming your main FastAPI app instance is named 'app' in main.py
import os

# Create a TestClient instance for your FastAPI application
client = TestClient(app)

# Mock environment variables for testing purposes
@pytest.fixture(autouse=True)
def mock_env_vars():
    with patch.dict(os.environ, {
        "SUPABASE_URL": "http://mock-supabase.com",
        "SUPABASE_SERVICE_ROLE_KEY": "mock-service-role-key",
        "SUPABASE_JWT_SECRET": "mock-jwt-secret", # This must match what verify_jwt expects
        "SUPABASE_ANON_KEY": "mock-anon-key",
    }):
        yield

# Fixture to mock the globally instantiated auth_service object
@pytest.fixture
def mock_auth_service_instance():
    with patch("app.api.auth.auth_service", autospec=True) as mock_service:
        # Configure the mock service's methods
        mock_service.register_user.return_value = MagicMock(id="mock-user-id", email="test@example.com")
        mock_service.login_user.return_value = MagicMock(access_token="mock-access-token", refresh_token="mock-refresh-token")
        yield mock_service

# Mock the verify_jwt dependency for testing protected routes
@pytest.fixture
def mock_verify_jwt_dependency():
    with patch("app.api.auth.verify_jwt", autospec=True) as mock_dependency:
        mock_dependency.return_value = {"user_id": "mock-verified-user-id"}
        yield mock_dependency


def test_register_user_success(mock_auth_service_instance):
    response = client.post("/api/v1/auth/register", json={"email": "test@example.com", "password": "Password123!"})
    assert response.status_code == 200
    assert response.json()["data"]["user"]["email"] == "test@example.com"
    mock_auth_service_instance.register_user.assert_called_once_with("test@example.com", "Password123!")

def test_register_user_failure_invalid_input():
    response = client.post("/api/v1/auth/register", json={"email": "invalid-email", "password": "123"})
    assert response.status_code == 422 # Pydantic validation error

def test_register_user_failure_supabase_error(mock_auth_service_instance):
    # Simulate a Supabase error from auth_service
    mock_auth_service_instance.register_user.side_effect = ValueError("Supabase registration failed: User already exists in Supabase")
    response = client.post("/api/v1/auth/register", json={"email": "existing@example.com", "password": "Password123!"})
    assert response.status_code == 400
    # Assert against the exact message format from AuthService's ValueError wrapper
    assert response.json()["detail"]["error"]["message"] == "Supabase registration failed: User already exists in Supabase"
    mock_auth_service_instance.register_user.assert_called_once_with("existing@example.com", "Password123!")

def test_login_user_success(mock_auth_service_instance):
    response = client.post("/api/v1/auth/login", json={"email": "test@example.com", "password": "Password123!"})
    assert response.status_code == 200
    assert response.json()["data"]["access_token"] == "mock-access-token"
    mock_auth_service_instance.login_user.assert_called_once_with("test@example.com", "Password123!")

def test_login_user_failure_invalid_credentials(mock_auth_service_instance):
    # Simulate a Supabase error from auth_service
    mock_auth_service_instance.login_user.side_effect = ValueError("Supabase login failed: Invalid login credentials from Supabase")
    response = client.post("/api/v1/auth/login", json={"email": "wrong@example.com", "password": "WrongPassword!"})
    assert response.status_code == 401
    # Assert against the exact message format from AuthService's ValueError wrapper
    assert response.json()["detail"]["error"]["message"] == "Supabase login failed: Invalid login credentials from Supabase"
    mock_auth_service_instance.login_user.assert_called_once_with("wrong@example.com", "WrongPassword!")

# Example of a protected route test (assuming you have one)
# @router.get("/protected", dependencies=[Depends(verify_jwt)])
# async def protected_route(user_id: dict = Depends(verify_jwt)):
#     return {"message": f"Welcome user {user_id['user_id']}"}
