from typing import Dict, Any, Optional
from datetime import date
from uuid import UUID

from fastapi import Depends, HTTPException, status
from openai import OpenAI
import redis
from supabase import Client # Correct import for Supabase client

from backend.app.schemas.workout_plan import WorkoutPlanJson, WorkoutPlan
from backend.app.core.config import settings # Assuming settings will contain API keys etc.

class AIPlanGenerationService:
    def __init__(self, openai_client: OpenAI, redis_client: redis.Redis, supabase_client: Client):
        self.openai_client = openai_client
        self.redis_client = redis_client
        self.supabase_client = supabase_client

    async def generate_workout_plan(
        self,
        user_id: UUID,
        daily_context_data: Dict[str, Any],
        force_regenerate: bool = False,
        simulated_recovery_data: Optional[Dict[str, Any]] = None,
    ) -> WorkoutPlan:
        # 1. Caching Logic
        # Generate a cache key based on user_id, daily_context_data, etc.
        # For simplicity, let's just use user_id and current date for now.
        cache_key = f"workout_plan:{user_id}:{date.today().isoformat()}"

        if not force_regenerate:
            cached_plan_json = self.redis_client.get(cache_key)
            if cached_plan_json:
                try:
                    # Assuming cached_plan_json is a string representation of WorkoutPlanJson
                    workout_plan_json = WorkoutPlanJson.model_validate_json(cached_plan_json)
                    # For a real application, you'd also fetch the full WorkoutPlan from DB
                    # if the JSON alone is not sufficient, or store the full WorkoutPlan in cache.
                    # For now, we'll just return a mock WorkoutPlan with the cached JSON.
                    # This needs to be improved to actually fetch/construct a full WorkoutPlan object.
                    
                    # Placeholder for constructing a full WorkoutPlan object from cache
                    # This part needs actual implementation based on how WorkoutPlan is saved in DB
                    # and how much info we want in cache.
                    # For now, raise an error to force actual generation until proper caching is implemented.
                    raise NotImplementedError("Full WorkoutPlan object construction from cache not implemented.")
                    
                    # Example of what a full cached WorkoutPlan might look like if stored
                    # workout_plan_data = {
                    #     "id": "some_uuid", # Need to get this from somewhere, maybe stored in cache too
                    #     "user_id": user_id,
                    #     "plan_date": date.today(),
                    #     "plan_json": workout_plan_json,
                    #     "status": "cached",
                    #     "created_at": date.today(),
                    #     "updated_at": date.today(),
                    # }
                    # return WorkoutPlan(**workout_plan_data)
                except Exception as e:
                    print(f"Error validating cached plan: {e}")
                    # Invalidate corrupted cache entry
                    self.redis_client.delete(cache_key)

        # 2. Data Fetching (Placeholders)
        # Fetch user profile from Supabase (`users` table)
        user_profile = self._fetch_user_profile(user_id)
        if not user_profile:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User profile not found")

        # Fetch recent workout history from Supabase (`workout_logs` table)
        workout_history = self._fetch_recent_workout_history(user_id)

        # 3. Prompt Construction
        system_prompt = self._construct_system_prompt()
        user_prompt = self._construct_user_prompt(
            user_profile, daily_context_data, workout_history, simulated_recovery_data
        )

        # 4. OpenAI API Call
        try:
            response = self.openai_client.chat.completions.create(
                model=settings.OPENAI_MODEL, # Assuming model is defined in settings
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                response_format={"type": "json_object"},
                temperature=settings.OPENAI_TEMPERATURE, # Assuming temperature is defined in settings
            )
            ai_response_content = response.choices[0].message.content
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to get response from OpenAI API: {e}",
            )

        if not ai_response_content:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="OpenAI API returned empty response.",
            )

        # 5. Response Validation
        try:
            workout_plan_json = WorkoutPlanJson.model_validate_json(ai_response_content)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"OpenAI API returned invalid JSON: {e}",
            )

        # 6. Save to DB (Placeholder)
        # This part needs to interact with Supabase to save the WorkoutPlan.
        # You'll need to generate a new UUID for the plan.
        # Also, need to ensure the plan_date, status, created_at, updated_at are set correctly.
        try:
            # Placeholder for actual database insertion
            new_plan_id = UUID("00000000-0000-0000-0000-000000000000") # Replace with actual UUID generation
            # self.supabase_client.from_('workout_plans').insert({
            #     "id": str(new_plan_id),
            #     "user_id": str(user_id),
            #     "plan_date": workout_plan_json.date.isoformat(),
            #     "plan_json": workout_plan_json.model_dump_json(),
            #     "status": "generated", # Initial status
            #     "created_at": date.today().isoformat(),
            #     "updated_at": date.today().isoformat(),
            # }).execute()
            
            # Construct a WorkoutPlan object for return
            generated_workout_plan = WorkoutPlan(
                id=new_plan_id, # This will be the actual ID from DB
                user_id=user_id,
                plan_date=workout_plan_json.date,
                plan_json=workout_plan_json,
                status="generated",
                created_at=date.today(),
                updated_at=date.today()
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to save workout plan to database: {e}",
            )

        # 7. Cache Response
        self.redis_client.setex(cache_key, settings.REDIS_CACHE_EXPIRATION, workout_plan_json.model_dump_json())

        return generated_workout_plan

    def _fetch_user_profile(self, user_id: UUID) -> Optional[Dict[str, Any]]:
        # Placeholder for fetching user profile from Supabase
        # Example: self.supabase_client.from_('users').select('*').eq('id', str(user_id)).single().execute()
        # For now, return a mock profile
        return {
            "id": str(user_id),
            "goals": "Build muscle, improve strength",
            "equipment": ["Dumbbells", "Barbell", "Bench"],
            "injuries": "None",
            "preferences": "Prefer evening workouts",
        }

    def _fetch_recent_workout_history(self, user_id: UUID) -> List[Dict[str, Any]]:
        # Placeholder for fetching recent workout history from Supabase
        # Example: self.supabase_client.from_('workout_logs').select('*').eq('user_id', str(user_id)).order('log_time', desc=True).limit(7).execute()
        # For now, return mock history
        return [
            {"date": "2025-12-01", "exercise": "Squats", "sets": 3, "reps": 8, "weight": 100},
            {"date": "2025-12-01", "exercise": "Bench Press", "sets": 3, "reps": 8, "weight": 70},
        ]

    def _construct_system_prompt(self) -> str:
        # System prompt from Architecture.md
        return """
You are an expert personal training AI. Your name is "Atlas". Your goal is to create safe, effective, and personalized workout plans based on the user's profile, daily context, and recent history.

You MUST follow these rules:
1.  Always respond with a single, valid JSON object. Do not include any text, explanations, or markdown formatting before or after the JSON.
2.  The JSON must strictly adhere to the provided schema.
3.  Prioritize user safety. Take injuries, soreness, and low energy levels seriously by reducing volume, intensity, or suggesting alternative exercises.
4.  Base your plan on the equipment the user has available. Do not suggest exercises requiring equipment they do not have.
5.  Align the workout with the user's stated goals and focus for the day.
        """

    def _construct_user_prompt(
        self,
        user_profile: Dict[str, Any],
        daily_context_data: Dict[str, Any],
        workout_history: List[Dict[str, Any]],
        simulated_recovery_data: Optional[Dict[str, Any]],
    ) -> str:
        # User prompt template from Architecture.md
        goals = user_profile.get("goals", "No specific goals provided.")
        equipment = ", ".join(user_profile.get("equipment", ["No equipment specified."]))
        injuries = user_profile.get("injuries", "None.")
        preferences = user_profile.get("preferences", "No specific preferences.")

        mood = daily_context_data.get("mood", "neutral")
        energy = daily_context_data.get("energy", "normal")
        soreness = daily_context_data.get("soreness", "none")
        notes = daily_context_data.get("notes", "No additional notes.")

        history_summary = "No recent workout history."
        if workout_history:
            history_summary = "\n".join(
                f"- {h['date']}: {h['exercise']} {h['sets']}x{h['reps']} @ {h['weight']}kg"
                for h in workout_history
            )

        recovery_info = ""
        if simulated_recovery_data:
            recovery_info = f"\n**Simulated Recovery Data:**\n- HRV: {simulated_recovery_data.get('hrv')}\n- Sleep: {simulated_recovery_data.get('sleep')} hours"

        # This needs to be dynamic based on user's input/focus for the day
        focus_of_the_day = "overall fitness" 

        return f"""
Generate a workout plan for today ({date.today().isoformat()}).

**User Profile:**
- Goals: {goals}
- Available Equipment: {equipment}
- Injuries/Limitations: {injuries}
- Preferences: {preferences}

**Daily Context:**
- Mood: {mood}
- Energy: {energy}
- Soreness: {soreness}
- Notes: {notes}

**Recent Workout Summary (Last 7 Days):**
{history_summary}
{recovery_info}

Based on this information, create a complete workout plan in the required JSON format. The primary focus for today should be on {focus_of_the_day}.
        """
