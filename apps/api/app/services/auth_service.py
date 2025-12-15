# apps/api/app/services/auth_service.py
from typing import Optional
from uuid import UUID
from fastapi import HTTPException, status
from fastapi import Depends
from app.core.supabase import get_supabase_client
from app.models.user import UserProfileData

class AuthService:
    def __init__(self, supabase_client = Depends(get_supabase_client)):
        self.supabase = supabase_client

    async def register_user(self, email: str, password: str) -> Optional[UserProfileData]:
        """
        Registers a new user in Supabase Auth.
        """
        if not self.supabase:
            raise ValueError("Supabase client not initialized")
        try:
            response = self.supabase.auth.sign_up({"email": email, "password": password})

            if response.user:
                return UserProfileData(
                    id=response.user.id,
                    email=response.user.email
                )
            if response.error:
                raise ValueError(response.error.message)
        except Exception as e:
            raise ValueError(f"An unexpected error occurred during registration: {str(e)}")
        return None

    async def login_user(self, email: str, password: str) -> Optional[str]:
        """
        Logs in a user and returns an access token.
        """
        if not self.supabase:
            raise ValueError("Supabase client not initialized")
        try:
            response = self.supabase.auth.sign_in_with_password({"email": email, "password": password})
            if response.session:
                return response.session.access_token
            if response.error:
                 raise ValueError(response.error.message)
        except Exception as e:
            raise ValueError(f"An unexpected error occurred during login: {str(e)}")
        return None