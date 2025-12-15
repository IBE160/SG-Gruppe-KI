# apps/api/conftest.py
import pytest
import os
import sys
from unittest.mock import patch

# This ensures that the 'app' module can be found by pytest
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '.')))


@pytest.fixture(autouse=True)
def mock_env_vars_for_all_tests(monkeypatch):
    """
    Fixture to mock Supabase environment variables for all tests.
    Ensures that settings are always available and valid during test runs.
    """
    monkeypatch.setenv("SUPABASE_URL", "http://mock-supabase.com")
    monkeypatch.setenv("SUPABASE_SERVICE_ROLE_KEY", "mock-service-role-key")
    # Add any other Supabase related env vars if necessary
