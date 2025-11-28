from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_signup_success():
    response = client.post(
        "/api/v1/auth/signup",
        json={"email": "test@example.com", "password": "securepassword"}
    )
    assert response.status_code == 200
    assert response.json() == {"message": "User registered successfully", "email": "test@example.com"}

def test_signup_duplicate_email():
    # First signup
    client.post(
        "/api/v1/auth/signup",
        json={"email": "duplicate@example.com", "password": "securepassword"}
    )
    # Second signup with same email
    response = client.post(
        "/api/v1/auth/signup",
        json={"email": "duplicate@example.com", "password": "anotherpassword"}
    )
    assert response.status_code == 400
    assert response.json() == {"detail": "Email already registered"}

def test_login_success():
    # Signup first
    client.post(
        "/api/v1/auth/signup",
        json={"email": "login@example.com", "password": "loginpassword"}
    )
    # Then login
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "login@example.com", "password": "loginpassword"}
    )
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["message"] == "Login successful"

def test_login_invalid_credentials():
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "nonexistent@example.com", "password": "wrongpassword"}
    )
    assert response.status_code == 401
    assert response.json() == {"detail": "Invalid credentials"}

def test_login_wrong_password():
    # Signup first
    client.post(
        "/api/v1/auth/signup",
        json={"email": "wrongpass@example.com", "password": "correctpassword"}
    )
    # Then login with wrong password
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "wrongpass@example.com", "password": "wrongpassword"}
    )
    assert response.status_code == 401
    assert response.json() == {"detail": "Invalid credentials"}
