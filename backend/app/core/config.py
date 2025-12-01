from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    SUPABASE_URL: str
    SUPABASE_KEY: str
    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str
    SUPABASE_REDIRECT_URI: str # This should point to your backend /auth/google/callback
    BASE_URL: str = "http://localhost:3000" # Default frontend URL

    model_config = SettingsConfigDict(env_file="backend/.env", extra="ignore")


settings = Settings()
