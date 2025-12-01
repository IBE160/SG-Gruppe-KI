from fastapi import APIRouter, Depends, HTTPException, status
from supabase import Client
from app.db.supabase import get_supabase_client
from app.schemas.user import OnboardingData, UserProfile, UserProfileUpdate # Import UserProfileUpdate
from app.dependencies import get_current_user

router = APIRouter()

@router.post("/onboarding", response_model=UserProfile)
async def onboard_user(
    onboarding_data: OnboardingData,
    current_user: dict = Depends(get_current_user),
    supabase: Client = Depends(get_supabase_client)
):
    """
    Saves initial onboarding data for an authenticated user.
    """
    user_id = current_user["id"]

    # Construct the data to update in the Supabase 'users' table
    update_data = onboarding_data.model_dump(exclude_unset=True)

    try:
        # Update the user profile in Supabase
        response = supabase.table("users").update(update_data).eq("id", user_id).execute()
        
        # Supabase update response structure
        # Check for errors in the response
        if response.data and len(response.data) > 0:
            updated_user = response.data[0]
            return UserProfile(
                id=updated_user["id"],
                email=current_user["email"], # Assuming email is from current_user or fetched
                name=updated_user.get("name"),
                goals=updated_user.get("goals"),
                preferences=updated_user.get("preferences"),
                equipment=updated_user.get("equipment"),
                injuries=updated_user.get("injuries"),
                units=updated_user.get("units")
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found or no data updated."
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update onboarding data: {e}"
        )

@router.get("/me", response_model=UserProfile)
async def get_user_profile(
    current_user: dict = Depends(get_current_user),
    supabase: Client = Depends(get_supabase_client)
):
    """
    Retrieves the authenticated user's profile.
    """
    user_id = current_user["id"]
    try:
        response = supabase.table("users").select("*").eq("id", user_id).single().execute()
        if response.data:
            user_data = response.data
            return UserProfile(
                id=user_data["id"],
                email=user_data["email"],
                name=user_data.get("name"),
                goals=user_data.get("goals"),
                preferences=user_data.get("preferences"),
                equipment=user_data.get("equipment"),
                injuries=user_data.get("injuries"),
                units=user_data.get("units")
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User profile not found."
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch user profile: {e}"
        )

@router.put("/me", response_model=UserProfile)
async def update_user_profile(
    user_profile_update: UserProfileUpdate, # Changed from OnboardingData
    current_user: dict = Depends(get_current_user),
    supabase: Client = Depends(get_supabase_client)
):
    """
    Updates the authenticated user's profile information.
    """
    user_id = current_user["id"]
    update_data = user_profile_update.model_dump(exclude_unset=True)

    try:
        response = supabase.table("users").update(update_data).eq("id", user_id).execute()
        if response.data and len(response.data) > 0:
            updated_user = response.data[0]
            return UserProfile(
                id=updated_user["id"],
                email=current_user["email"],
                name=updated_user.get("name"),
                goals=updated_user.get("goals"),
                preferences=updated_user.get("preferences"),
                equipment=updated_user.get("equipment"),
                injuries=updated_user.get("injuries"),
                units=updated_user.get("units")
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found or no data updated."
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update user profile: {e}"
        )

@router.get("/test")
async def test_users_router():
    return {"message": "Users router is working!"}