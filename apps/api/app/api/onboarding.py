from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Dict, Any, Optional, List

from app.core.supabase import get_current_user_id

router = APIRouter(redirect_slashes=False)

# Placeholder Pydantic model for onboarding data
# This should be expanded based on the actual data collected during onboarding (goals, equipment, etc.)
class OnboardingData(BaseModel):
    goal: Optional[str] = None
    customGoal: Optional[str] = None
    trainingFrequency: Optional[int] = None
    trainingDuration: Optional[int] = None
    equipment: Optional[List[str]] = None
    customEquipment: Optional[str] = None
    injuriesLimitations: Optional[List[str]] = None
    customInjuriesLimitations: Optional[str] = None
    unitPreference: Optional[str] = None

@router.post("/")
async def complete_onboarding(
    onboarding_data: OnboardingData,
    user_id: str = Depends(get_current_user_id)
):
    """
    Handles the completion of the user onboarding process.
    Receives data collected during the conversational onboarding flow and stores it.
    """
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Placeholder for actual data storage logic
    print(f"Onboarding data received for user {user_id}: {onboarding_data.model_dump()}")

    return {"message": "Onboarding complete", "user_id": user_id}
