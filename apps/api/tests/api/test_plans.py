import pytest
from fastapi.testclient import TestClient as FastAPIClient
from app.main import create_app
from app.api.plans import get_ai_orchestrator_service, get_plan_service
from unittest.mock import AsyncMock, patch
from app.models.workout_plan import PlanGenerationRequest, PlanGenerationResponse, WorkoutPlanModel, WorkoutDay, Exercise, PlanGenerationContext
from datetime import date

# Fixture to create a TestClient for testing FastAPI endpoints
@pytest.fixture(scope="module")
def client():
    app = create_app()
    with FastAPIClient(app) as c:
        yield c
    app.dependency_overrides.clear()





def test_generate_plan_success(client: FastAPIClient):
    with patch('app.api.plans.AIOrchestratorService') as MockAIOrchestratorService, \
         patch('app.api.plans.PlanService') as MockPlanService:
        mock_ai_instance = MockAIOrchestratorService.return_value
        mock_plan_instance = MockPlanService.return_value

        mock_ai_instance.generate_workout_plan = AsyncMock()
        mock_plan_instance.store_workout_plan = AsyncMock()

        # Mock AI Orchestrator to return a valid plan
        mock_workout_plan = WorkoutPlanModel(
            user_id="test_user_id",
            plan_date=date.today(),
            workout_days=[
                WorkoutDay(day_name="Monday", exercises=[Exercise(name="Mock Squat", sets=3, reps="8-10")])
            ],
            ai_explanation="AI generated this plan."
        )
        mock_ai_instance.generate_workout_plan.return_value = mock_workout_plan
        
        # Mock PlanService to indicate successful storage
        mock_plan_instance.store_workout_plan.return_value = mock_workout_plan

        request_data = {
            "context": {
                "mood": "motivated",
                "energy": "high"
            }
        }

        response = client.post("/plans/generate", json=request_data)
        
        assert response.status_code == 200
        response_json = response.json()
        assert response_json["message"] == "Workout plan generated successfully"
        assert response_json["data"]["user_id"] == "test_user_id"
        assert response_json["data"]["ai_explanation"] == "AI generated this plan."
        mock_ai_instance.generate_workout_plan.assert_awaited_once()
        mock_plan_instance.store_workout_plan.assert_awaited_once()

def test_generate_plan_ai_validation_error(client: FastAPIClient):
    with patch('app.api.plans.AIOrchestratorService') as MockAIOrchestratorService, \
         patch('app.api.plans.PlanService') as MockPlanService:
        mock_ai_instance = MockAIOrchestratorService.return_value
        mock_plan_instance = MockPlanService.return_value

        mock_ai_instance.generate_workout_plan = AsyncMock(side_effect=ValueError("AI response validation failed"))
        mock_plan_instance.store_workout_plan = AsyncMock() # Ensure this is an AsyncMock

        request_data = {
            "context": {
                "mood": "bad"
            }
        }

        response = client.post("/plans/generate", json=request_data)
        
        assert response.status_code == 422
        assert "AI response validation failed" in response.json()["detail"]
        mock_ai_instance.generate_workout_plan.assert_awaited_once()
        mock_plan_instance.store_workout_plan.assert_not_awaited() # Should not call store if AI fails

def test_generate_plan_storage_failure(client: FastAPIClient):
    with patch('app.api.plans.AIOrchestratorService') as MockAIOrchestratorService, \
         patch('app.api.plans.PlanService') as MockPlanService:
        mock_ai_instance = MockAIOrchestratorService.return_value
        mock_plan_instance = MockPlanService.return_value

        mock_ai_instance.generate_workout_plan = AsyncMock()
        mock_plan_instance.store_workout_plan = AsyncMock()

        mock_workout_plan = WorkoutPlanModel(
            user_id="test_user_id",
            plan_date=date.today(),
            workout_days=[
                WorkoutDay(day_name="Monday", exercises=[Exercise(name="Mock Squat", sets=3, reps="8-10")])
            ],
            ai_explanation="AI generated this plan."
        )
        mock_ai_instance.generate_workout_plan.return_value = mock_workout_plan
        mock_plan_instance.store_workout_plan.return_value = None # Simulate storage failure

        request_data = {
            "context": {
                "mood": "motivated"
            }
        }

        response = client.post("/plans/generate", json=request_data)
        
        assert response.status_code == 500
        assert "Failed to generate or store workout plan" in response.json()["detail"]
        mock_ai_instance.generate_workout_plan.assert_awaited_once()
        mock_plan_instance.store_workout_plan.assert_awaited_once()

def test_generate_plan_general_exception(client: FastAPIClient):
    with patch('app.api.plans.AIOrchestratorService') as MockAIOrchestratorService, \
         patch('app.api.plans.PlanService') as MockPlanService:
        mock_ai_instance = MockAIOrchestratorService.return_value
        mock_plan_instance = MockPlanService.return_value

        mock_ai_instance.generate_workout_plan = AsyncMock(side_effect=Exception("Unknown AI error"))
        mock_plan_instance.store_workout_plan = AsyncMock() # Ensure this is an AsyncMock

        request_data = {
            "context": {
                "mood": "motivated"
            }
        }

        response = client.post("/plans/generate", json=request_data)
        
        assert response.status_code == 500
        assert "Failed to generate or store workout plan" in response.json()["detail"]
        mock_ai_instance.generate_workout_plan.assert_awaited_once()
        mock_plan_instance.store_workout_plan.assert_not_awaited()

def test_read_root(client: FastAPIClient):
    response = client.get("/plans/")
    assert response.status_code == 200
    assert response.json() == {"message": "Plans API is working!"}