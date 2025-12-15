import pytest
from fastapi.testclient import TestClient
from dotenv import load_dotenv
import os

# Load environment variables from the .env file in the apps/api directory
dotenv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
load_dotenv(dotenv_path)

@pytest.fixture(scope="session")
def client():
    # Import create_app here to ensure environment variables are loaded first
    from app.main import create_app
    app = create_app()
    with TestClient(app) as client:
        yield client
