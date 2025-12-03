# backend/tests/test_daily_context.py
import pytest
import httpx
from unittest.mock import patch, AsyncMock, MagicMock, ANY
from app.main import app
from app.schemas.user import CurrentUser
from app.schemas.daily_context import DailyContext, DailyContextCreate
import pytest_asyncio
from starlette import status
from app.dependencies import get_current_user
from app.db.supabase import get_supabase_client

from datetime import date
from uuid import uuid4, UUID


@pytest.fixture(scope="module")
def anyio_backend():
    return "asyncio"

@pytest_asyncio.fixture(scope="module")
async def client():
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as client:
        yield client

@pytest.fixture
def authenticated_user():
    return CurrentUser(id=str(uuid4()), email="test@example.com")

@pytest_asyncio.fixture
async def override_get_current_user(authenticated_user: CurrentUser):
    app.dependency_overrides[get_current_user] = lambda: authenticated_user
    app.dependency_overrides[get_supabase_client] = lambda: MagicMock() # Mock the supabase client
    yield
    app.dependency_overrides = {}

@pytest.mark.asyncio
async def test_create_daily_context_success(
    client: httpx.AsyncClient,
    override_get_current_user,
    authenticated_user: CurrentUser
):
    daily_context_data_in = {
        "mood": "happy",
        "energy": "80",
        "soreness": "none",
        "notes": "Feeling great today!"
    }
    
    mock_id = uuid4()
    today = date.today()

    expected_return_context = DailyContext(
        id=mock_id,
        user_id=UUID(authenticated_user.id),
        context_date=today,
        created_at=today,
        updated_at=today,
        **daily_context_data_in
    )

    with patch("app.crud.daily_context.create_daily_context", new_callable=AsyncMock) as mock_create_daily_context_func:
        mock_create_daily_context_func.return_value = expected_return_context.model_dump()

        response = await client.post(
            "/api/v1/daily_context",
            json=daily_context_data_in,
            headers={"Authorization": "Bearer fake-token"}
        )
        
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["mood"] == "happy"
        assert data["user_id"] == authenticated_user.id
        assert data["context_date"] == str(today)
        assert UUID(data["id"]) == mock_id
        
        mock_create_daily_context_func.assert_called_once()
        # The first argument is the 'db' client, which is mocked by FastAPI's Depends()
        assert isinstance(mock_create_daily_context_func.call_args[0][0], MagicMock)
        # More precise assertion using ANY for the db client argument
        mock_create_daily_context_func.assert_called_once_with(
            ANY,
            UUID(authenticated_user.id),
            DailyContextCreate(**daily_context_data_in)
        )


@pytest.mark.asyncio
async def test_create_daily_context_update_existing(
    client: httpx.AsyncClient,
    override_get_current_user,
    authenticated_user: CurrentUser
):
    existing_id = uuid4()
    today = date.today()
    
    # Define updated context data
    updated_context_input = { # This is what the API receives
        "mood": "neutral",
        "energy": "50",
        "soreness": "none",
        "notes": "Feeling better"
    }
    # Expected output after update
    expected_updated_context = DailyContext(
        id=existing_id,
        user_id=UUID(authenticated_user.id),
        context_date=today,
        created_at=today,
        updated_at=today,
        **updated_context_input
    )

    with patch("app.crud.daily_context.create_daily_context", new_callable=AsyncMock) as mock_create_daily_context_func:
        mock_create_daily_context_func.return_value = expected_updated_context.model_dump()

        response = await client.post(
            "/api/v1/daily_context",
            json=updated_context_input, # Use the input data
            headers={"Authorization": "Bearer fake-token"}
        )
        
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["mood"] == "neutral"
        assert data["notes"] == "Feeling better"
        assert data["id"] == str(existing_id)
        
        mock_create_daily_context_func.assert_called_once()
        # The first argument is the 'db' client, which is mocked by FastAPI's Depends()
        assert isinstance(mock_create_daily_context_func.call_args[0][0], MagicMock)
        # More precise assertion using ANY for the db client argument
        mock_create_daily_context_func.assert_called_once_with(
            ANY,
            UUID(authenticated_user.id),
            DailyContextCreate(**updated_context_input)
        )


@pytest.mark.asyncio
async def test_create_daily_context_invalid_data(
    client: httpx.AsyncClient,
    override_get_current_user
):
    invalid_data = {
        "mood": 123, # Should be string
        "energy": "high"
    }
    response = await client.post(
        "/api/v1/daily_context",
        json=invalid_data,
        headers={"Authorization": "Bearer fake-token"}
    )
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


@pytest.mark.asyncio
async def test_get_daily_context_success(
    client: httpx.AsyncClient,
    override_get_current_user,
    authenticated_user: CurrentUser
):
    mock_id = uuid4()
    today = date.today()
    
    expected_return_context = DailyContext(
        id=mock_id,
        user_id=UUID(authenticated_user.id),
        context_date=today,
        created_at=today,
        updated_at=today,
        mood="happy",
        energy="80",
        soreness="none",
        notes="Feeling great today!"
    )

    with patch("app.crud.daily_context.get_daily_context", new_callable=AsyncMock) as mock_get_daily_context_func:
        mock_get_daily_context_func.return_value = expected_return_context.model_dump()
        
        response = await client.get(
            f"/api/v1/daily_context/{today}",
            headers={"Authorization": "Bearer fake-token"}
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["mood"] == "happy"
        assert data["context_date"] == str(today)
        assert UUID(data["id"]) == mock_id

        # Verify crud function was called
        mock_get_daily_context_func.assert_called_once_with(
            ANY, # The db client instance
            UUID(authenticated_user.id),
            today
        )


@pytest.mark.asyncio
async def test_get_daily_context_not_found(
    client: httpx.AsyncClient,
    override_get_current_user,
    authenticated_user: CurrentUser
):
    today = date.today()
    
    with patch("app.crud.daily_context.get_daily_context", new_callable=AsyncMock) as mock_get_daily_context_func:
        # Mock the get_daily_context function in crud to return None
        mock_get_daily_context_func.return_value = None
        
        response = await client.get(
            f"/api/v1/daily_context/{today}",
            headers={"Authorization": "Bearer fake-token"}
        )
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert "Daily context not found" in response.json()["detail"]

        # Verify crud function was called
        mock_get_daily_context_func.assert_called_once_with(
            ANY, # The db client instance
            UUID(authenticated_user.id),
            today
        )


@pytest.mark.asyncio
async def test_daily_context_unauthorized(client: httpx.AsyncClient):
    daily_context_data = {
        "mood": "happy",
        "energy": "80",
        "soreness": "none",
        "notes": "Feeling great today!"
    }
    response = await client.post(
        "/api/v1/daily_context",
        json=daily_context_data
        # No Authorization header
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED