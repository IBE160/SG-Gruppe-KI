from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from supabase import Client
from app.db.supabase import get_supabase_client, get_current_user_from_supabase
from app.schemas.user import CurrentUser # Import CurrentUser

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token") # This tokenUrl is a placeholder, actual Supabase auth is different

async def get_current_user(token: str = Depends(oauth2_scheme)) -> CurrentUser:
    user_data = get_current_user_from_supabase(token)
    if user_data is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return CurrentUser(**user_data)
