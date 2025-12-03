

import sys
import os

# Add the project root to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

pytest_plugins = ["pytest_asyncio"] 

import pytest
from unittest.mock import patch, MagicMock
from app.core import config # Import the config module, not just Settings
import httpx # Import httpx to patch it
# from app.dependencies import get_current_user # Import get_current_user for patching

# Mock for supabase client creation
@pytest.fixture
def mock_supabase_client():
    with patch("supabase.create_client") as mock_create_client:
        mock_client = MagicMock()
        mock_create_client.return_value = mock_client
        
        # Mock for supabase.auth
        mock_client.auth = MagicMock()
        mock_client.auth.get_user.return_value = MagicMock(
            user=MagicMock(
                id="00000000-0000-4000-8000-000000000001",
                email="test@example.com",
                model_dump=lambda: {"id": "00000000-0000-4000-8000-000000000001", "email": "test@example.com"}
            )
        )
        mock_client.auth.get_user.return_value.user.id = "00000000-0000-4000-8000-000000000001"
        mock_client.auth.get_user.return_value.user.email = "test@example.com"
        
        # Create a single mock object for the return value of supabase.table()
        # This will be used by all tests for any table operation
        mock_table_builder = MagicMock()
        mock_client.table.return_value = mock_table_builder
        
        yield mock_client

@pytest.fixture
def mock_openai_client():
    with patch("openai.OpenAI") as mock_openai_class:
        mock_client = MagicMock()
        mock_openai_class.return_value = mock_client
        yield mock_client

@pytest.fixture
def mock_redis_client():
    with patch("redis.Redis") as mock_redis_class:
        mock_client = MagicMock()
        mock_redis_class.return_value = mock_client
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
