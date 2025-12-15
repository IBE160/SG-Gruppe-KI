import os
import secrets
from typing import Optional
from datetime import datetime, timedelta

import httpx
from fastapi import HTTPException, status
from loguru import logger
from urllib.parse import urlencode

from app.core.config import settings
from app.utils.encryption import encryption_util
from app.core.supabase import get_supabase_client # Assuming Supabase client is used for DB interaction
from supabase import Client, create_client
from app.models.music import MusicFeedbackRequest # Import MusicFeedbackRequest

class MusicService:
    def __init__(self):
        self.client_id: str = settings.SPOTIPY_CLIENT_ID
        self.client_secret: str = settings.SPOTIPY_CLIENT_SECRET
        self.redirect_uri: str = settings.SPOTIPY_REDIRECT_URI
        self.scope: str = settings.SPOTIPY_SCOPE
        self.spotify_auth_url = "https://accounts.spotify.com/authorize"
        self.spotify_token_url = "https://accounts.spotify.com/api/token"
        self.spotify_api_base_url = "https://api.spotify.com/v1"
        self.supabase: Client = get_supabase_client()

    async def log_music_feedback(self, user_id: str, feedback: MusicFeedbackRequest):
        """
        Logs user music interaction feedback to the database.
        """
        try:
            feedback_data = {
                "user_id": user_id,
                "session_id": feedback.session_id,
                "track_id": feedback.track_id,
                "feedback_type": feedback.feedback_type,
                "timestamp": feedback.timestamp.isoformat(),
                "context": feedback.context,
            }
            # TODO: Re-enable actual Supabase insertion and ensure MusicInteractions table exists and schema is defined.
            # response_db = self.supabase.table("MusicInteractions").insert(feedback_data).execute()
            # if response_db.data:
            #     logger.info(f"Music feedback logged for user {user_id}: {feedback.feedback_type} for track {feedback.track_id}")
            # else:
            #     logger.error(f"Failed to log music feedback for user {user_id}: {response_db.error}")
            #     raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to log music feedback")
            logger.debug(f"Simulating music feedback logging for user {user_id}: {feedback.feedback_type} for track {feedback.track_id}")
        except Exception as e:
            logger.error(f"Error logging music feedback: {e}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error logging music feedback")


    def _generate_code_verifier(self) -> str:
        """Generates a random string for the code verifier."""
        return secrets.token_urlsafe(64)

    def _generate_code_challenge(self, code_verifier: str) -> str:
        """Generates the code challenge from the code verifier."""
        import base64
        import hashlib

        hashed = hashlib.sha256(code_verifier.encode("utf-8")).digest()
        encoded = base64.urlsafe_b64encode(hashed).decode("utf-8")
        return encoded.replace("=", "")

    def get_auth_url(self) -> dict:
        """Generates the Spotify authorization URL with PKCE."""
        code_verifier = self._generate_code_verifier()
        code_challenge = self._generate_code_challenge(code_verifier)

        params = {
            "client_id": self.client_id,
            "response_type": "code",
            "redirect_uri": self.redirect_uri,
            "scope": self.scope,
            "show_dialog": "true",
            "code_challenge_method": "S256",
            "code_challenge": code_challenge,
        }
        auth_url = f"{self.spotify_auth_url}?{urlencode(params)}"
        return {"auth_url": auth_url, "code_verifier": code_verifier}

    async def exchange_code_for_tokens(
        self, user_id: str, code: str, code_verifier: str
    ) -> dict:
        """
        Exchanges authorization code for access and refresh tokens using PKCE.
        Encrypts and stores them in the Integrations table.
        """
        data = {
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": self.redirect_uri,
            "client_id": self.client_id,
            "code_verifier": code_verifier,
        }
        headers = {"Content-Type": "application/x-www-form-urlencoded"}

        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    self.spotify_token_url, data=data, headers=headers
                )
                response.raise_for_status()  # Raise an exception for HTTP errors
                token_info = response.json()

                access_token = token_info.get("access_token")
                refresh_token = token_info.get("refresh_token")
                expires_in = token_info.get("expires_in", 3600)  # Default to 1 hour if not provided
                scope = token_info.get("scope", "")

                # Encrypt tokens
                encrypted_access_token = encryption_util.encrypt(access_token)
                encrypted_refresh_token = encryption_util.encrypt(refresh_token)

                expires_at = datetime.now() + timedelta(seconds=expires_in)

                # Store in Supabase
                integration_data = {
                    "user_id": user_id,
                    "provider": "spotify",
                    "access_token": encrypted_access_token,
                    "refresh_token": encrypted_refresh_token,
                    "expires_at": expires_at.isoformat(),
                    "scopes": scope.split(" "),
                }

                # Assuming 'integrations' table exists and RLS is set up
                response_db = self.supabase.table("integrations").insert(integration_data).execute()

                if response_db.data:
                    logger.info(f"Spotify tokens stored for user {user_id}")
                    return token_info
                else:
                    logger.error(f"Failed to store Spotify tokens for user {user_id}: {response_db.error}")
                    raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to store Spotify tokens")


            except httpx.HTTPStatusError as e:
                logger.error(
                    f"Spotify token exchange failed: {e.response.status_code} - {e.response.text}"
                )
                raise HTTPException(
                    status_code=e.response.status_code, detail="Spotify token exchange failed"
                )
            except httpx.RequestError as e:
                logger.error(f"Spotify token exchange network error: {e}")
                raise HTTPException(
                    status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                    detail="Could not connect to Spotify token service",
                )

    async def refresh_access_token(self, user_id: str) -> Optional[str]:
        """
        Refreshes the Spotify access token for a given user_id using stored refresh token.
        Returns the new access token if successful, None otherwise.
        """
        # Retrieve encrypted refresh token from DB
        response_db = self.supabase.table("integrations").select("refresh_token").eq("user_id", user_id).eq("provider", "spotify").single().execute()

        if not response_db.data:
            logger.warning(f"No Spotify integration found for user {user_id}")
            return None

        encrypted_refresh_token = response_db.data["refresh_token"]
        refresh_token = encryption_util.decrypt(encrypted_refresh_token)

        data = {
            "grant_type": "refresh_token",
            "refresh_token": refresh_token,
            "client_id": self.client_id,
            "client_secret": self.client_secret,
        }
        headers = {"Content-Type": "application/x-www-form-urlencoded"}

        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    self.spotify_token_url, data=data, headers=headers
                )
                response.raise_for_status()
                token_info = response.json()

                new_access_token = token_info.get("access_token")
                expires_in = token_info.get("expires_in", 3600)
                expires_at = datetime.now() + timedelta(seconds=expires_in)

                # Update stored access token and expiry
                update_data = {
                    "access_token": encryption_util.encrypt(new_access_token),
                    "expires_at": expires_at.isoformat(),
                }
                self.supabase.table("integrations").update(update_data).eq("user_id", user_id).eq("provider", "spotify").execute()

                logger.info(f"Spotify access token refreshed for user {user_id}")
                return new_access_token

            except httpx.HTTPStatusError as e:
                logger.error(
                    f"Spotify token refresh failed: {e.response.status_code} - {e.response.text}"
                )
                # Potentially clear invalid integration if refresh token is revoked/invalid
                self.supabase.table("integrations").delete().eq("user_id", user_id).eq("provider", "spotify").execute()
                raise HTTPException(
                    status_code=e.response.status_code, detail="Spotify token refresh failed"
                )
            except httpx.RequestError as e:
                logger.error(f"Spotify token refresh network error: {e}")
                raise HTTPException(
                    status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                    detail="Could not connect to Spotify token service",
                )

    async def _get_access_token(self, user_id: str) -> Optional[str]:
        """
        Retrieves and refreshes if necessary, the Spotify access token for a user.
        """
        response_db = self.supabase.table("integrations").select("*").eq("user_id", user_id).eq("provider", "spotify").single().execute()

        if not response_db.data:
            return None

        integration = response_db.data
        encrypted_access_token = integration["access_token"]
        expires_at_str = integration["expires_at"]
        expires_at = datetime.fromisoformat(expires_at_str)

        if expires_at < datetime.now() + timedelta(minutes=5): # Refresh if expired or expiring soon
            logger.info(f"Access token for user {user_id} is expired or near expiry. Attempting to refresh.")
            new_access_token = await self.refresh_access_token(user_id)
            if not new_access_token:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not refresh Spotify token.")
            return new_access_token
        
        return encryption_util.decrypt(encrypted_access_token)


    async def get_recently_played(self, user_id: str) -> list:
        """
        Fetches recently played tracks for the user.
        """
        access_token = await self._get_access_token(user_id)
        if not access_token:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Spotify not connected or token invalid.")

        headers = {"Authorization": f"Bearer {access_token}"}
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(f"{self.spotify_api_base_url}/me/player/recently-played", headers=headers)
                response.raise_for_status()
                return response.json().get("items", [])
            except httpx.HTTPStatusError as e:
                logger.error(f"Failed to get recently played tracks: {e.response.status_code} - {e.response.text}")
                raise HTTPException(status_code=e.response.status_code, detail="Failed to get recently played tracks from Spotify.")
            except httpx.RequestError as e:
                logger.error(f"Network error getting recently played tracks: {e}")
                raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Network error contacting Spotify.")

    async def get_audio_features(self, user_id: str, track_ids: list) -> list:
        """
        Fetches audio features for a list of track IDs.
        """
        if not track_ids:
            return []
        access_token = await self._get_access_token(user_id)
        if not access_token:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Spotify not connected or token invalid.")

        headers = {"Authorization": f"Bearer {access_token}"}
        # Spotify API allows up to 100 track IDs per request
        track_ids_str = ",".join(track_ids[:100])
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(f"{self.spotify_api_base_url}/audio-features?ids={track_ids_str}", headers=headers)
                response.raise_for_status()
                return response.json().get("audio_features", [])
            except httpx.HTTPStatusError as e:
                logger.error(f"Failed to get audio features: {e.response.status_code} - {e.response.text}")
                raise HTTPException(status_code=e.response.status_code, detail="Failed to get audio features from Spotify.")
            except httpx.RequestError as e:
                logger.error(f"Network error getting audio features: {e}")
                raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Network error contacting Spotify.")

    async def create_playlist(self, user_id: str, name: str, description: str, public: bool = False, tracks_uris: list = None) -> dict:
        """
        Creates a new playlist for the user and adds tracks to it.
        """
        access_token = await self._get_access_token(user_id)
        if not access_token:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Spotify not connected or token invalid.")

        # First, get the user's Spotify ID
        user_profile = await self._get_user_profile(user_id, access_token)
        spotify_user_id = user_profile["id"]

        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        
        # Create the playlist
        playlist_data = {
            "name": name,
            "description": description,
            "public": public
        }
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(f"{self.spotify_api_base_url}/users/{spotify_user_id}/playlists", 
                                             json=playlist_data, headers=headers)
                response.raise_for_status()
                playlist_info = response.json()
                playlist_id = playlist_info["id"]

                # Add tracks to the playlist if provided
                if tracks_uris:
                    await self._add_tracks_to_playlist(user_id, playlist_id, tracks_uris, access_token)

                return playlist_info
            except httpx.HTTPStatusError as e:
                logger.error(f"Failed to create playlist: {e.response.status_code} - {e.response.text}")
                raise HTTPException(status_code=e.response.status_code, detail="Failed to create playlist on Spotify.")
            except httpx.RequestError as e:
                logger.error(f"Network error creating playlist: {e}")
                raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Network error contacting Spotify.")

    async def _get_user_profile(self, user_id: str, access_token: str) -> dict:
        """
        Helper to get the user's Spotify profile (needed for creating playlists).
        """
        headers = {"Authorization": f"Bearer {access_token}"}
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(f"{self.spotify_api_base_url}/me", headers=headers)
                response.raise_for_status()
                return response.json()
            except httpx.HTTPStatusError as e:
                logger.error(f"Failed to get Spotify user profile: {e.response.status_code} - {e.response.text}")
                raise HTTPException(status_code=e.response.status_code, detail="Failed to get Spotify user profile.")

    async def _add_tracks_to_playlist(self, user_id: str, playlist_id: str, tracks_uris: list, access_token: str):
        """
        Helper to add tracks to an existing playlist.
        """
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        add_tracks_data = {"uris": tracks_uris}
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(f"{self.spotify_api_base_url}/playlists/{playlist_id}/tracks", 
                                             json=add_tracks_data, headers=headers)
                response.raise_for_status()
            except httpx.HTTPStatusError as e:
                logger.error(f"Failed to add tracks to playlist {playlist_id}: {e.response.status_code} - {e.response.text}")
                raise HTTPException(status_code=e.response.status_code, detail="Failed to add tracks to Spotify playlist.")

    async def generate_session_mix(self, user_id: str, mix_type: str, playlist_mode: str = "AI Smart Mix", seed_tags: Optional[list[str]] = None) -> dict:
        """
        Generates an AI-driven session mix based on user preferences and workout context.
        """
        access_token = await self._get_access_token(user_id)
        if not access_token:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Spotify not connected or token invalid.")

        logger.info(f"Generating {mix_type} mix for user {user_id} with mode {playlist_mode} and seeds {seed_tags}")

        # Placeholder for AI logic
        # 1. Fetch user's music preferences (from MusicPreferences table - TODO)
        # 2. Fetch recently played tracks
        recently_played_items = await self.get_recently_played(user_id)
        track_ids = [item["track"]["id"] for item in recently_played_items if item.get("track")]
        
        # 3. Get audio features for these tracks
        audio_features = await self.get_audio_features(user_id, track_ids)

        # 4. AI Music Scorer Logic (Placeholder: simple selection for now)
        # In a real scenario, this would involve:
        # - More sophisticated analysis of audio features, BPM matching to workout phase
        # - Incorporating user's seed_tags (genres/artists)
        # - Filtering out tracks with negative feedback
        # - Using a recommendation engine or LLM to select tracks

        # For demonstration, just return some of the recently played tracks as a mix
        selected_tracks = []
        for i, track_data in enumerate(recently_played_items[:5]): # Take top 5 for simplicity
            track_id = track_data["track"]["id"]
            track_name = track_data["track"]["name"]
            artist_name = track_data["track"]["artists"][0]["name"] if track_data["track"]["artists"] else "Unknown Artist"
            album_art_url = track_data["track"]["album"]["images"][0]["url"] if track_data["track"]["album"]["images"] else "https://via.placeholder.com/56"
            
            # Dummy phase assignment for demonstration
            phase = "Warm-up" if i == 0 else ("Cool-down" if i == 4 else "Peak")
            phase_icon = "local_fire_department" if phase == "Warm-up" else ("battery_horiz_075" if phase == "Cool-down" else "trending_up")
            phase_color = "text-yellow-400" if phase == "Warm-up" else ("text-cyan-400" if phase == "Cool-down" else "text-red-500")

            selected_tracks.append({
                "id": track_id,
                "title": track_name,
                "artist": artist_name,
                "albumArt": album_art_url,
                "phase": phase,
                "phaseIcon": phase_icon,
                "phaseColor": phase_color,
                "uri": track_data["track"]["uri"]
            })
        
        # 5. Create a playlist on Spotify
        playlist_name = f"{mix_type} Mix by AI ({datetime.now().strftime('%Y-%m-%d %H:%M')})"
        playlist_description = f"Personalized {mix_type} mix generated by AI for your workout."
        tracks_uris = [t["uri"] for t in selected_tracks]

        playlist_info = await self.create_playlist(user_id, playlist_name, playlist_description, public=False, tracks_uris=tracks_uris)
        playlist_id = playlist_info["id"]

        return {
            "playlist_id": playlist_id,
            "mix_type": mix_type,
            "tracks": selected_tracks,
            "seedTags": seed_tags,
            "playlistMode": playlist_mode,
            "totalDuration": "42:15", # Placeholder
            "trackCount": len(selected_tracks)
        }



