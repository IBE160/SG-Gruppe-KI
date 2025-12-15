# apps/api/app/api/onboarding.py
from fastapi import APIRouter, Depends, status
from app.models.onboarding import OnboardingData
from app.services.onboarding_service import OnboardingService
from app.core.auth import get_current_user_id

router = APIRouter()

@router.post("/onboarding", status_code=status.HTTP_201_CREATED)
async def complete_onboarding(
    onboarding_data: OnboardingData,
    user_id: str = Depends(get_current_user_id),
    onboarding_service: OnboardingService = Depends(OnboardingService)
):
    await onboarding_service.save_onboarding_data(user_id, onboarding_data)
    return {"message": "Onboarding data received successfully"}