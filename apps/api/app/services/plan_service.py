import os
from supabase import create_client, Client
from typing import Optional
import logging

from app.models.workout_plan import WorkoutPlanModel

logger = logging.getLogger(__name__)

class PlanService:
    def __init__(self):
        supabase_url = os.environ.get("SUPABASE_URL")
        supabase_key = os.environ.get("SUPABASE_KEY")
        if not supabase_url or not supabase_key:
            raise ValueError("Supabase URL and Key must be set as environment variables.")
        self.supabase: Client = create_client(supabase_url, supabase_key)

    async def store_workout_plan(self, workout_plan: WorkoutPlanModel) -> Optional[WorkoutPlanModel]:
        try:
            # Convert plan_date to string for Supabase insert
            plan_data = workout_plan.model_dump_json() # Use model_dump_json for Pydantic v2
            
            # Supabase doesn't automatically handle UUID for PK, so let it generate
            # For now, plan_id from model is ignored, Supabase will generate.
            # In a real scenario, you might want to generate UUID client-side or handle response.
            response = self.supabase.from_("WorkoutPlans").insert({
                "user_id": str(workout_plan.user_id),
                "plan_date": str(workout_plan.plan_date),
                "plan_details": plan_data,
                "ai_explanation": workout_plan.ai_explanation
            }).execute()

            # Assuming response.data contains the inserted row(s)
            if response.data:
                # Optionally, you can parse the response data back into WorkoutPlanModel
                # For simplicity, returning the original workout_plan for now.
                logger.info(f"Workout plan stored successfully for user {workout_plan.user_id}")
                return workout_plan
            else:
                logger.error(f"Failed to store workout plan: No data returned from Supabase. {response.status_code}")
                return None
        except Exception as e:
            logger.error(f"Error storing workout plan in Supabase: {e}")
            raise
