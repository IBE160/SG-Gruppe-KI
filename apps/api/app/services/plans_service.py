# apps/api/app/services/plans_service.py
from typing import Optional
from uuid import UUID
from datetime import date
from supabase import Client, Depends

from app.core.supabase import get_supabase_client
from app.models.workout_plan import WorkoutPlanModel, WorkoutPlanDB

class PlanService:
    def __init__(self, supabase: Client = Depends(get_supabase_client)):
        self.supabase = supabase

    async def store_workout_plan(self, workout_plan: WorkoutPlanModel) -> Optional[WorkoutPlanModel]:
        data = workout_plan.model_dump_json() # Use model_dump_json for JSONB column
        response = self.supabase.from_('WorkoutPlans').insert({
            "user_id": str(workout_plan.user_id),
            "plan_date": workout_plan.plan_date.isoformat(),
            "plan_details": data, # Store the entire Pydantic model as JSONB
            "ai_explanation": workout_plan.ai_explanation,
            "is_confirmed": False
        }).execute()

        if response.data:
            return WorkoutPlanModel(**response.data[0]) # Assuming Supabase returns the inserted data
        return None

    async def get_workout_plan(self, plan_id: UUID) -> Optional[WorkoutPlanModel]:
        response = self.supabase.from_('WorkoutPlans').select('*').eq('id', str(plan_id)).single().execute()
        if response.data:
            # Reconstruct WorkoutPlanModel from stored data
            plan_data_db = WorkoutPlanDB(**response.data)
            workout_plan_model = WorkoutPlanModel(**plan_data_db.plan_details)
            workout_plan_model.id = plan_data_db.id
            workout_plan_model.is_confirmed = plan_data_db.is_confirmed
            return workout_plan_model
        return None

    async def confirm_workout_plan(self, plan_id: UUID) -> Optional[WorkoutPlanModel]:
        response = self.supabase.from_('WorkoutPlans').update({"is_confirmed": True}).eq('id', str(plan_id)).execute()
        if response.data:
            plan_data_db = WorkoutPlanDB(**response.data[0])
            workout_plan_model = WorkoutPlanModel(**plan_data_db.plan_details)
            workout_plan_model.id = plan_data_db.id
            workout_plan_model.is_confirmed = plan_data_db.is_confirmed
            return workout_plan_model
        return None