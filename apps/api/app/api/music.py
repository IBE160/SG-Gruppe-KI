from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.responses import RedirectResponse
from loguru import logger
from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime # Import datetime

from app.services.music_service import MusicService
from app.core.config import settings
from app.core.supabase import get_current_user_id # Import the dependency
from app.models.music import MusicFeedbackRequest # Import MusicFeedbackRequest

# Initialize MusicService
music_service = MusicService()

router = APIRouter()

# Pydantic model for session mix generation request
class GenerateSessionMixRequest(BaseModel):
    mix_type: str
    workout_plan_id: Optional[str] = None # Assuming a workout plan context

@router.post("/feedback", summary="Log user music interaction feedback")
async def log_music_feedback(
    feedback: MusicFeedbackRequest,
    user_id: str = Depends(get_current_user_id)
):
    """
    Receives and logs user music interaction feedback (e.g., skips, completions, likes)
    to refine future AI music scoring.
    """
    logger.info(f"Received music feedback from user {user_id}: {feedback.feedback_type} for track {feedback.track_id}")
    try:
        await music_service.log_music_feedback(user_id, feedback)
        return {"message": "Music feedback logged successfully"}
    except HTTPException as e:
        logger.error(f"Failed to log music feedback: {e.detail}")
        raise e
    except Exception as e:
        logger.error(f"Unexpected error logging music feedback: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error logging music feedback"
        )

@router.get("/connect/spotify", summary="Initiate Spotify OAuth process")
async def connect_spotify():
    """
    Redirects the user to the Spotify authorization page to grant permissions.
    """
    auth_data = music_service.get_auth_url()
    auth_url = auth_data["auth_url"]
    code_verifier = auth_data["code_verifier"]

    # WARNING: Storing code_verifier in a cookie or session is REQUIRED for production.
    # For testing and demonstration, we're returning it. DO NOT DO THIS IN PRODUCTION.
    logger.warning("INSECURE: Code Verifier being returned directly for testing purposes. MUST be stored securely in production.")
    return {"auth_url": f"{auth_url}&code_verifier={code_verifier}", "code_verifier": code_verifier}


@router.get("/callback/spotify", summary="Handle Spotify OAuth callback")
async def spotify_callback(
    code: str,
    state: Optional[str] = None,
    code_verifier: Optional[str] = Query(None, include_in_schema=False), # For testing only, insecure
    user_id: str = Depends(get_current_user_id) # Get user_id from dependency
):
    """
    Handles the redirect from Spotify after the user grants/denies permissions.
    Exchanges the authorization code for access and refresh tokens.
    """
    # WARNING: Retrieving code_verifier from query params is INSECURE for production.
    # It MUST be retrieved from a secure, server-side session/cookie storage
    # and associated with the user's session state.
    logger.warning("INSECURE: Code Verifier being retrieved from query params for testing purposes. MUST be retrieved securely in production.")

    if not code_verifier:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Code verifier missing. Cannot complete PKCE flow.",
        )

    try:
        token_info = await music_service.exchange_code_for_tokens(user_id, code, code_verifier) # Pass user_id
        access_token = token_info.get("access_token")
        refresh_token = token_info.get("refresh_token")
        expires_in = token_info.get("expires_in")
        scope = token_info.get("scope")

        # *** TODO: Securely store token_info (access_token, refresh_token, expires_in, scope)
        #           in the Integrations table, associated with the current user_id.
        #           Ensure tokens are encrypted at rest.
        logger.info(f"Successfully exchanged code for tokens. Access Token (first 5 chars): {access_token[:5]}...")
        # Redirect to a frontend page indicating success or failure
        # In a real app, this would redirect to your frontend with a success/error indicator
        # For now, we'll return a simple message.
        return {"message": "Spotify connection successful", "access_token": access_token}

    except HTTPException as e:
        logger.error(f"Spotify callback error: {e.detail}")
        raise e
    except Exception as e:
        logger.error(f"Unexpected error during Spotify callback: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error during Spotify callback"
        )

@router.post("/generate-session-mix", summary="Generate an AI-driven session mix")
async def generate_session_mix(
    request: GenerateSessionMixRequest,
    user_id: str = Depends(get_current_user_id)
):
    """
    Generates a personalized, phase-aligned workout playlist based on user preferences
    and selected mix type.
    """
    # Placeholder for AI Music Scorer logic
    # In a real implementation, this would involve:
    # 1. Fetching user's music preferences and listening history
    # 2. Analyzing the workout plan (if provided) for phases and intensity
    # 3. Using AI (e.g., calling an external LLM or a custom recommendation engine)
    #    to select tracks based on mix_type, BPM, audio features, etc.
    # 4. Creating a playlist on Spotify via the Spotify API.

    logger.info(f"Generating session mix for user {user_id} with type: {request.mix_type}")

    # Simulate mix generation and return dummy data
    dummy_playlist_id = "mock_playlist_id_123"
    dummy_tracks = [
        {
            "id": "track1", "title": "Mock Track 1", "artist": "Mock Artist A",
            "albumArt": "https://via.placeholder.com/56", "phase": "Warm-up", "phaseIcon": "local_fire_department", "phaseColor": "text-yellow-400"
        },
        {
            "id": "track2", "title": "Mock Track 2", "artist": "Mock Artist B",
            "albumArt": "https://via.placeholder.com/56", "phase": "Peak", "phaseIcon": "trending_up", "phaseColor": "text-red-500"
        }
    ]

    return {
        "message": "Session mix generated successfully",
        "playlist_id": dummy_playlist_id,
        "mix_type": request.mix_type,
        "tracks": dummy_tracks,
        "seedTags": ["mock_tag1", "mock_tag2"],
        "playlistMode": "AI Smart Mix",
        "totalDuration": "10:00",
        "trackCount": len(dummy_tracks)
    }

@router.get("/recently-played", summary="Get user's recently played tracks")
async def get_recently_played_tracks(user_id: str = Depends(get_current_user_id)):
    """
    Retrieves the user's recently played tracks from Spotify.
    """
    recently_played = await music_service.get_recently_played(user_id)
    return {"recently_played": recently_played}

@router.post("/audio-features", summary="Get audio features for tracks")
async def get_tracks_audio_features(track_ids: list[str], user_id: str = Depends(get_current_user_id)):
    """
    Retrieves audio features for a list of track IDs from Spotify.
    """
    audio_features = await music_service.get_audio_features(user_id, track_ids)
    return {"audio_features": audio_features}

@router.post("/create-playlist", summary="Create a new Spotify playlist")
async def create_new_playlist(
    name: str,
    description: Optional[str] = None,
    public: bool = False,
    tracks_uris: Optional[list[str]] = None,
    user_id: str = Depends(get_current_user_id)
):
    """
    Creates a new Spotify playlist for the user and optionally adds tracks to it.
    """
    playlist_info = await music_service.create_playlist(user_id, name, description, public, tracks_uris)
    return {"message": "Playlist created successfully", "playlist_info": playlist_info}


