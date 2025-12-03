from fastapi import APIRouter, Depends, HTTPException, status
from supabase import Client
from app.db.supabase import get_supabase_client, get_supabase_service_client
from app.schemas.user import OnboardingData, UserProfile, UserProfileUpdate, CurrentUser # Import CurrentUser
from app.dependencies import get_current_user

router = APIRouter()

@router.get("/me", response_model=UserProfile)
async def get_user_profile(
    current_user: CurrentUser = Depends(get_current_user),
    supabase: Client = Depends(get_supabase_service_client)
):
    """
    Retrieves the authenticated user's profile.
    If the user profile does not exist, it creates one.
    """
    user_id = current_user.id
    email = current_user.email
    print(f"--- Entering get_user_profile for user_id: {user_id}, email: {email} ---")

    if not user_id:
        raise HTTPException(status_code=400, detail="User ID not found in token.")

    try:
        # Fetch user profile
        print(f"1. Attempting to select from 'users' table with id: {user_id}")
        response = supabase.table("users").select("*").eq("id", user_id).execute()
        print(f"2. Supabase select response: {response}")

        user_data = None
        if response.data:
            print("3. Found existing user data.")
            user_data = response.data[0]
        else:
            print("3. No existing user data found.")

        # If user profile doesn't exist, create it
        if user_data is None:
            print(f"4. Attempting to insert new user with id: {user_id} and email: {email}")
            insert_response = supabase.table("users").insert({
                "id": user_id,
                "email": email
            }).execute()
            print(f"5. Supabase insert response: {insert_response}")
            
            if insert_response.data and len(insert_response.data) > 0:
                print("6. Successfully created new user profile.")
                user_data = insert_response.data[0]
            else:
                print("6. ERROR: Failed to create user profile after insert.")
                # Log the actual error from Supabase if available
                error_detail = "Failed to create user profile after attempting to fetch."
                if hasattr(insert_response, 'error') and insert_response.error:
                    error_detail = insert_response.error.message
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=error_detail
                )
        
        print(f"7. Returning user profile: {user_data}")
        return UserProfile(**user_data)

    except Exception as e:
        print(f"--- EXCEPTION in get_user_profile: {e} ---")
        # Check if it's a PostgREST error and try to extract details
        if hasattr(e, 'message'):
            detail = e.message
        else:
            detail = str(e)
            
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred: {detail}"
        )


# ... (The rest of the file remains the same)
@router.put("/me", response_model=UserProfile)
async def update_user_profile(
    user_profile_update: UserProfileUpdate,
    current_user: CurrentUser = Depends(get_current_user),
    supabase: Client = Depends(get_supabase_service_client)
):
    """
    Updates the authenticated user's profile information.
    """
    user_id = current_user.id
    # Exclude unset fields and also filter out any fields that are explicitly set to None
    update_data = {k: v for k, v in user_profile_update.model_dump().items() if v is not None}
    
    print(f"--- Attempting to update profile for user_id: {user_id} ---")
    print(f"1. Filtered update data to be sent: {update_data}")

    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No update data provided."
        )

    try:
        response = supabase.table("users").update(update_data).eq("id", user_id).execute()
        print(f"2. Supabase update response: {response}")

        if response.data and len(response.data) > 0:
            print("3. Successfully updated data.")
            updated_user = response.data[0]
            auth_email = current_user.email
            return UserProfile(
                id=updated_user["id"],
                email=updated_user.get("email", auth_email),
                name=updated_user.get("name"),
                goals=updated_user.get("goals"),
                preferences=updated_user.get("preferences"),
                equipment=updated_user.get("equipment"),
                injuries=updated_user.get("injuries"),
                units=updated_user.get("units")
            )
        else:
            print("3. ERROR: No data returned from Supabase after update.")
            error_detail = "User not found or no data updated. This may be due to RLS policy."
            if hasattr(response, 'error') and response.error:
                error_detail = response.error.message
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=error_detail
            )
    except Exception as e:
        print(f"--- EXCEPTION in update_user_profile: {type(e).__name__} - {e} ---")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update user profile: {type(e).__name__} - {e}"
        )

@router.post("/onboarding", response_model=UserProfile)
async def onboard_user(
    onboarding_data: OnboardingData,
    current_user: CurrentUser = Depends(get_current_user),
    supabase: Client = Depends(get_supabase_service_client)
):
    """
    Saves initial onboarding data for an authenticated user.
    """
    user_id = current_user.id
    update_data = onboarding_data.model_dump(exclude_unset=True)
    try:
        response = supabase.table("users").update(update_data).eq("id", user_id).execute()
        if response.data and len(response.data) > 0:
            updated_user = response.data[0]
            auth_email = current_user.email
            return UserProfile(
                id=updated_user["id"],
                email=updated_user.get("email", auth_email),
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
