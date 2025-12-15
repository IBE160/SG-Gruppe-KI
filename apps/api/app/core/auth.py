# apps/api/app/core/auth.py

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt
from app.core.config import settings

# This is a placeholder. In a real application, you'd have a more robust user model.
class User:
    def __init__(self, id: str, email: str):
        self.id = id
        self.email = email

def get_current_user_id(token: str = Depends(OAuth2PasswordBearer(tokenUrl="token"))):
    """
    Placeholder function to decode JWT and get user ID.
    This will be properly implemented later.
    """
    try:
        # In a real scenario, you'd verify the token against your auth provider (e.g., Supabase)
        # For now, we'll just simulate a decode if it's a mock token.
        if token == "mock_token":
            return "mock_user_id"

        # A real implementation would look something like this:
        # payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        # user_id: str = payload.get("sub")
        # if user_id is None:
        #     raise HTTPException(status_code=401, detail="Invalid token")
        # return user_id
        
        # For now, if it's not the mock token, raise an exception
        # This prevents untested code paths from being executed.
        raise HTTPException(status_code=401, detail="Authentication not fully implemented")

    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

def get_current_user(user_id: str = Depends(get_current_user_id)):
    """
    Placeholder to fetch user details from DB based on user_id from token.
    """
    # In a real app, you would fetch the user from the database.
    # user = db.query(User).filter(User.id == user_id).first()
    # For now, return a mock user.
    if user_id == "mock_user_id":
        return User(id=user_id, email="mock@example.com")
    
    raise HTTPException(status_code=404, detail="User not found")
