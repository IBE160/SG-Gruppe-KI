# apps/api/app/models/onboarding.py
from typing import List, Optional
from pydantic import BaseModel, Field

class OnboardingData(BaseModel):
    goal: str
    customGoal: Optional[str] = None
    trainingFrequency: int = Field(..., ge=1, le=7)
    trainingDuration: int = Field(..., ge=10, le=240)
    equipment: List[str]
    customEquipment: Optional[str] = None
    injuriesLimitations: Optional[List[str]] = []
    customInjuriesLimitations: Optional[str] = None
    unitPreference: str = Field(pattern="^(kg|lbs)$")