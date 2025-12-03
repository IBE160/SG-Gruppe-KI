# backend/app/schemas/daily_context.py
from datetime import date
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, Field

class DailyContextBase(BaseModel):
    mood: str = Field(..., description="User's self-reported mood.")
    energy: str = Field(..., description="User's self-reported energy level (e.g., 'low', 'medium', 'high', or a number as a string).")
    soreness: str = Field(..., description="User's self-reported muscle soreness (e.g., 'none', 'mild', 'moderate', 'severe', or a comma-separated list like 'Legs, Arms').")
    notes: Optional[str] = Field(None, description="Any additional notes from the user for the day.")

class DailyContextCreate(DailyContextBase):
    pass

class DailyContext(DailyContextBase):
    id: UUID
    user_id: UUID
    context_date: date
    created_at: date # This should probably be datetime, but for now matching story spec for date
    updated_at: date # This should probably be datetime, but for now matching story spec for date

    class Config:
        from_attributes = True
