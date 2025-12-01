from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import RedirectResponse
from urllib.parse import quote_plus
import httpx

from ...core.config import settings  # ← RELATIVE IMPORT
from ...db.supabase import get_supabase_client  # ← RELATIVE IMPORT
from supabase import Client

router = APIRouter()


@router.get("/google")
async def google_oauth_initiate():
    """
    Initiates the Google OAuth flow by redirecting the user to Google's consent screen.
    """
    if not settings.GOOGLE_CLIENT_ID or not settings.SUPABASE_REDIRECT_URI:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Google OAuth client ID or redirect URI not configured.",
        )

    # TODO: generer ekte random state og lagre i session
    state = "some_random_secure_string"

    scope = "openid email profile"
    google_auth_url = (
        "https://accounts.google.com/o/oauth2/v2/auth?"
        f"client_id={settings.GOOGLE_CLIENT_ID}&"
        f"redirect_uri={quote_plus(settings.SUPABASE_REDIRECT_URI)}&"
        f"response_type=code&"
        f"scope={quote_plus(scope)}&"
        "access_type=offline&"
        f"state={state}"
    )

    return RedirectResponse(url=google_auth_url)


@router.get("/google/callback")
async def google_oauth_callback(
    request: Request,
    code: str | None = None,                 # ← GJORT OPTIONAL FOR Å SLIPPE 422
    state: str | None = None,
    error: str | None = None,
    error_description: str | None = None,
    supabase: Client = Depends(get_supabase_client),
):
    """
    Handles the Google OAuth callback, exchanges the authorization code for tokens,
    and (på sikt) kobler det mot Supabase-auth.
    """
    if error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Google OAuth error: {error_description or error}",
        )

    if code is None:
        # Hvis noen treffer callback uten ?code=... (f.eks. via frontend),
        # får de en kontrollert 400 i stedet for 422.
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing authorization code from Google.",
        )

    try:
        # 1) Bytt code -> tokens hos Google
        token_url = "https://oauth2.googleapis.com/token"
        async with httpx.AsyncClient() as client:
            google_token_response = await client.post(
                token_url,
                data={
                    "client_id": settings.GOOGLE_CLIENT_ID,
                    "client_secret": settings.GOOGLE_CLIENT_SECRET,
                    "code": code,
                    "redirect_uri": settings.SUPABASE_REDIRECT_URI,
                    "grant_type": "authorization_code",
                },
                headers={"Content-Type": "application/x-www-form-urlencoded"},
            )
            google_token_response.raise_for_status()
            google_tokens = google_token_response.json()

        google_access_token = google_tokens["access_token"]

        # 2) TODO: Her bør du egentlig bruke Supabase sin server-side flow.
        # sign_in_with_oauth i supabase-py er primært for å lage en redirect-URL,
        # ikke for å bruke et ferdig Google-access-token.
        # For nå kan vi bare logge eller returnere noe enkelt.
        #
        # auth_response = supabase.auth.sign_in_with_oauth(
        #     {"provider": "google", "access_token": google_access_token}
        # )

        # 3) Redirect tilbake til frontend
        return RedirectResponse(url=settings.BASE_URL)

    except httpx.HTTPStatusError as e:
        raise HTTPException(
            status_code=e.response.status_code,
            detail=f"Failed to exchange Google code for tokens: {e.response.text}",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error during Google OAuth callback: {e}",
        )


@router.get("/test")
async def test_auth_router():
    return {"message": "Auth router is working!"}
