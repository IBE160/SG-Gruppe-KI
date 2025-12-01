pytest_plugins = ["anyio"] # ADD THIS LINE

import pytest
from unittest.mock import patch, MagicMock
from app.core import config # Import the config module, not just Settings
import httpx # Import httpx to patch it
from app.dependencies import get_current_user # Import get_current_user for patching

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
