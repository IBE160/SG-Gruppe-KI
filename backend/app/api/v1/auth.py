from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.app.schemas.user import UserCreate, UserLogin # Relative import

router = APIRouter()

# Mock user database
mock_users_db = {}

@router.post("/signup")
async def signup_user(user: UserCreate):
    if user.email in mock_users_db:
        raise HTTPException(status_code=400, detail="Email already registered")
    mock_users_db[user.email] = {"email": user.email, "hashed_password": user.password + "_hashed"} # Mock hashing
    return {"message": "User registered successfully", "email": user.email}

@router.post("/login")
async def login_user(user: UserLogin):
    stored_user = mock_users_db.get(user.email)
    if not stored_user or stored_user["hashed_password"] != user.password + "_hashed": # Mock verification
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"message": "Login successful", "email": user.email, "access_token": "mock_access_token", "token_type": "bearer"}