from supabase import create_client, Client
from app.core.config import settings

def get_supabase_client() -> Client:
    supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
    return supabase

def get_current_user_from_supabase(token: str) -> dict:
    """Fetches user information from Supabase using the provided JWT."""
    supabase: Client = get_supabase_client()
    try:
        user_response = supabase.auth.get_user(token)
        if user_response.user:
            return user_response.user.model_dump()
        else:
            return None
    except Exception as e:
        # Log the exception for debugging
        print(f"Error fetching user from Supabase: {e}")
        return None
