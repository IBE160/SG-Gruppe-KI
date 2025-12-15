from uuid import UUID
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class WorkoutLogBase(BaseModel):
    exercise_name: str
    set_number: int = Field(..., ge=1)
    target_reps: Optional[int] = Field(None, ge=0)
    actual_reps: int = Field(..., ge=0)
    target_weight: Optional[float] = Field(None, ge=0.0)
    actual_weight: float = Field(..., ge=0.0)
    rpe: float = Field(..., ge=0.0, le=10.0)

class WorkoutLogCreate(WorkoutLogBase):
    id: Optional[UUID] = Field(None) # Optional ID for client-generated IDs in offline mode
    plan_id: Optional[UUID] = Field(None)
    completed_at: datetime = Field(default_factory=datetime.utcnow) # When the log was completed

class WorkoutLogResponse(WorkoutLogBase):
    id: UUID
    user_id: UUID
    plan_id: Optional[UUID] # Make plan_id optional in response as well
    completed_at: datetime

    class Config:
        from_attributes = True
