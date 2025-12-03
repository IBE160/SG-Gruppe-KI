import pytest
import httpx
from unittest.mock import MagicMock
from uuid import UUID
from datetime import date
import json

from backend.app.main import app
from backend.app.schemas.workout_plan import WorkoutPlanJson, WorkoutPlan, Set, Exercise, Block
from backend.app.services.ai_plan_service import AIPlanGenerationService # To inspect internal methods

# Mock UUID for testing
TEST_USER_ID = UUID("a1b2c3d4-e5f6-7890-1234-567890abcdef")

# Mock WorkoutPlanJson content
mock_workout_plan_json_content = WorkoutPlanJson(
    version=1,
    date=date.today(),
    goal="Build muscle",
    focus="Upper body strength",
    estimated_duration_minutes=60,
    notes="Focus on progressive overload.",
    blocks=[
        Block(
            name="Warm-up",
            type="warmup",
            exercises=[
                Exercise(name="Jumping Jacks", muscle_groups=["Full Body"], sets=[Set(set_number=1, target_reps="30s")]),
            ],
        ),
        Block(
            name="Main Lift",
            type="strength",
            exercises=[
                Exercise(
                    name="Bench Press",
                    muscle_groups=["Chest", "Shoulders", "Triceps"],
                    sets=[
                        Set(set_number=1, target_reps=5, target_weight=70.0, target_rpe=7, rest_seconds=120),
                        Set(set_number=2, target_reps=5, target_weight=70.0, target_rpe=7, rest_seconds=120),
                        Set(set_number=3, target_reps=5, target_weight=70.0, target_rpe=7, rest_seconds=120),
                    ],
                ),
            ],
        ),
    ],
)

# Mock WorkoutPlan object for full return type
mock_workout_plan_object = WorkoutPlan(
    id=UUID("00000000-0000-0000-0000-000000000000"), # Will be replaced by actual generated ID in real scenario
    user_id=TEST_USER_ID,
    plan_date=date.today(),
    plan_json=mock_workout_plan_json_content,
    status="generated",
    created_at=date.today(),
    updated_at=date.today(),
)

@pytest.fixture(scope="module")
async def client():
    async with httpx.AsyncClient(app=app, base_url="http://test") as c:
        yield c

@pytest.mark.asyncio
async def test_generate_workout_plan_success(
    client: httpx.AsyncClient,
    mock_openai_client: MagicMock,
    mock_redis_client: MagicMock,
    mock_supabase_client: MagicMock,
    mocker # Use mocker for more granular control over patches
):
    # Mock OpenAI response
    mock_openai_client.chat.completions.create.return_value = MagicMock(
        choices=[MagicMock(message=MagicMock(content=json.dumps(mock_workout_plan_json_content.model_dump())))]
    )

    # Mock Supabase insert operation
    mock_insert_response = MagicMock()
    mock_insert_response.data = [{"id": str(mock_workout_plan_object.id)}] # Mimic Supabase returning the inserted ID
    mock_supabase_client.from_.return_value.insert.return_value.execute.return_value = mock_insert_response

    # Mock internal methods of AIPlanGenerationService for data fetching
    # We are testing the API endpoint and service orchestration, not the actual data fetching
    mocker.patch.object(AIPlanGenerationService, '_fetch_user_profile', return_value={
        "id": str(TEST_USER_ID),
        "goals": "Build muscle",
        "equipment": ["Dumbbells", "Barbell", "Bench"],
        "injuries": "None",
        "preferences": "Prefer evening workouts",
    })
    mocker.patch.object(AIPlanGenerationService, '_fetch_recent_workout_history', return_value=[])

    # Ensure get_current_user_placeholder returns our TEST_USER_ID
    mocker.patch("backend.app.api.v1.workout_plans.get_current_user_placeholder", return_value=TEST_USER_ID)

    daily_context_data = {
        "mood": "happy",
        "energy": "high",
        "soreness": "none",
        "notes": "Ready to hit the gym!",
    }

    response = await client.post(
        "/api/v1/workout_plans/generate",
        json={"daily_context_data": daily_context_data},
    )

    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert UUID(data["id"]) == mock_workout_plan_object.id # Should match the mocked ID
    assert UUID(data["user_id"]) == TEST_USER_ID
    assert data["plan_json"] == mock_workout_plan_json_content.model_dump(by_alias=True, exclude_none=True)
    assert data["status"] == "generated"

    # Assert OpenAI was called
    mock_openai_client.chat.completions.create.assert_called_once()
    
    # Assert Supabase insert was called with the correct data (excluding generated IDs/timestamps)
    # The actual insert will have the generated ID and timestamps
    mock_supabase_client.from_.return_value.insert.assert_called_once()
    insert_call_args = mock_supabase_client.from_.return_value.insert.call_args[0][0][0]
    assert UUID(insert_call_args["user_id"]) == TEST_USER_ID
    assert insert_call_args["plan_date"] == date.today().isoformat()
    assert json.loads(insert_call_args["plan_json"]) == mock_workout_plan_json_content.model_dump(by_alias=True, exclude_none=True)
    assert insert_call_args["status"] == "generated"

    # Assert Redis setex was called
    mock_redis_client.setex.assert_called_once()
    redis_call_args = mock_redis_client.setex.call_args
    assert redis_call_args[0][0] == f"workout_plan:{TEST_USER_ID}:{date.today().isoformat()}"
    assert json.loads(redis_call_args[0][1]) == mock_workout_plan_json_content.model_dump()

@pytest.mark.asyncio
async def test_generate_workout_plan_invalid_openai_json(
    client: httpx.AsyncClient,
    mock_openai_client: MagicMock,
    mock_redis_client: MagicMock,
    mock_supabase_client: MagicMock,
    mocker
):
    # Mock OpenAI to return invalid JSON
    mock_openai_client.chat.completions.create.return_value = MagicMock(
        choices=[MagicMock(message=MagicMock(content="{'invalid': 'json'}"))]
    )

    mocker.patch("backend.app.api.v1.workout_plans.get_current_user_placeholder", return_value=TEST_USER_ID)
    mocker.patch.object(AIPlanGenerationService, '_fetch_user_profile', return_value={})
    mocker.patch.object(AIPlanGenerationService, '_fetch_recent_workout_history', return_value=[])


    daily_context_data = {"mood": "tired", "energy": "low", "soreness": "legs", "notes": ""}
    response = await client.post(
        "/api/v1/workout_plans/generate",
        json={"daily_context_data": daily_context_data},
    )

    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    assert "OpenAI API returned invalid JSON" in response.json()["detail"]
    mock_supabase_client.from_.return_value.insert.assert_not_called()
    mock_redis_client.setex.assert_not_called()

@pytest.mark.asyncio
async def test_generate_workout_plan_openai_api_error(
    client: httpx.AsyncClient,
    mock_openai_client: MagicMock,
    mock_redis_client: MagicMock,
    mock_supabase_client: MagicMock,
    mocker
):
    # Mock OpenAI to raise an exception
    mock_openai_client.chat.completions.create.side_effect = Exception("OpenAI service unavailable")

    mocker.patch("backend.app.api.v1.workout_plans.get_current_user_placeholder", return_value=TEST_USER_ID)
    mocker.patch.object(AIPlanGenerationService, '_fetch_user_profile', return_value={})
    mocker.patch.object(AIPlanGenerationService, '_fetch_recent_workout_history', return_value=[])


    daily_context_data = {"mood": "tired", "energy": "low", "soreness": "legs", "notes": ""}
    response = await client.post(
        "/api/v1/workout_plans/generate",
        json={"daily_context_data": daily_context_data},
    )

    assert response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR
    assert "Failed to get response from OpenAI API" in response.json()["detail"]
    mock_supabase_client.from_.return_value.insert.assert_not_called()
    mock_redis_client.setex.assert_not_called()

@pytest.mark.asyncio
async def test_generate_workout_plan_redis_cache_hit_and_not_implemented_error(
    client: httpx.AsyncClient,
    mock_openai_client: MagicMock,
    mock_redis_client: MagicMock,
    mock_supabase_client: MagicMock,
    mocker
):
    # Mock Redis to return a cached plan
    mock_redis_client.get.return_value = json.dumps(mock_workout_plan_json_content.model_dump())

    # We expect NotImplementedError from AIPlanGenerationService when constructing WorkoutPlan from cache
    # as per the current implementation detail.
    # So, we expect the API endpoint to catch this and return 500
    mocker.patch("backend.app.api.v1.workout_plans.get_current_user_placeholder", return_value=TEST_USER_ID)
    mocker.patch.object(AIPlanGenerationService, '_fetch_user_profile', return_value={})
    mocker.patch.object(AIPlanGenerationService, '_fetch_recent_workout_history', return_value=[])

    daily_context_data = {"mood": "happy", "energy": "high", "soreness": "none", "notes": ""}
    response = await client.post(
        "/api/v1/workout_plans/generate",
        json={"daily_context_data": daily_context_data},
    )
    
    # Assert the service attempts to get from cache
    mock_redis_client.get.assert_called_once()
    assert response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR
    assert "Full WorkoutPlan object construction from cache not implemented" in response.json()["detail"]
    mock_openai_client.chat.completions.create.assert_not_called() # OpenAI should not be called
    mock_supabase_client.from_.return_value.insert.assert_not_called() # Supabase insert should not be called


@pytest.mark.asyncio
async def test_generate_workout_plan_force_regenerate(
    client: httpx.AsyncClient,
    mock_openai_client: MagicMock,
    mock_redis_client: MagicMock,
    mock_supabase_client: MagicMock,
    mocker
):
    # Mock Redis to return a cached plan, but force_regenerate should ignore it
    mock_redis_client.get.return_value = json.dumps(mock_workout_plan_json_content.model_dump())

    mock_openai_client.chat.completions.create.return_value = MagicMock(
        choices=[MagicMock(message=MagicMock(content=json.dumps(mock_workout_plan_json_content.model_dump())))]
    )

    mock_insert_response = MagicMock()
    mock_insert_response.data = [{"id": str(mock_workout_plan_object.id)}]
    mock_supabase_client.from_.return_value.insert.return_value.execute.return_value = mock_insert_response
    
    mocker.patch("backend.app.api.v1.workout_plans.get_current_user_placeholder", return_value=TEST_USER_ID)
    mocker.patch.object(AIPlanGenerationService, '_fetch_user_profile', return_value={})
    mocker.patch.object(AIPlanGenerationService, '_fetch_recent_workout_history', return_value=[])

    daily_context_data = {"mood": "happy", "energy": "high", "soreness": "none", "notes": ""}
    response = await client.post(
        "/api/v1/workout_plans/generate",
        json={"daily_context_data": daily_context_data, "force_regenerate": True},
    )

    assert response.status_code == status.HTTP_201_CREATED
    mock_redis_client.get.assert_called_once() # Should still try to get, but then regenerate
    mock_openai_client.chat.completions.create.assert_called_once() # OpenAI should be called
    mock_supabase_client.from_.return_value.insert.assert_called_once() # Supabase should be called


@pytest.mark.asyncio
async def test_generate_workout_plan_prompt_construction(
    client: httpx.AsyncClient,
    mock_openai_client: MagicMock,
    mock_redis_client: MagicMock,
    mock_supabase_client: MagicMock,
    mocker
):
    mock_openai_client.chat.completions.create.return_value = MagicMock(
        choices=[MagicMock(message=MagicMock(content=json.dumps(mock_workout_plan_json_content.model_dump())))]
    )

    mock_insert_response = MagicMock()
    mock_insert_response.data = [{"id": str(mock_workout_plan_object.id)}]
    mock_supabase_client.from_.return_value.insert.return_value.execute.return_value = mock_insert_response

    mock_user_profile = {
        "id": str(TEST_USER_ID),
        "goals": "Lose weight",
        "equipment": ["Treadmill"],
        "injuries": "Bad knee",
        "preferences": "Morning person",
    }
    mock_workout_history = [
        {"date": "2025-11-28", "exercise": "Running", "sets": 1, "reps": 30, "weight": 0},
    ]

    mocker.patch("backend.app.api.v1.workout_plans.get_current_user_placeholder", return_value=TEST_USER_ID)
    mocker.patch.object(AIPlanGenerationService, '_fetch_user_profile', return_value=mock_user_profile)
    mocker.patch.object(AIPlanGenerationService, '_fetch_recent_workout_history', return_value=mock_workout_history)


    daily_context_data = {
        "mood": "neutral",
        "energy": "medium",
        "soreness": "glutes",
        "notes": "Feeling good today.",
    }
    simulated_recovery_data = {"hrv": 45, "sleep": 6}

    response = await client.post(
        "/api/v1/workout_plans/generate",
        json={
            "daily_context_data": daily_context_data,
            "simulated_recovery_data": simulated_recovery_data,
        },
    )

    assert response.status_code == status.HTTP_201_CREATED

    # Assert OpenAI was called with correct prompts
    mock_openai_client.chat.completions.create.assert_called_once()
    call_args = mock_openai_client.chat.completions.create.call_args[1]["messages"]

    system_prompt = call_args[0]["content"]
    user_prompt = call_args[1]["content"]

    assert "You are an expert personal training AI." in system_prompt
    assert "Always respond with a single, valid JSON object." in system_prompt
    
    # Assert user prompt contains expected data
    assert f"Goals: {mock_user_profile['goals']}" in user_prompt
    assert f"Available Equipment: {', '.join(mock_user_profile['equipment'])}" in user_prompt
    assert f"Injuries/Limitations: {mock_user_profile['injuries']}" in user_prompt
    assert f"Mood: {daily_context_data['mood']}" in user_prompt
    assert f"Energy: {daily_context_data['energy']}" in user_prompt
    assert f"Soreness: {daily_context_data['soreness']}" in user_prompt
    assert f"Notes: {daily_context_data['notes']}" in user_prompt
    assert f"Recent Workout Summary (Last 7 Days):" in user_prompt
    assert "- 2025-11-28: Running 1x30 @ 0kg" in user_prompt
    assert f"Simulated Recovery Data:" in user_prompt
    assert f"- HRV: {simulated_recovery_data['hrv']}" in user_prompt
    assert f"- Sleep: {simulated_recovery_data['sleep']} hours" in user_prompt
    assert f"for today ({date.today().isoformat()})" in user_prompt
