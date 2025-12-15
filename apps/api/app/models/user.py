# apps/api/app/models/user.py
from datetime import datetime
from typing import List, Optional
from uuid import UUID
from pydantic import BaseModel, EmailStr, Field

class UserProfileData(BaseModel):
    id: UUID
    email: EmailStr
    unit_preference: str = Field(default="kg", pattern="^(kg|lbs)$")
    # For now, goal and equipment are represented as lists within the user profile for simplicity in fetching
    # In a more complex scenario, these would be separate endpoints or joined
    primary_goal: Optional[str] = None
    training_frequency: Optional[int] = None
    training_duration: Optional[int] = None
    injuries_limitations: Optional[str] = None
    equipment: Optional[List[str]] = None
    updated_at: Optional[datetime] = None

class UserProfileUpdate(BaseModel):
    # Fields that can be updated directly on the Users table
    unit_preference: Optional[str] = Field(None, pattern="^(kg|lbs)$")

    # Fields that update or create a Goal entry
    primary_goal: Optional[str] = None
    training_frequency: Optional[int] = Field(None, ge=1, le=7) # 1-7 days per week
    training_duration: Optional[int] = Field(None, ge=10, le=240) # 10-240 minutes
    injuries_limitations: Optional[str] = None

    # Equipment updates
    equipment: Optional[List[str]] = None # List of equipment names

class GoalData(BaseModel):
    id: UUID
    user_id: UUID
    primary_goal: str
    training_frequency: int
    training_duration: int
    injuries_limitations: Optional[str] = None
    created_at: datetime

class EquipmentData(BaseModel):
    id: UUID
    user_id: UUID
    name: str

# Models for request body if updating goals/equipment separately (not used in current PUT /users/me but good for future)
class GoalCreate(BaseModel):
    primary_goal: str
    training_frequency: int
    training_duration: int
    injuries_limitations: Optional[str] = None

class GoalUpdate(BaseModel):
    primary_goal: Optional[str] = None
    training_frequency: Optional[int] = None
    training_duration: Optional[int] = None
    injuries_limitations: Optional[str] = None

class EquipmentCreate(BaseModel):
    name: str

class EquipmentUpdate(BaseModel):
    name: str
