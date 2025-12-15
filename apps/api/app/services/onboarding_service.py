# apps/api/app/services/onboarding_service.py
from fastapi import Depends, HTTPException, status
from app.core.supabase import get_supabase_client
from app.models.onboarding import OnboardingData
from datetime import datetime

class OnboardingService:
    def __init__(self, supabase_client = Depends(get_supabase_client)):
        self.supabase = supabase_client

    async def save_onboarding_data(self, user_id: str, data: OnboardingData):
        if not self.supabase:
            raise ValueError("Supabase client not initialized")

        try:
            # 1. Update the user's unit preference
            user_update_data = {'unit_preference': data.unitPreference}
            self.supabase.from_('users').update(user_update_data).eq('id', user_id).execute()

            # 2. Handle the primary goal
            primary_goal = data.customGoal if data.goal == "Custom" else data.goal

            # 3. Create the goal entry
            goal_data = {
                'user_id': user_id,
                'primary_goal': primary_goal,
                'training_frequency': data.trainingFrequency,
                'training_duration': data.trainingDuration,
                'injuries_limitations': data.customInjuriesLimitations,
                'created_at': datetime.now().isoformat()
            }
            self.supabase.from_('goals').insert(goal_data).execute()

            # 4. Handle equipment
            equipment_list = []
            if data.customEquipment:
                equipment_list.append(data.customEquipment)
            
            non_custom_equipment = [eq for eq in data.equipment if eq != "Specify..."]
            equipment_list.extend(non_custom_equipment)

            if equipment_list:
                equipment_entries = [{'user_id': user_id, 'name': name} for name in equipment_list]
                self.supabase.from_('equipment').insert(equipment_entries).execute()

        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to save onboarding data: {str(e)}"
            )