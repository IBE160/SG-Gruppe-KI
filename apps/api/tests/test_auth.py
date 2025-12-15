# apps/api/tests/test_auth.py
import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock, patch
import uuid
from app.main import app

client = TestClient(app)

@patch('app.api.auth.create_client')
def test_register_user_success(mock_create_client):
    # Configure the mock to simulate a successful registration
    mock_supabase_client = MagicMock()
    mock_supabase_client.auth.sign_up.return_value = MagicMock(
        user=MagicMock(id=str(uuid.uuid4()), email="test@example.com"),
        session=MagicMock(),
        error=None
    )
    mock_create_client.return_value = mock_supabase_client

    response = client.post("/api/v1/register", json={"email": "test@example.com", "password": "Password123!"})

    assert response.status_code == 201
    assert response.json()["user"]["email"] == "test@example.com"
    mock_supabase_client.auth.sign_up.assert_called_once()

def test_register_user_failure_invalid_input():
    response = client.post("/api/v1/register", json={"email": "invalid-email", "password": "123"})
    assert response.status_code == 422

@patch('app.api.auth.create_client')
def test_register_user_failure_service_error(mock_create_client):
    # Configure the mock to simulate a registration error
    mock_supabase_client = MagicMock()
    mock_supabase_client.auth.sign_up.return_value = MagicMock(
        user=None,
        session=None,
        error=MagicMock(message="User already registered")
    )
    mock_create_client.return_value = mock_supabase_client

    response = client.post("/api/v1/register", json={"email": "existing@example.com", "password": "Password123!"})

    assert response.status_code == 400
    assert "User already registered" in response.json()["detail"]
    mock_supabase_client.auth.sign_up.assert_called_once()

@patch('app.api.auth.create_client')
def test_login_user_success(mock_create_client):
    # Configure the mock to simulate a successful login
    mock_supabase_client = MagicMock()
    mock_supabase_client.auth.sign_in_with_password.return_value = MagicMock(
        session=MagicMock(access_token="mock_access_token"),
        error=None
    )
    mock_create_client.return_value = mock_supabase_client

    response = client.post("/api/v1/login", json={"email": "test@example.com", "password": "Password123!"})

    assert response.status_code == 200
    assert response.json()["access_token"] == "mock_access_token"
    mock_supabase_client.auth.sign_in_with_password.assert_called_once()

@patch('app.api.auth.create_client')
def test_login_user_failure_invalid_credentials(mock_create_client):
    # Configure the mock to simulate a login error
    mock_supabase_client = MagicMock()
    mock_supabase_client.auth.sign_in_with_password.return_value = MagicMock(
        session=None,
        error=MagicMock(message="Invalid login credentials")
    )
    mock_create_client.return_value = mock_supabase_client

    response = client.post("/api/v1/login", json={"email": "wrong@example.com", "password": "WrongPassword!"})

    assert response.status_code == 401
    assert "Invalid login credentials" in response.json()["detail"]
    mock_supabase_client.auth.sign_in_with_password.assert_called_once()