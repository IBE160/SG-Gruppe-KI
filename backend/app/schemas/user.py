from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class OnboardingData(BaseModel):
    goals: Optional[Dict[str, Any]] = Field(default_factory=dict)
    preferences: Optional[Dict[str, Any]] = Field(default_factory=dict)
    equipment: Optional[List[str]] = Field(default_factory=list)
    injuries: Optional[str] = None
    units: Optional[str] = None # e.g., "metric", "imperial"

# This will be used for user profile updates or display
class UserProfile(BaseModel):
    id: str # Supabase user ID (UUID as string)
    email: str
    name: Optional[str] = None
    goals: Optional[Dict[str, Any]] = None
    preferences: Optional[Dict[str, Any]] = None
    equipment: Optional[List[str]] = None
    injuries: Optional[str] = None
    units: Optional[str] = None
