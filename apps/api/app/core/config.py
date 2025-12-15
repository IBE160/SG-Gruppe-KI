# apps/api/app/core/config.py
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    SUPABASE_URL: str = "http://localhost:54321"
    SUPABASE_SERVICE_ROLE_KEY: str = "placeholder_service_role_key"
    SUPABASE_KEY: str = "placeholder_anon_key"

    model_config = SettingsConfigDict(env_file='.env', extra='ignore')

settings = Settings()
