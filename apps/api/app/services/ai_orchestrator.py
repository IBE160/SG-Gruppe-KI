import os
from openai import OpenAI
from typing import Dict, Any, List, Optional
import json
from pydantic import ValidationError

from app.models.workout_plan import WorkoutPlanModel, PlanGenerationContext

class AIOrchestratorService:
    def __init__(self):
        self.openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        # For now, a placeholder system prompt. This will be refined.
        self.system_prompt = """
        You are an AI personal trainer. Your task is to generate a personalized daily workout plan in JSON format.
        The plan should adapt to the user's profile, goals, workout history, and current daily context.
        Provide an 'ai_explanation' field if the plan is adapted based on the user's daily context.

        The JSON structure must adhere to the following Pydantic model:
        {
            "user_id": "string",
            "plan_date": "YYYY-MM-DD",
            "workout_days": [
                {
                    "day_name": "string",
                    "exercises": [
                        {
                            "name": "string",
                            "sets": "integer",
                            "reps": "string",
                            "rpe": "integer | null",
                            "weight": "string | null",
                            "tempo": "string | null",
                            "rest_interval": "string | null",
                            "notes": "string | null"
                        }
                    ]
                }
            ],
            "ai_explanation": "string | null"
        }
        """

    async def construct_prompt(
        self,
        user_id: str,
        user_profile: Dict[str, Any],
        user_goals: Dict[str, Any],
        workout_history: List[Dict[str, Any]],
        context: PlanGenerationContext
    ) -> str:
        # Placeholder for complex prompt construction
        # In a real scenario, this would dynamically build a detailed prompt
        # based on all the provided user data.
        prompt_parts = [
            f"User ID: {user_id}",
            f"User Profile: {json.dumps(user_profile)}",
            f"User Goals: {json.dumps(user_goals)}",
            f"Current Context: {json.dumps(context.model_dump())}",
            "Generate a workout plan strictly following the JSON schema provided in the system prompt."
        ]
        return "\n".join(prompt_parts)

    async def generate_workout_plan(
        self,
        user_id: str,
        user_profile: Dict[str, Any],
        user_goals: Dict[str, Any],
        workout_history: List[Dict[str, Any]],
        context: PlanGenerationContext
    ) -> WorkoutPlanModel:
        prompt = await self.construct_prompt(user_id, user_profile, user_goals, workout_history, context)

        try:
            # Call OpenAI API
            chat_completion = await self.openai_client.chat.completions.create(
                model="gpt-4o",  # Or another suitable model
                messages=[
                    {"role": "system", "content": self.system_prompt},
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"}
            )
            
            # Extract JSON response
            raw_response_content = chat_completion.choices[0].message.content
            plan_data = json.loads(raw_response_content)

            # Validate against Pydantic model
            workout_plan = WorkoutPlanModel(**plan_data)
            return workout_plan

        except ValidationError as e:
            raise ValueError(f"AI response validation failed: {e.errors()}")
        except json.JSONDecodeError:
            raise ValueError("AI response was not valid JSON.")
        except Exception as e:
            # Handle other potential OpenAI API errors
            raise RuntimeError(f"Failed to generate plan from OpenAI: {e}")
