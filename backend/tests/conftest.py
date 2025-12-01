pytest_plugins = ["anyio"] # ADD THIS LINE

import pytest
from unittest.mock import patch, MagicMock
from app.core import config # Import the config module, not just Settings
import httpx # Import httpx to patch it
from app.dependencies import get_current_user # Import get_current_user for patching

@pytest.fixture(autouse=True)
def mock_settings():
    # Store original settings
    original_settings = config.settings

    # Create a mock settings instance
    mock_instance = MagicMock()
    mock_instance.SUPABASE_URL = "http://mock-supabase-url"
    mock_instance.SUPABASE_KEY = "mock-supabase-key"
    mock_instance.SUPABASE_REDIRECT_URI = "http://mock-redirect-uri"
    mock_instance.GOOGLE_CLIENT_ID = "mock-google-client-id"
    mock_instance.GOOGLE_CLIENT_SECRET = "mock-google-client-secret"
    mock_instance.BASE_URL = "http://mock-base-url"

    # Patch the global settings instance
    with patch("app.core.config.settings", new=mock_instance):
        yield mock_instance
    
    # Restore original settings after test (important for other tests that might rely on real settings)
    with patch("app.core.config.settings", new=original_settings):
        pass # This pass is just to make the context manager happy, actual restoration happens on exit

# Mock for supabase client creation
@pytest.fixture
def mock_supabase_client():
    with patch("supabase.create_client") as mock_create_client:
        mock_client = MagicMock()
        
        # Add a mock 'auth' attribute to the client
        mock_client.auth = MagicMock()
        
        # Mock get_user method within auth
        mock_client.auth.get_user.return_value = MagicMock(
            user=MagicMock(
                id="mock-user-uuid",
                email="test@example.com",
                model_dump=lambda: {"id": "mock-user-uuid", "email": "test@example.com"} # Mimic pydantic model_dump
            )
        )
        
        # --- Add robust mocking for table operations ---
        mock_client.table.return_value.update.return_value.eq.return_value.execute.return_value = MagicMock(
            data=[{"id": "mock-user-uuid", "email": "test@example.com"}] # Default success for update
        )
        mock_client.table.return_value.select.return_value.eq.return_value.single.return_value.execute.return_value = MagicMock(
            data={"id": "mock-user-uuid", "email": "test@example.example.com"} # Default success for select single
        )
        # --- End robust mocking for table operations ---

        mock_create_client.return_value = mock_client
        yield mock_client

@pytest.fixture
def mock_httpx_async_client():
    with patch("httpx.AsyncClient") as mock_async_client_class:
        mock_instance = MagicMock()
        mock_instance.__aenter__.return_value = mock_instance # Mock async with
        mock_instance.__aexit__.return_value = None
        
        # Configure mock_instance for specific calls if needed by tests
        # e.g., mock_instance.post.return_value = MagicMock(...)

        mock_async_client_class.return_value = mock_instance
        yield mock_instance

@pytest.fixture(autouse=True, scope="module")
def setup_auth_mocks():
    with patch("app.db.supabase.get_current_user_from_supabase",
               return_value={"id": "mock-user-uuid", "email": "test@example.com"}) as mock_get_current_user_from_supabase:
        with patch("app.dependencies.oauth2_scheme", return_value="fake-token") as mock_oauth2_scheme:
            yield mock_get_current_user_from_supabase, mock_oauth2_scheme