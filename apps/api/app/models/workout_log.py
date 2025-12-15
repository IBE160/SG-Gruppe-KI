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
    plan_id: UUID

class WorkoutLogResponse(WorkoutLogBase):
    id: UUID
    user_id: UUID
    plan_id: UUID
    completed_at: datetime

    class Config:
        from_attributes = True
