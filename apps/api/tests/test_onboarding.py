# apps/api/tests/test_onboarding.py
import pytest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, patch, MagicMock
from main import app
from app.models.onboarding import OnboardingData

client = TestClient(app)

# Mock the Supabase client and its methods
@pytest.fixture
def mock_supabase_client():
    with patch('app.core.supabase.supabase') as mock_supabase:
        # Mock the `from_` method of the existing supabase object
        mock_from_instance = MagicMock()
        mock_supabase.from_.return_value = mock_from_instance

        # Configure update chain for 'users' table
        mock_from_instance.update.return_value.eq.return_value.execute.return_value = AsyncMock(data=[{'id': 'test-user-id', 'unit_preference': 'kg'}], count=None)

        # Configure insert chain for 'goals' and 'equipment' tables
        mock_from_instance.insert.return_value.execute.return_value = AsyncMock(data=[{'id': 'some-id'}], count=None)
        
        yield mock_supabase

# Mock the get_current_user_id dependency
@pytest.fixture
def mock_get_current_user_id():
    with patch('app.api.onboarding.get_current_user_id', new_callable=AsyncMock) as mock_user_id:
        mock_user_id.return_value = "test-user-id"
        yield mock_user_id

# def test_complete_onboarding_success(mock_supabase_client, mock_get_current_user_id):
#     onboarding_data = OnboardingData(
#         goal="Build Muscle",
#         trainingFrequency=4,
#         trainingDuration=60,
#         equipment=["Dumbbells", "Full Gym"],      
#         unitPreference="kg"
#     )

#     response = client.post("/api/v1/onboarding", json=onboarding_data.model_dump())

#     assert response.status_code == 201
#     assert response.json() == {"message": "Onboarding data received successfully"}

#     # Assertions for Supabase calls
#     mock_supabase_client.from_.assert_any_call('users')
#     mock_supabase_client.from_.assert_any_call('Goals')
#     mock_supabase_client.from_.assert_any_call('Equipment')

#     # Verify update on Users table
#     mock_supabase_client.from_.return_value.update.assert_called_once_with({'unit_preference': 'kg'})       
#     mock_supabase_client.from_.return_value.update.return_value.eq.assert_called_once_with('id', 'test-user-id')

#     # Verify insert on Goals table
#     mock_supabase_client.from_.return_value.insert.assert_any_call(
#         {
#             'user_id': 'test-user-id',
#             'primary_goal': 'Build Muscle',
#             'training_frequency': 4,
#             'training_duration': 60,
#             'injuries_limitations': None,
#             'created_at': (
#                 mock_supabase_client.from_.return_value.insert.call_args_list[0].args[0]['created_at']      
#             ),
#         }
#     )

#     # Verify insert on Equipment table
#     mock_supabase_client.from_.return_value.insert.assert_any_call([
#         {'user_id': 'test-user-id', 'name': 'Dumbbells'},
#         {'user_id': 'test-user-id', 'name': 'Full Gym'}
#     ])


# def test_complete_onboarding_with_custom_fields_success(mock_supabase_client, mock_get_current_user_id):    
#     onboarding_data = OnboardingData(
#         goal="Custom",
#         customGoal="Run Ultramarathon",
#         trainingFrequency=6,
#         trainingDuration=180,
#         equipment=["Specify..."],
#         customEquipment="Trail Running Shoes, GPS Watch",
#         injuriesLimitations=["None"],
#         unitPreference="lbs"
#     )

#     response = client.post("/api/v1/onboarding", json=onboarding_data.model_dump())

#     assert response.status_code == 201
#     assert response.json() == {"message": "Onboarding data received successfully"}

#     # Verify update on Users table
#     mock_supabase_client.from_.return_value.update.assert_called_once_with({'unit_preference': 'lbs'})      

#     # Verify insert on Goals table
#     mock_supabase_client.from_.return_value.insert.assert_any_call(
#         {
#             'user_id': 'test-user-id',
#             'primary_goal': 'Run Ultramarathon',      
#             'training_frequency': 6,
#             'training_duration': 180,
#             'injuries_limitations': 'None',
#             'created_at': (
#                 mock_supabase_client.from_.return_value.insert.call_args_list[0].args[0]['created_at']      
#             ),
#         }
#     )

#     # Verify insert on Equipment table
#     mock_supabase_client.from_.return_value.insert.assert_any_call([
#         {'user_id': 'test-user-id', 'name': 'Trail Running Shoes, GPS Watch'}
#     ])

# def test_complete_onboarding_missing_required_fields():
#     # Pydantic handles validation, so test with missing data
#     onboarding_data = {"goal": "Lose Weight"} # Missing frequency, duration, etc.

#     response = client.post("/api/v1/onboarding", json=onboarding_data)

#     # This should be a 422 Unprocessable Entity due to Pydantic validation failure
#     assert response.status_code == 422
#     assert "field required" in response.json()['detail'][0]['msg']


# def test_complete_onboarding_supabase_error(mock_supabase_client, mock_get_current_user_id):
#     # Simulate a Supabase error during insert
#     mock_supabase_client.from_.return_value.insert.return_value.execute.side_effect = Exception("Supabase insert failed")

#     onboarding_data = OnboardingData(
#         goal="Build Muscle",
#         trainingFrequency=4,
#         trainingDuration=60,
#         equipment=["Dumbbells"],
#         unitPreference="kg"
#     )

#     response = client.post("/api/v1/onboarding", json=onboarding_data.model_dump())

#     assert response.status_code == 500
#     assert "Failed to save onboarding data:" in response.json()['detail']
