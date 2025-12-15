# apps/api/app/api/auth.py
from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.responses import RedirectResponse
from supabase import create_client, Client
import os
import logging
from typing import Optional
from pydantic import BaseModel, EmailStr, Field
from app.dependencies.auth_middleware import get_current_user_id # Import the new dependency

router = APIRouter()
logger = logging.getLogger(__name__)

class UserCredentials(BaseModel):
    email: EmailStr
    password: str

# Supabase client initialization (for authenticated user actions)
def get_supabase_client() -> Client:
    supabase_url = os.environ.get("SUPABASE_URL")
    supabase_key = os.environ.get("SUPABASE_KEY") # This is typically the anon key
    if not supabase_url or not supabase_key:
        raise HTTPException(status_code=500, detail="Supabase URL and Key must be set as environment variables.")
    return create_client(supabase_url, supabase_key)

# Supabase client initialization (for admin actions requiring service role key)
def get_admin_supabase_client() -> Client:
    supabase_url = os.environ.get("SUPABASE_URL")
    supabase_service_role_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if not supabase_url or not supabase_service_role_key:
        raise HTTPException(status_code=500, detail="Supabase URL and SERVICE_ROLE_KEY must be set as environment variables.")
    return create_client(supabase_url, supabase_service_role_key)

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

@router.delete("/users/me", summary="Delete authenticated user's account")
async def delete_account(
    user_id: str = Depends(get_current_user_id),
    supabase_admin: Client = Depends(get_admin_supabase_client)
):
    """
    Deletes the authenticated user's account and all associated data.
    This action is irreversible and GDPR compliant.
    """
    try:
        # Step 1: Delete user's data from all relevant tables
        # Ensure RLS is correctly configured or perform manual deletions from all tables
        # that reference this user_id.

        # Delete from Goals table
        goals_delete_response = supabase_admin.from("Goals").delete().eq("user_id", user_id).execute()
        if goals_delete_response.error:
            logger.error(f"Error deleting goals for user {user_id}: {goals_delete_response.error.message}")
            raise HTTPException(status_code=500, detail="Failed to delete associated goals.")

        # Delete from WorkoutLogs table
        workout_logs_delete_response = supabase_admin.from("WorkoutLogs").delete().eq("user_id", user_id).execute()
        if workout_logs_delete_response.error:
            logger.error(f"Error deleting workout logs for user {user_id}: {workout_logs_delete_response.error.message}")
            raise HTTPException(status_code=500, detail="Failed to delete associated workout logs.")

        # Delete from Equipment table
        equipment_delete_response = supabase_admin.from("Equipment").delete().eq("user_id", user_id).execute()
        if equipment_delete_response.error:
            logger.error(f"Error deleting equipment for user {user_id}: {equipment_delete_response.error.message}")
            raise HTTPException(status_code=500, detail="Failed to delete associated equipment.")

        # Step 2: Delete the user from Supabase Auth
        # This requires the service role key.
        user_delete_response = supabase_admin.auth.admin.delete_user(user_id)
        if user_delete_response.error:
            logger.error(f"Error deleting user {user_id} from Supabase Auth: {user_delete_response.error.message}")
            raise HTTPException(status_code=500, detail="Failed to delete user from authentication system.")
        
        logger.info(f"Account for user {user_id} successfully deleted, including all associated data.")
        return {"data": {"message": "Account deletion process started. All associated data will be purged as per GDPR."}}

    except HTTPException:
        raise # Re-raise HTTPException
    except Exception as e:
        logger.error(f"Unexpected error during account deletion for user {user_id}: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred during account deletion.",
        )