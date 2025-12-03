from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    SUPABASE_URL: str
    SUPABASE_KEY: str
    SUPABASE_SERVICE_ROLE_KEY: str
    GOOGLE_CLIENT_ID: str | None = None
    GOOGLE_CLIENT_SECRET: str | None = None
    SUPABASE_REDIRECT_URI: str | None = None # This should point to your backend /auth/google/callback
    BASE_URL: str = "http://localhost:3000" # Default frontend URL

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
