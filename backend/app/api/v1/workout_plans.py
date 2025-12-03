from typing import Dict, Any, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status

# from backend.app.api.v1.auth import get_current_user # Assuming authentication will be set up
from backend.app.schemas.workout_plan import WorkoutPlan
from backend.app.services.ai_plan_service import AIPlanGenerationService
from backend.app.core.dependencies import get_openai_client, get_redis_client, get_supabase_client

from openai import OpenAI
import redis
from supabase import Client # Correct import for Supabase client

router = APIRouter()

# Placeholder for current user until authentication is implemented
def get_current_user_placeholder() -> UUID:
    # In a real application, this would fetch the authenticated user's ID
    # For now, return a dummy UUID
    return UUID("a1b2c3d4-e5f6-7890-1234-567890abcdef")


@router.post("/generate", response_model=WorkoutPlan, status_code=status.HTTP_201_CREATED)
async def generate_workout_plan_endpoint(
    daily_context_data: Dict[str, Any],
    force_regenerate: bool = False,
    simulated_recovery_data: Optional[Dict[str, Any]] = None,
    current_user: UUID = Depends(get_current_user_placeholder), # Replace with get_current_user
    openai_client: OpenAI = Depends(get_openai_client),
    redis_client: redis.Redis = Depends(get_redis_client),
    supabase_client: SyncPostgrestClient = Depends(get_supabase_client)
):
    """
    Triggers AI to generate a new personalized daily workout plan based on user's profile,
    daily context, and recent workout history.
    """
    ai_plan_service = AIPlanGenerationService(openai_client, redis_client, supabase_client)
    
    try:
        workout_plan = await ai_plan_service.generate_workout_plan(
            user_id=current_user,
            daily_context_data=daily_context_data,
            force_regenerate=force_regenerate,
            simulated_recovery_data=simulated_recovery_data,
        )
        return workout_plan
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred: {e}",
        )
