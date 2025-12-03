from openai import OpenAI
import redis

from backend.app.core.config import settings

def get_openai_client() -> OpenAI:
    """Returns an initialized OpenAI client."""
    return OpenAI(api_key=settings.OPENAI_API_KEY)

def get_redis_client() -> redis.Redis:
    """Returns an initialized Redis client."""
    return redis.Redis(
        host=settings.REDIS_HOST,
        port=settings.REDIS_PORT,
        db=settings.REDIS_DB,
        password=settings.REDIS_PASSWORD,
        decode_responses=True # Decode responses to Python strings
    )

def get_supabase_client(): # Type hint Client added inside function
    """Returns an initialized Supabase client."""
    from supabase import create_client, Client # Local import
    return create_client(
        supabase_url=settings.SUPABASE_URL,
        supabase_key=settings.SUPABASE_KEY
    )