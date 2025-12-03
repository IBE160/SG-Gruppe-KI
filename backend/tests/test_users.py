import pytest
import httpx
from unittest.mock import patch, MagicMock
from backend.app.main import app
from app.core.config import settings
from backend.app.schemas.user import OnboardingData, UserProfile, CurrentUser
import pytest_asyncio
from starlette import status
from backend.app.dependencies import get_current_user # Import get_current_user

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
    with patch("app.db.supabase.get_supabase_client") as mock:
        mock_client = MagicMock()
        mock.return_value = mock_client
        yield mock_client

@pytest.mark.asyncio
async def test_post_onboarding_success(
    client: httpx.AsyncClient,
    mock_supabase_client: MagicMock
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

        # Mock the Supabase table update method
        mock_supabase_client.table.return_value.update.return_value.eq.return_value.execute.return_value = MagicMock(
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
            count=1
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

        # Mock Supabase to return no data
        mock_supabase_client.table.return_value.update.return_value.eq.return_value.execute.return_value = MagicMock(
            data=[],
            count=0
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
        # Configure the mock for supabase.table("users")
        mock_table_chain = MagicMock()
        mock_supabase_client.table.return_value = mock_table_chain

        # Configure the select chain
        mock_select_chain = MagicMock()
        mock_table_chain.select.return_value = mock_select_chain
        mock_select_chain.eq.return_value = mock_select_chain # eq returns self
        mock_select_chain.single.return_value = mock_select_chain # single returns self
        mock_select_chain.execute.return_value = MagicMock(data=[mock_user_data], count=1)

        # Configure the insert chain (in case select doesn't find it)
        mock_insert_chain = MagicMock()
        mock_table_chain.insert.return_value = mock_insert_chain
        mock_insert_chain.execute.return_value = MagicMock(data=[mock_user_data], count=1)

        response = await client.get(
            "/api/v1/users/me",
            headers={"Authorization": "Bearer fake-token"}
        )
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["email"] == "test@example.com"
        assert response.json()["goals"] == {"weight_loss": True}
        mock_supabase_client.table.assert_called_with("users")
        mock_supabase_client.table.return_value.select.assert_called_once_with("*")
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
        mock_supabase_client.table.return_value.update.return_value.eq.return_value.execute.return_value = MagicMock(
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
            count=1
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
        mock_supabase_client.table.return_value.update.assert_called_once()
    finally:
        app.dependency_overrides = {}