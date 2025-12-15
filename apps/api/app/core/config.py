from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv
import os

# Determine the path to the .env file dynamically
# This assumes the .env file is in the 'apps/api/' directory
dotenv_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), '.env')
load_dotenv(dotenv_path)


class Settings(BaseSettings):
    PROJECT_NAME: str = "FastAPI AI Personal Trainer"
    API_V1_STR: str = "/api/v1"

    # Spotify API Credentials
    SPOTIPY_CLIENT_ID: str = os.getenv("SPOTIPY_CLIENT_ID", "dummy_spotify_client_id")
    SPOTIPY_CLIENT_SECRET: str = os.getenv("SPOTIPY_CLIENT_SECRET", "dummy_spotify_client_secret")
    SPOTIPY_REDIRECT_URI: str = os.getenv("SPOTIPY_REDIRECT_URI", "http://localhost:8000/api/v1/music/callback/spotify")
    SPOTIPY_SCOPE: str = os.getenv("SPOTIPY_SCOPE", "user-read-playback-state user-modify-playback-state")

    # Supabase / Database Settings
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "http://localhost:54321")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "dummy_supabase_key")

    # JWT Settings (for internal FastAPI usage, not directly Supabase JWT)
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super_secret_key_for_testing")
    ENCRYPTION_KEY: str = os.getenv("ENCRYPTION_KEY", "b'jWf2c_zV5_eS7vP_9dK1L_mN3oR6qX8yA0B4C5D6E7F='") # Replace with a strong, randomly generated key in production
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    model_config = SettingsConfigDict(extra="ignore")


settings = Settings()