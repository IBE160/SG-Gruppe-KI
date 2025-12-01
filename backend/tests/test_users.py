import pytest
from httpx import AsyncClient
from unittest.mock import patch, MagicMock
from app.main import app
from app.core.config import settings
from app.schemas.user import OnboardingData, UserProfile

@pytest.fixture(scope="module")
def anyio_backend():
    return "asyncio"

@pytest.fixture(scope="module")
async def client():
    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client

# Mock for get_current_user dependency
@pytest.fixture
def mock_current_user():
    with patch("app.dependencies.get_current_user", return_value={"id": "mock-user-uuid", "email": "test@example.com"}) as mock:
        yield mock

# Mock for get_supabase_client dependency
@pytest.fixture
def mock_supabase_client():
    with patch("app.db.supabase.get_supabase_client") as mock:
        mock_client = MagicMock()
        mock.return_value = mock_client
        yield mock_client

async def test_post_onboarding_success(
    client: AsyncClient,
    mock_current_user: MagicMock,
    mock_supabase_client: MagicMock
):
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
                "id": "mock-user-uuid",
                "email": "test@example.com",
                "goals": {"strength": True, "endurance": False},
                "preferences": {"preferred_time": "morning"},
                "equipment": ["Dumbbells", "Barbell"],
                "injuries": "none",
                "units": "metric",
                "name": None # Assuming name might be null initially
            }
        ]
    )

    response = await client.post(
        "/api/v1/users/onboarding",
        json=onboarding_data,
        headers={"Authorization": "Bearer fake-token"} # Token handled by mock_current_user
    )

    assert response.status_code == status.HTTP_200_OK
    assert response.json()["id"] == "mock-user-uuid"
    assert response.json()["goals"] == onboarding_data["goals"]
    mock_supabase_client.table.assert_called_with("users")
    mock_supabase_client.table.return_value.update.assert_called_once_with(onboarding_data)

async def test_post_onboarding_invalid_data(
    client: AsyncClient,
    mock_current_user: MagicMock,
):
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

async def test_post_onboarding_user_not_found(
    client: AsyncClient,
    mock_current_user: MagicMock,
    mock_supabase_client: MagicMock
):
    onboarding_data = {
        "goals": {"strength": True},
        "units": "metric"
    }

    # Mock Supabase to return no data
    mock_supabase_client.table.return_value.update.return_value.eq.return_value.execute.return_value = MagicMock(
        data=[]
    )

    response = await client.post(
        "/api/v1/users/onboarding",
        json=onboarding_data,
        headers={"Authorization": "Bearer fake-token"}
    )
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert "User not found or no data updated." in response.json()["detail"]

async def test_get_user_profile_success(
    client: AsyncClient,
    mock_current_user: MagicMock,
    mock_supabase_client: MagicMock
):
    mock_user_data = {
        "id": "mock-user-uuid",
        "email": "test@example.com",
        "name": "Test User",
        "goals": {"weight_loss": True},
        "preferences": {"duration": "60min"},
        "equipment": ["Yoga Mat"],
        "injuries": "knee pain",
        "units": "imperial"
    }
    mock_supabase_client.table.return_value.select.return_value.eq.return_value.single.return_value.execute.return_value = MagicMock(
        data=mock_user_data
    )

    response = await client.get(
        "/api/v1/users/me",
        headers={"Authorization": "Bearer fake-token"}
    )
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["email"] == "test@example.com"
    assert response.json()["goals"] == {"weight_loss": True}
    mock_supabase_client.table.assert_called_with("users")
    mock_supabase_client.table.return_value.select.assert_called_once_with("*")

async def test_update_user_profile_success(
    client: AsyncClient,
    mock_current_user: MagicMock,
    mock_supabase_client: MagicMock
):
    update_data = {
        "name": "Updated Name",
        "preferences": {"focus": "legs"}
    }
    mock_supabase_client.table.return_value.update.return_value.eq.return_value.execute.return_value = MagicMock(
        data=[
            {
                "id": "mock-user-uuid",
                "email": "test@example.com",
                "name": "Updated Name",
                "goals": {}, # Assuming existing goals are kept if not updated
                "preferences": {"focus": "legs"},
                "equipment": [],
                "injuries": None,
                "units": "metric"
            }
        ]
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