# apps/api/app/services/user_service.py
from typing import List, Optional
from uuid import UUID
from datetime import datetime
from fastapi import Depends

from app.core.config import settings
from app.core.supabase import get_supabase_client
from app.models.user import UserProfileData, UserProfileUpdate, GoalUpdate, EquipmentCreate, GoalCreate

class UserService:
    def __init__(self, supabase=Depends(get_supabase_client)):
        self.supabase = supabase

    async def get_user_profile(self, user_id: UUID) -> Optional[UserProfileData]:
        # Fetch user data from 'users' table (managed by Supabase Auth, extended by our schema)
        user_response = self.supabase.from_('users').select('*').eq('id', str(user_id)).single().execute()
        user_data = user_response.data

        if not user_data:
            return None

        profile_data = {
            "id": user_data['id'],
            "email": user_data['email'],
            "unit_preference": user_data.get('unit_preference', 'kg'),
            "updated_at": user_data.get('updated_at'),
        }

        # Fetch goals
        goal_response = self.supabase.from_('goals').select('*').eq('user_id', str(user_id)).order('created_at', desc=True).limit(1).execute()
        goal_data = goal_response.data[0] if goal_response.data else None

        if goal_data:
            profile_data.update({
                "primary_goal": goal_data.get('primary_goal'),
                "training_frequency": goal_data.get('training_frequency'),
                "training_duration": goal_data.get('training_duration'),
                "injuries_limitations": goal_data.get('injuries_limitations'),
            })

        # Fetch equipment
        equipment_response = self.supabase.from_('equipment').select('name').eq('user_id', str(user_id)).execute()
        equipment_names = [item['name'] for item in equipment_response.data] if equipment_response.data else []
        profile_data['equipment'] = equipment_names
        
        return UserProfileData(**profile_data)

    async def update_user_profile(self, user_id: UUID, update_data: UserProfileUpdate) -> Optional[UserProfileData]:
        # Start a transaction (Supabase client doesn't directly support transactions in this way)
        # For multi-table updates, we'll perform operations sequentially and handle potential failures.
        # A more robust solution might involve stored procedures or database functions in Supabase.

        # 1. Update 'users' table
        user_update_payload = {}
        if update_data.unit_preference is not None:
            user_update_payload['unit_preference'] = update_data.unit_preference
        
        if user_update_payload:
            user_update_payload['updated_at'] = datetime.now().isoformat() # Update timestamp
            self.supabase.from_('users').update(user_update_payload).eq('id', str(user_id)).execute()

        # 2. Update 'goals' table
        goal_update_payload = {}
        if update_data.primary_goal is not None:
            goal_update_payload['primary_goal'] = update_data.primary_goal
        if update_data.training_frequency is not None:
            goal_update_payload['training_frequency'] = update_data.training_frequency
        if update_data.training_duration is not None:
            goal_update_payload['training_duration'] = update_data.training_duration
        if update_data.injuries_limitations is not None:
            goal_update_payload['injuries_limitations'] = update_data.injuries_limitations
        
        if goal_update_payload:
            # Check if a goal already exists for the user
            existing_goal = self.supabase.from_('goals').select('id').eq('user_id', str(user_id)).order('created_at', desc=True).limit(1).execute()
            if existing_goal.data:
                # Update existing goal
                self.supabase.from_('goals').update(goal_update_payload).eq('id', existing_goal.data[0]['id']).execute()
            else:
                # Create a new goal entry
                goal_create_data = {**goal_update_payload, "user_id": str(user_id)}
                self.supabase.from_('goals').insert(goal_create_data).execute()

        # 3. Update 'equipment' table (replace all for simplicity)
        if update_data.equipment is not None:
            # Delete existing equipment for the user
            self.supabase.from_('equipment').delete().eq('user_id', str(user_id)).execute()
            
            # Insert new equipment
            if update_data.equipment:
                new_equipment_entries = [{"user_id": str(user_id), "name": name} for name in update_data.equipment]
                self.supabase.from_('equipment').insert(new_equipment_entries).execute()

        # Fetch and return the updated profile
        return await self.get_user_profile(user_id)
