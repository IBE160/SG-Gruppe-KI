from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    SUPABASE_URL: str
    SUPABASE_KEY: str
    SUPABASE_SERVICE_ROLE_KEY: str
    OPENAI_API_KEY: str
    OPENAI_MODEL: str = "gpt-4-turbo-preview"
    OPENAI_TEMPERATURE: float = 0.7
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0
    REDIS_PASSWORD: str | None = None
    REDIS_CACHE_EXPIRATION: int = 3600 # Cache for 1 hour
    GOOGLE_CLIENT_ID: str | None = None
    GOOGLE_CLIENT_SECRET: str | None = None
    SUPABASE_REDIRECT_URI: str | None = None # This should point to your backend /auth/google/callback
    BASE_URL: str = "http://localhost:3000" # Default frontend URL

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
