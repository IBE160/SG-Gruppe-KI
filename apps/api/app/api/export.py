from fastapi import APIRouter, Depends, HTTPException, status
from supabase import Client
import os
import logging # Moved to top
from dotenv import load_dotenv
from app.dependencies.auth_middleware import get_current_user_id # Import the actual dependency
from app.api.auth import get_supabase_client # Import the reusable Supabase client

# Load environment variables (ensure this is done once at app startup)
load_dotenv()

# Get logger for this module (Moved to top after load_dotenv)
logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/users/me/export", summary="Request GDPR-compliant data export")
async def request_data_export(
    user_id: str = Depends(get_current_user_id),
    supabase: Client = Depends(get_supabase_client) # Use reusable Supabase client
):
    """
    Initiates a GDPR-compliant data export for the authenticated user.
    Fetches all user-related data from the database and returns it.
    """
    try:
        # TODO: Implement Data Export Service logic to fetch and format user data
        # This is a placeholder for fetching data from various tables
        user_profile_response = supabase.table("Users").select("*").eq("id", user_id).single().execute()
        user_goals_response = supabase.table("Goals").select("*").eq("user_id", user_id).execute()
        user_equipment_response = supabase.table("Equipment").select("*").eq("user_id", user_id).execute()
        user_workout_logs_response = supabase.table("WorkoutLogs").select("*").eq("user_id", user_id).execute()
        # Add other relevant tables as needed

        exported_data = {
            "user_profile": user_profile_response.data,
            "user_goals": user_goals_response.data,
            "user_equipment": user_equipment_response.data,
            "user_workout_logs": user_workout_logs_response.data,
            # Add other data here
        }

        return {"data": {"message": "Data export initiated.", "exported_data": exported_data}}

    except Exception as e:
        logger.error(f"Error during data export for user {user_id}: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to initiate data export.",
        )