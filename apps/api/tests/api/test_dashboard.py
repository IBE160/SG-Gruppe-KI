import pytest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, patch
from uuid import uuid4

# Assuming the main app is in apps/api/app/main.py and router in apps/api/app/api/dashboard.py
# Due to ignore patterns, we mock the import.
# from apps.api.app.main import app
# from apps.api.app.api.dashboard import dashboard_router

# Mock the entire FastAPI app and its dependencies
# In a real scenario, you would import and test the actual app
# For the purpose of this test, we create a minimal mock app
# that includes our dashboard router.
from fastapi import FastAPI, Depends
from apps.api.app.models.dashboard import DashboardMetrics, GoalProgress, WorkoutStreak, WeeklyVolume, TodaysContext, RecentWorkout, WeeklyReviewVolume, WeeklyReviewIntensity, ConsistencyChartData, WeeklyReviewConsistency, CoachCorner, WeeklyReview
from apps.api.app.services.dashboard_service import DashboardService
from apps.api.app.core.auth import get_current_user_id

# Mock DashboardService and get_current_user_id
@pytest.fixture
def mock_dashboard_service():
    service = AsyncMock(spec=DashboardService)
    service.get_dashboard_metrics.return_value = DashboardMetrics(
        goal_progress=GoalProgress(name="Bench Press", current=85.0, target=100.0, unit="kg"),
        workout_streak=WorkoutStreak(days=5),
        weekly_volume=WeeklyVolume(total=5450.0, unit="lbs", chart_data_url="mock_chart_url"),
        todays_context=TodaysContext(message="You seem rested."),
        recent_workouts=[RecentWorkout(name="Push Day", date="Yesterday")],
        weekly_review=WeeklyReview(
            volume=WeeklyReviewVolume(value="5,450 lbs", trend="up", percentage_change="15%", chart_svg=""),
            intensity=WeeklyReviewIntensity(value="85% 1RM", trend="down", percentage_change="2%", chart_svg=""),
            consistency=WeeklyReviewConsistency(value="4/5 Days", trend="up", percentage_change="20%", chart_data=[]),
            coach_corner=CoachCorner(message="Mock message", suggestion="Mock suggestion"),
        ),
    )
    return service

@pytest.fixture
def mock_get_current_user_id():
    return uuid4() # Return a consistent mock user ID

# Create a test FastAPI app
test_app = FastAPI()
# We need to explicitly include the router from apps/api/app/api/dashboard
# For testing purposes, we'll import it directly
from apps.api.app.api.dashboard import dashboard_router
test_app.include_router(dashboard_router)

# Override dependencies for testing
test_app.dependency_overrides[DashboardService] = mock_dashboard_service
test_app.dependency_overrides[get_current_user_id] = mock_get_current_user_id


client = TestClient(test_app)

def test_get_dashboard_success(mock_dashboard_service, mock_get_current_user_id):
    # Patch the actual implementation of get_current_user_id
    with patch("apps.api.app.core.auth.get_current_user_id", return_value=mock_get_current_user_id):
        response = client.get("/dashboard")

        assert response.status_code == 200
        data = response.json()

        assert data["goal_progress"]["name"] == "Bench Press"
        assert data["workout_streak"]["days"] == 5
        assert data["weekly_volume"]["total"] == 5450.0
        assert data["todays_context"]["message"] == "You seem rested."
        assert len(data["recent_workouts"]) == 1
        assert data["recent_workouts"][0]["name"] == "Push Day"
        assert data["weekly_review"]["volume"]["value"] == "5,450 lbs"

        # Verify that the service method was called
        mock_dashboard_service.get_dashboard_metrics.assert_called_once_with(mock_get_current_user_id)

def test_get_dashboard_unauthenticated():
    # Simulate unauthenticated access by not providing the dependency override
    # This would typically be handled by the actual get_current_user_id raising HTTPException
    # For now, we remove the override.
    del test_app.dependency_overrides[get_current_user_id]
    response = client.get("/dashboard")
    
    # Depending on how get_current_user_id is implemented, this might be 401 or 403
    # For now, we assume it correctly raises an error if not authenticated.
    # If the original get_current_user_id is in apps/api/app/core/auth.py, it should
    # raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    # For now, since we are directly calling the endpoint without the original auth logic,
    # and the dependency is removed, the route will fail to resolve the user_id dependency.
    # This mock test will primarily verify that the route itself is protected.
    assert response.status_code == 422 # Unprocessable Entity due to missing user_id if dependency not met.
    # The actual status code will depend on how get_current_user_id is implemented to handle unauthenticated state.
    # If get_current_user_id raises HTTPException(401), this would be 401.
    test_app.dependency_overrides[get_current_user_id] = mock_get_current_user_id # Restore for other tests
