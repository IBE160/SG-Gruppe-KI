# apps/api/conftest.py
import pytest
import os
from unittest.mock import patch

@pytest.fixture(autouse=True)
def mock_env_vars_for_all_tests(monkeypatch):
    """
    Fixture to mock Supabase environment variables for all tests.
    Ensures that settings are always available and valid during test runs.
    """
    monkeypatch.setenv("SUPABASE_URL", "http://mock-supabase.com")
    monkeypatch.setenv("SUPABASE_SERVICE_ROLE_KEY", "mock-service-role-key")
    # Add any other Supabase related env vars if necessary
