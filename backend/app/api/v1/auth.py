from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.responses import RedirectResponse
from supabase import Client
from gotrue.errors import AuthApiError

from app.schemas.user import UserCreate, UserLogin
from app.db.supabase import get_supabase_client
from app.core.config import settings

router = APIRouter()


@router.post("/signup", status_code=status.HTTP_201_CREATED)
async def sign_up(user_credentials: UserCreate, supabase: Client = Depends(get_supabase_client)):
    """
    Handles user sign-up.
    """
    try:
        session = supabase.auth.sign_up({
            "email": user_credentials.email,
            "password": user_credentials.password,
        })
        # TODO: Here you might want to create a corresponding user profile in your public.users table
        # using the service role client if you have public tables with RLS.
        
        # For now, just returning the session which includes the new user's ID and email.
        if session.session:
            return {"message": "success", "data": session.session}
        else:
            # This case might happen with email confirmation enabled.
             raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Sign up failed, please check your details or try again.",
            )

    except AuthApiError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=e.message,
        )


@router.post("/login")
async def sign_in(user_credentials: UserLogin, supabase: Client = Depends(get_supabase_client)):
    """
    Handles user sign-in.
    """
    try:
        session = supabase.auth.sign_in_with_password({
            "email": user_credentials.email,
            "password": user_credentials.password,
        })
        return {"message": "success", "data": session.session}
    except AuthApiError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=e.message,
            headers={"WWW-Authenticate": "Bearer"},
        )


@router.get("/google")
async def google_oauth_initiate():
    """
    Initiates the Google OAuth flow by redirecting the user to Supabase's authorize endpoint.
    """
    if not settings.SUPABASE_URL or not settings.BASE_URL:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="SUPABASE_URL or BASE_URL not configured.",
        )

    # The redirect_to URL must be the frontend callback page
    redirect_to = f"{settings.BASE_URL}/auth/callback"
    
    supabase_auth_url = (
        f"{settings.SUPABASE_URL}/auth/v1/authorize?"
        f"provider=google&"
        f"redirect_to={redirect_to}"
    )

    return RedirectResponse(url=supabase_auth_url)