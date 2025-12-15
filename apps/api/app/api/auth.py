# apps/api/app/api/auth.py
from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.responses import RedirectResponse
from supabase import create_client, Client
import os
import logging
from typing import Optional
from pydantic import BaseModel, EmailStr, Field

router = APIRouter()
logger = logging.getLogger(__name__)

class UserCredentials(BaseModel):
    email: EmailStr
    password: str

# Supabase client initialization
def get_supabase_client() -> Client:
    supabase_url = os.environ.get("SUPABASE_URL")
    supabase_key = os.environ.get("SUPABASE_KEY")
    if not supabase_url or not supabase_key:
        raise HTTPException(status_code=500, detail="Supabase URL and Key must be set as environment variables.")
    return create_client(supabase_url, supabase_key)

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register_user(credentials: UserCredentials, supabase: Client = Depends(get_supabase_client)):
    response = supabase.auth.sign_up({"email": credentials.email, "password": credentials.password})
    if response.user:
        return {"user": response.user.__dict__, "session": response.session}
    elif response.error:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=response.error.message)
    return {"message": "Registration failed."}


@router.post("/login")
async def login_user(credentials: UserCredentials, supabase: Client = Depends(get_supabase_client)):
    response = supabase.auth.sign_in_with_password({"email": credentials.email, "password": credentials.password})
    if response.session:
        return {"access_token": response.session.access_token, "token_type": "bearer"}
    elif response.error:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=response.error.message)
    return {"message": "Login failed."}


@router.get("/google")
async def google_oauth_initiate(supabase: Client = Depends(get_supabase_client)):
    frontend_base_url = os.environ.get("FRONTEND_BASE_URL", "http://localhost:3000")
    logger.info("Backend /auth/google endpoint called. Redirecting to frontend's configured callback.")
    return RedirectResponse(url=f"{frontend_base_url}/auth/callback")

@router.get("/callback")
async def auth_callback(
    access_token: Optional[str] = None,
    refresh_token: Optional[str] = None,
    error: Optional[str] = None,
    error_description: Optional[str] = None,
    supabase: Client = Depends(get_supabase_client)
):
    logger.info(f"Backend /auth/callback received. Access Token: {access_token}, Refresh Token: {refresh_token}, Error: {error}")

    frontend_base_url = os.environ.get("FRONTEND_BASE_URL", "http://localhost:3000")

    if error:
        logger.error(f"OAuth error: {error} - {error_description}")
        return RedirectResponse(url=f"{frontend_base_url}/auth/error?error={error_description}")

    if access_token and refresh_token:
        logger.info("Redirecting to frontend with access and refresh tokens.")
        return RedirectResponse(url=f"{frontend_base_url}/auth/success?access_token={access_token}&refresh_token={refresh_token}")

    logger.warning("Auth callback received without expected tokens or errors.")
    return RedirectResponse(url=f"{frontend_base_url}/auth/error?error=authentication_failed")