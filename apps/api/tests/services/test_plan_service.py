import pytest
from unittest.mock import MagicMock, patch
from app.services.plan_service import PlanService
from app.models.workout_plan import WorkoutPlanModel, WorkoutDay, Exercise
from datetime import date
import os

@pytest.fixture
def mock_supabase_client():
    with patch.dict(os.environ, {"SUPABASE_URL": "http://mock.supabase.com", "SUPABASE_KEY": "mock_key"}):
        with patch("app.services.plan_service.create_client") as mock_create_client:
            mock_client = MagicMock()
            mock_create_client.return_value = mock_client
            yield mock_client

@pytest.fixture
def plan_service(mock_supabase_client):
    service = PlanService()
    return service

@pytest.mark.asyncio
async def test_store_workout_plan_success(plan_service, mock_supabase_client):
    mock_execute_response = MagicMock()
    mock_execute_response.data = [{"id": "some_uuid", "user_id": "test_user", "plan_date": str(date.today()), "plan_details": {}, "ai_explanation": "Test explanation"}]
    mock_supabase_client.from_.return_value.insert.return_value.execute.return_value = mock_execute_response

    exercise = Exercise(name="Test Exercise", sets=3, reps="10")
    workout_day = WorkoutDay(day_name="Monday", exercises=[exercise])
    workout_plan = WorkoutPlanModel(
        user_id="test_user",
        plan_date=date.today(),
        workout_days=[workout_day],
        ai_explanation="Test explanation"
    )

    stored_plan = await plan_service.store_workout_plan(workout_plan)

    assert stored_plan is not None
    assert stored_plan.user_id == "test_user"
    mock_supabase_client.from_.assert_called_with("WorkoutPlans")
    mock_supabase_client.from_.return_value.insert.assert_called_once()
    mock_supabase_client.from_.return_value.insert.return_value.execute.assert_called_once()

@pytest.mark.asyncio
async def test_store_workout_plan_no_data_returned(plan_service, mock_supabase_client):
    mock_execute_response = MagicMock()
    mock_execute_response.data = None # Simulate no data returned
    mock_execute_response.status_code = 200 # But status code is ok
    mock_supabase_client.from_.return_value.insert.return_value.execute.return_value = mock_execute_response

    exercise = Exercise(name="Test Exercise", sets=3, reps="10")
    workout_day = WorkoutDay(day_name="Monday", exercises=[exercise])
    workout_plan = WorkoutPlanModel(
        user_id="test_user",
        plan_date=date.today(),
        workout_days=[workout_day]
    )

    stored_plan = await plan_service.store_workout_plan(workout_plan)
    assert stored_plan is None

@pytest.mark.asyncio
async def test_store_workout_plan_exception_during_insert(plan_service, mock_supabase_client):
    mock_supabase_client.from_.return_value.insert.return_value.execute.side_effect = Exception("DB error")

    exercise = Exercise(name="Test Exercise", sets=3, reps="10")
    workout_day = WorkoutDay(day_name="Monday", exercises=[exercise])
    workout_plan = WorkoutPlanModel(
        user_id="test_user",
        plan_date=date.today(),
        workout_days=[workout_day]
    )

    with pytest.raises(Exception, match="DB error"):
        await plan_service.store_workout_plan(workout_plan)

def test_plan_service_init_missing_env_vars():
    with patch.dict(os.environ, clear=True): # Clear env vars
        with pytest.raises(ValueError, match="Supabase URL and Key must be set as environment variables."):
            PlanService()
