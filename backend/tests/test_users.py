import pytest
import httpx
from unittest.mock import patch, MagicMock
from app.main import app
from app.schemas.user import OnboardingData, UserProfile, CurrentUser
import pytest_asyncio
from starlette import status
from app.dependencies import get_current_user
from app.db.supabase import get_supabase_service_client

@pytest.fixture(scope="module")
def anyio_backend():
    return "asyncio"

@pytest_asyncio.fixture(scope="module")
async def client():
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as client:
        yield client

# Mock for get_supabase_client dependency
@pytest.fixture
def mock_supabase_client():
    with patch("app.db.supabase.get_supabase_service_client") as mock_get_client:
        mock_client = MagicMock()
        mock_get_client.return_value = mock_client
        
        # Mock for supabase.auth (used by get_current_user_from_supabase indirectly)
        mock_client.auth = MagicMock()
        mock_client.auth.get_user.return_value = MagicMock(
            user=MagicMock(
                id="00000000-0000-4000-8000-000000000001",
                email="test@example.com",
                model_dump=lambda: {"id": "00000000-0000-4000-8000-000000000001", "email": "test@example.com"}
            )
        )

        # Create a mock for the PostgrestAPI object returned by supabase.table("users")
        mock_postgrest_api = MagicMock()
        mock_client.table.return_value = mock_postgrest_api

        # Configure common chainable methods to return themselves for further chaining
        mock_postgrest_api.select.return_value = mock_postgrest_api
        mock_postgrest_api.insert.return_value = mock_postgrest_api
        mock_postgrest_api.update.return_value = mock_postgrest_api
        mock_postgrest_api.eq.return_value = mock_postgrest_api
        mock_postgrest_api.execute.return_value = MagicMock(data=[], count=0) # Default for execute

        yield mock_client # Yield the mock_client so tests can call mock_client.table(...)

@pytest.mark.asyncio
async def test_post_onboarding_success(
    client: httpx.AsyncClient,
    mock_supabase_client: MagicMock # This is the mock_client, not the postgrest_api
):
    # Define a local override for get_current_user
    async def override_get_current_user():
        return CurrentUser(id="00000000-0000-4000-8000-000000000001", email="test@example.com")

    app.dependency_overrides[get_current_user] = override_get_current_user

    try:
        onboarding_data = {
            "goals": {"strength": True, "endurance": False},
            "preferences": {"preferred_time": "morning"},
            "equipment": ["Dumbbells", "Barbell"],
            "injuries": "none",
            "units": "metric"
        }

        # Configure the mock for supabase.table("users").update().eq().execute()
        mock_postgrest_api = mock_supabase_client.table.return_value
        mock_postgrest_api.update.return_value.eq.return_value.execute.return_value = MagicMock(
            data=[
                {
                    "id": "00000000-0000-4000-8000-000000000001",
                    "email": "test@example.com",
                    "goals": {"strength": True, "endurance": False},
                    "preferences": {"preferred_time": "morning"},
                    "equipment": ["Dumbbells", "Barbell"],
                    "injuries": "none",
                    "units": "metric",
                    "name": None # Assuming name might be null initially
                }
            ],
            count=1,
            error=None # Explicitly set error to None for success case
        )
        response = await client.post(
            "/api/v1/users/onboarding",
            json=onboarding_data,
            headers={"Authorization": "Bearer fake-token"} # Token handled by mock_current_user
        )

        assert response.status_code == status.HTTP_200_OK
        assert response.json()["id"] == "00000000-0000-4000-8000-000000000001"
        assert response.json()["goals"] == onboarding_data["goals"]
        mock_supabase_client.table.assert_called_with("users")
        mock_supabase_client.table.return_value.update.assert_called_once_with(onboarding_data)
    finally:
        app.dependency_overrides = {} # Clean up overrides

@pytest.mark.asyncio
async def test_post_onboarding_invalid_data(
    client: httpx.AsyncClient,
):
    async def override_get_current_user():
        return CurrentUser(id="00000000-0000-4000-8000-000000000001", email="test@example.com")

    app.dependency_overrides[get_current_user] = override_get_current_user
    try:
        invalid_onboarding_data = {
            "goals": "not a json", # Invalid type
            "equipment": "not a list"
        }
        response = await client.post(
            "/api/v1/users/onboarding",
            json=invalid_onboarding_data,
            headers={"Authorization": "Bearer fake-token"}
        )
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY # Pydantic validation error
    finally:
        app.dependency_overrides = {}

@pytest.mark.asyncio
async def test_post_onboarding_user_not_found(
    client: httpx.AsyncClient,
    mock_supabase_client: MagicMock
):
    async def override_get_current_user():
        return CurrentUser(id="00000000-0000-4000-8000-000000000001", email="test@example.com")

    app.dependency_overrides[get_current_user] = override_get_current_user
    try:
        onboarding_data = {
            "goals": {"strength": True},
            "units": "metric"
        }

        # Configure the mock for supabase.table("users").update().eq().execute()
        mock_postgrest_api = mock_supabase_client.table.return_value
        mock_postgrest_api.update.return_value.eq.return_value.execute.return_value = MagicMock(
            data=[], # Mock Supabase to return no data
            count=0,
            error=None # Explicitly set error to None for this case
        )
        response = await client.post(
            "/api/v1/users/onboarding",
            json=onboarding_data,
            headers={"Authorization": "Bearer fake-token"}
        )
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert "User not found or no data updated." in response.json()["detail"]
    finally:
        app.dependency_overrides = {}

@pytest.mark.asyncio
async def test_get_user_profile_success(
    client: httpx.AsyncClient,
    mock_supabase_client: MagicMock
):
    async def override_get_current_user():
        return CurrentUser(id="00000000-0000-4000-8000-000000000001", email="test@example.com")

    app.dependency_overrides[get_current_user] = override_get_current_user
    try:
        mock_user_data = {
            "id": "00000000-0000-4000-8000-000000000001",
            "email": "test@example.com",
            "name": "Test User",
            "goals": {"weight_loss": True},
            "preferences": {"duration": "60min"},
            "equipment": ["Yoga Mat"],
            "injuries": "knee pain",
            "units": "imperial"
        }
        
        # Configure the mock for supabase.table("users").select().eq().execute()
        # This should return no data initially to trigger the insert path in the API
        mock_postgrest_api = mock_supabase_client.table.return_value
        mock_postgrest_api.select.return_value.eq.return_value.execute.return_value = MagicMock(
            data=[], # User not found
            count=0
        )

        # Configure the mock for supabase.table("users").insert().execute()
        # This should return the created user data
        mock_postgrest_api.insert.return_value.execute.return_value = MagicMock(
            data=[mock_user_data],
            count=1,
            error=None # Explicitly set error to None for success case
        )
        response = await client.get(
            "/api/v1/users/me",
            headers={"Authorization": "Bearer fake-token"}
        )
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["email"] == "test@example.com"
        assert response.json()["goals"] == {"weight_loss": True}
        mock_supabase_client.table.assert_called_with("users")
        mock_postgrest_api.select.assert_called_once_with("*")
        mock_postgrest_api.insert.assert_called_once()
    finally:
        app.dependency_overrides = {}

@pytest.mark.asyncio
async def test_update_user_profile_success(
    client: httpx.AsyncClient,
    mock_supabase_client: MagicMock
):
    async def override_get_current_user():
        return CurrentUser(id="00000000-0000-4000-8000-000000000001", email="test@example.com")

    app.dependency_overrides[get_current_user] = override_get_current_user
    try:
        update_data = {
            "name": "Updated Name",
            "preferences": {"focus": "legs"}
        }

        # Configure the mock for supabase.table("users").update().eq().execute()
        mock_postgrest_api = mock_supabase_client.table.return_value
        mock_postgrest_api.update.return_value.eq.return_value.execute.return_value = MagicMock(
            data=[
                {
                    "id": "00000000-0000-4000-8000-000000000001",
                    "email": "test@example.com",
                    "name": "Updated Name",
                    "goals": {}, # Assuming existing goals are kept if not updated
                    "preferences": {"focus": "legs"},
                    "equipment": [],
                    "injuries": None,
                    "units": "metric"
                }
            ],
            count=1,
            error=None # Explicitly set error to None for success case
        )
        response = await client.put(
            "/api/v1/users/me",
            json=update_data,
            headers={"Authorization": "Bearer fake-token"}
        )
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["name"] == "Updated Name"
        assert response.json()["preferences"] == {"focus": "legs"}
        mock_supabase_client.table.assert_called_with("users")
        mock_postgrest_api.update.assert_called_once()
    finally:
        app.dependency_overrides = {}
