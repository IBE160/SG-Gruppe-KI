# apps/api/app/api/user.py
from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import EmailStr

# Assuming app.core.auth will provide get_current_user_id
# If this import fails, it needs to be adjusted based on the actual auth module location
from app.core.auth import get_current_user_id
from app.models.user import UserProfileData, UserProfileUpdate, GoalUpdate, EquipmentCreate
from app.services.user_service import UserService # Will be created in Subtask 4.4

router = APIRouter()

@router.get("/users/me", response_model=UserProfileData)
async def get_current_user_profile(
    current_user_id: UUID = Depends(get_current_user_id),
    user_service: UserService = Depends(UserService)
):
    """
    Retrieve the profile of the currently authenticated user.
    """
    user_profile = await user_service.get_user_profile(current_user_id)
    if not user_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User profile not found"
        )
    return user_profile

@router.put("/users/me", response_model=UserProfileData)
async def update_current_user_profile(
    user_update_data: UserProfileUpdate,
    current_user_id: UUID = Depends(get_current_user_id),
    user_service: UserService = Depends(UserService)
):
    """
    Update the profile of the currently authenticated user.
    """
    updated_profile = await user_service.update_user_profile(current_user_id, user_update_data)
    if not updated_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User profile not found or could not be updated"
        )
    return updated_profile