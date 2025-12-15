from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date

class Exercise(BaseModel):
    name: str
    sets: int
    reps: str
    rpe: Optional[int] = None
    weight: Optional[str] = None
    tempo: Optional[str] = None
    rest_interval: Optional[str] = None
    notes: Optional[str] = None

class WorkoutDay(BaseModel):
    day_name: str
    exercises: List[Exercise]

class WorkoutPlanModel(BaseModel):
    plan_id: Optional[str] = Field(None, description="Unique ID for the workout plan")
    user_id: str
    plan_date: date
    workout_days: List[WorkoutDay]
    ai_explanation: Optional[str] = Field(None, description="AI's explanation for plan adaptations")

class PlanGenerationContext(BaseModel):
    mood: Optional[str] = None
    energy: Optional[str] = None
    soreness: Optional[str] = None
    recovery_bias: Optional[str] = None
    simulated_hrv: Optional[float] = None
    simulated_sleep: Optional[float] = None

class PlanGenerationRequest(BaseModel):
    context: PlanGenerationContext

class PlanGenerationResponse(BaseModel):
    data: WorkoutPlanModel
    message: str = "Workout plan generated successfully"
