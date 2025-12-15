from fastapi import APIRouter, Depends, HTTPException, status
from app.models.workout_plan import PlanGenerationRequest, PlanGenerationResponse, WorkoutPlanModel, WorkoutDay, Exercise
from app.services.ai_orchestrator import AIOrchestratorService
from app.services.plan_service import PlanService
from datetime import date
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

# Dependency functions for services
async def get_ai_orchestrator_service() -> AIOrchestratorService:
    return AIOrchestratorService()

async def get_plan_service() -> PlanService:
    return PlanService()

@router.get("/")
async def read_root():
    return {"message": "Plans API is working!"}

@router.post("/generate", response_model=PlanGenerationResponse)
async def generate_plan(
    request: PlanGenerationRequest,
    ai_orchestrator_service: AIOrchestratorService = Depends(get_ai_orchestrator_service),
    plan_service: PlanService = Depends(get_plan_service)
):
    # Dummy user data for now. In reality, this would come from the authenticated user.
    user_id = "test_user_id"
    user_profile = {"fitness_level": "intermediate"}
    user_goals = {"primary_goal": "build_muscle"}
    workout_history = [] # Placeholder

    try:
        workout_plan = await ai_orchestrator_service.generate_workout_plan(
            user_id=user_id,
            user_profile=user_profile,
            user_goals=user_goals,
            workout_history=workout_history,
            context=request.context
        )
        
        # Ensure user_id and plan_date are set in the generated plan
        workout_plan.user_id = user_id
        workout_plan.plan_date = date.today()

        # Store the generated plan
        stored_plan = await plan_service.store_workout_plan(workout_plan)
        if not stored_plan:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to store generated workout plan."
            )

        return PlanGenerationResponse(data=workout_plan)
    except ValueError as e:
        logger.error(f"AI plan generation validation error: {e}")
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Failed to generate or store workout plan: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate or store workout plan"
        )