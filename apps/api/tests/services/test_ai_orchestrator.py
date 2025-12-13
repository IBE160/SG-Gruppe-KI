import pytest
from unittest.mock import AsyncMock, patch
from app.services.ai_orchestrator import AIOrchestratorService
from app.models.workout_plan import WorkoutPlanModel, WorkoutDay, Exercise, PlanGenerationContext
from datetime import date
from pydantic import ValidationError
import os
import os # Add this import

class MockCompletion:
    def __init__(self, content: str):
        self.choices = [MockChoice(content)]

class MockChoice:
    def __init__(self, content: str):
        self.message = MockMessage(content)

class MockMessage:
    def __init__(self, content: str):
        self.content = content

# Mock OpenAI client response
MOCK_OPENAI_SUCCESS_CONTENT = '{"user_id": "test_user", "plan_date": "2025-12-13", "workout_days": [{"day_name": "Monday", "exercises": [{"name": "Mock Squat", "sets": 3, "reps": "8-10"}]}], "ai_explanation": "Plan adapted due to high energy."}'
MOCK_OPENAI_INVALID_JSON_CONTENT = '{"user_id": "test_user", "plan_date": "2025-12-13", "workout_days": [{"day_name": "Monday", "exercises": [{"name": "Mock Squat", "sets": 3, "reps": "8-10"}]}], "ai_explanation": "Plan adapted due to high energy."'
MOCK_OPENAI_VALIDATION_ERROR_CONTENT = '{"user_id": "test_user", "plan_date": "2025-12-13", "workout_days": [{"day_name": "Monday", "exercises": [{"name": "Mock Squat", "sets": "invalid", "reps": "8-10"}]}], "ai_explanation": "Plan adapted due to high energy."}'

# In the tests, set return_value to MockCompletion(content)
# Example: mock_openai_client.chat.completions.create.return_value = MockCompletion(MOCK_OPENAI_SUCCESS_CONTENT)


@pytest.fixture
def ai_orchestrator_service():
    with patch.dict(os.environ, {"OPENAI_API_KEY": "test_key"}):
        with patch("app.services.ai_orchestrator.OpenAI") as MockOpenAI:
            mock_instance = MockOpenAI.return_value
            mock_create_method = AsyncMock()
            mock_instance.chat.completions.create = mock_create_method
            service = AIOrchestratorService()
            yield service, mock_create_method

@pytest.mark.asyncio
async def test_generate_workout_plan_success(ai_orchestrator_service):
    service, mock_create_method = ai_orchestrator_service
    mock_create_method.return_value = MockCompletion(MOCK_OPENAI_SUCCESS_CONTENT)

    user_id = "test_user"
    user_profile = {"level": "beginner"}
    user_goals = {"main": "strength"}
    workout_history = []
    context = PlanGenerationContext(mood="happy")

    plan = await service.generate_workout_plan(user_id, user_profile, user_goals, workout_history, context)

    assert isinstance(plan, WorkoutPlanModel)
    assert plan.user_id == "test_user"
    assert plan.plan_date == date(2025, 12, 13)
    assert plan.ai_explanation == "Plan adapted due to high energy."
    assert plan.workout_days[0].exercises[0].name == "Mock Squat"
    mock_create_method.assert_awaited_once()

@pytest.mark.asyncio
async def test_generate_workout_plan_invalid_json(ai_orchestrator_service):
    service, mock_create_method = ai_orchestrator_service
    mock_create_method.return_value = MockCompletion(MOCK_OPENAI_INVALID_JSON_CONTENT)

    user_id = "test_user"
    user_profile = {"level": "beginner"}
    user_goals = {"main": "strength"}
    workout_history = []
    context = PlanGenerationContext(mood="happy")

    with pytest.raises(ValueError, match="AI response was not valid JSON."):
        await service.generate_workout_plan(user_id, user_profile, user_goals, workout_history, context)
    mock_create_method.assert_awaited_once()
@pytest.mark.asyncio
async def test_generate_workout_plan_validation_error(ai_orchestrator_service):
    service, mock_create_method = ai_orchestrator_service
    mock_create_method.return_value = MockCompletion(MOCK_OPENAI_VALIDATION_ERROR_CONTENT)

    user_id = "test_user"
    user_profile = {"level": "beginner"}
    user_goals = {"main": "strength"}
    workout_history = []
    context = PlanGenerationContext(mood="happy")

    with pytest.raises(ValueError, match="AI response validation failed"):
        await service.generate_workout_plan(user_id, user_profile, user_goals, workout_history, context)
    mock_create_method.assert_awaited_once()
@pytest.mark.asyncio
async def test_generate_workout_plan_openai_error(ai_orchestrator_service):
    service, mock_create_method = ai_orchestrator_service
    mock_create_method.side_effect = Exception("OpenAI API call failed")

    user_id = "test_user"
    user_profile = {"level": "beginner"}
    user_goals = {"main": "strength"}
    workout_history = []
    context = PlanGenerationContext(mood="happy")

    with pytest.raises(RuntimeError, match="Failed to generate plan from OpenAI: OpenAI API call failed"):
        await service.generate_workout_plan(user_id, user_profile, user_goals, workout_history, context)
    mock_create_method.assert_awaited_once()
