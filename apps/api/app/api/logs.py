from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from uuid import UUID

from apps.api.app.models.workout_log import WorkoutLogCreate, WorkoutLogResponse
from apps.api.app.services.log_service import LogService
from app.core.supabase import get_current_user_id

logs_router = APIRouter(prefix="/logs", tags=["Workout Logs"])

log_service = LogService()

@logs_router.post(
    "/",
    response_model=WorkoutLogResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Log a single workout set",
    description="Logs data for a single completed workout set (reps, weight, RPE).",
    dependencies=[Depends(get_current_user_id)],
)
async def log_workout_set(
    log_entry: WorkoutLogCreate,
    user_id: UUID = Depends(get_current_user_id),
):
    return await log_service.create_log_entry(log_entry, user_id)

@logs_router.post(
    "/bulk",
    response_model=List[WorkoutLogResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Log multiple workout sets in bulk",
    description="Logs data for multiple completed workout sets.",
    dependencies=[Depends(get_current_user_id)],
)
async def bulk_log_workout_sets(
    log_entries: List[WorkoutLogCreate],
    user_id: UUID = Depends(get_current_user_id),
):
    return await log_service.create_bulk_log_entries(log_entries, user_id)