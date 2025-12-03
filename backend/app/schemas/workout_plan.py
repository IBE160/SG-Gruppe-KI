from datetime import date
from typing import List, Optional, Union
from uuid import UUID
from pydantic import BaseModel, Field

class Set(BaseModel):
    set_number: int
    target_reps: Union[int, str]
    target_weight: Optional[float] = None
    target_rpe: Optional[int] = None
    rest_seconds: Optional[int] = None
    notes: Optional[str] = None

class Exercise(BaseModel):
    name: str
    muscle_groups: List[str]
    sets: List[Set]

class Block(BaseModel):
    name: str
    type: str
    exercises: List[Exercise]

class WorkoutPlanJson(BaseModel):
    version: int = 1
    date: date
    goal: str
    focus: str
    estimated_duration_minutes: int
    notes: Optional[str] = None
    blocks: List[Block]

class WorkoutPlan(BaseModel):
    id: UUID
    user_id: UUID
    plan_date: date
    plan_json: WorkoutPlanJson
    status: str
    created_at: date
    updated_at: date

