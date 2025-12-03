from fastapi import APIRouter, HTTPException, status
from fastapi.responses import RedirectResponse

from ...core.config import settings

router = APIRouter()

@router.get("/google")
async def google_oauth_initiate():
    """
    Initiates the Google OAuth flow by redirecting the user to Supabase's authorize endpoint.
    """
    if not settings.SUPABASE_URL or not settings.BASE_URL:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="SUPABASE_URL or BASE_URL not configured.",
        )

    # The redirect_to URL must be the frontend callback page
    redirect_to = f"{settings.BASE_URL}/auth/callback"
    
    supabase_auth_url = (
        f"{settings.SUPABASE_URL}/auth/v1/authorize?"
        f"provider=google&"
        f"redirect_to={redirect_to}"
    )

    return RedirectResponse(url=supabase_auth_url)