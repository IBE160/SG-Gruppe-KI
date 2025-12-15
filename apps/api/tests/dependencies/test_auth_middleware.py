
import pytest
from fastapi import HTTPException, status
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
import jwt
import os
from datetime import datetime, timedelta

# Assuming app.dependencies.auth_middleware is the module containing get_current_user_id
# We need to import it here to test it
from app.dependencies.auth_middleware import get_current_user_id

# Mock the os.environ.get for SUPABASE_JWT_SECRET
@pytest.fixture(autouse=True)
def mock_env_vars():
    with patch.dict(os.environ, {"SUPABASE_JWT_SECRET": "test_jwt_secret", "SUPABASE_URL": "http://localhost:8000"}):
        yield

def create_test_jwt(user_id: str, secret: str, expires_delta: Optional[timedelta] = None):
    to_encode = {"sub": str(user_id), "aud": "authenticated", "iss": "http://localhost:8000/auth/v1"}
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15) # Default expiry
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, secret, algorithm="HS256")

async def test_get_current_user_id_valid_jwt():
    user_id = "test_user_id_123"
    token = create_test_jwt(user_id, "test_jwt_secret")
    result = await get_current_user_id(f"Bearer {token}")
    assert result == {"user_id": user_id}

async def test_get_current_user_id_missing_authorization_header():
    with pytest.raises(HTTPException) as excinfo:
        await get_current_user_id(None) # Simulate missing header
    assert excinfo.value.status_code == status.HTTP_401_UNAUTHORIZED
    assert "Authorization header missing or malformed" in excinfo.value.detail

async def test_get_current_user_id_malformed_authorization_header():
    with pytest.raises(HTTPException) as excinfo:
        await get_current_user_id("InvalidToken")
    assert excinfo.value.status_code == status.HTTP_401_UNAUTHORIZED
    assert "Authorization header missing or malformed" in excinfo.value.detail

async def test_get_current_user_id_expired_jwt():
    user_id = "test_user_id_expired"
    expired_token = create_test_jwt(user_id, "test_jwt_secret", expires_delta=timedelta(minutes=-1))
    with pytest.raises(HTTPException) as excinfo:
        await get_current_user_id(f"Bearer {expired_token}")
    assert excinfo.value.status_code == status.HTTP_401_UNAUTHORIZED
    assert "JWT has expired" in excinfo.value.detail

async def test_get_current_user_id_invalid_jwt():
    with pytest.raises(HTTPException) as excinfo:
        await get_current_user_id("Bearer invalid.jwt.token")
    assert excinfo.value.status_code == status.HTTP_401_UNAUTHORIZED
    assert "Invalid JWT" in excinfo.value.detail

@patch.dict(os.environ, {"SUPABASE_JWT_SECRET": ""}) # Temporarily unset the secret
async def test_get_current_user_id_missing_jwt_secret_env_var():
    token = create_test_jwt("any_user", "test_jwt_secret") # Token created with a dummy secret, but verification will fail
    with pytest.raises(HTTPException) as excinfo:
        await get_current_user_id(f"Bearer {token}")
    assert excinfo.value.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR
    assert "SUPABASE_JWT_SECRET is not configured" in excinfo.value.detail
