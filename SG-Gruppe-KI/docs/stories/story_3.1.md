As a User,
I want to securely connect my Spotify account,
So that the application can access my playback controls and listening history.

**Acceptance Criteria:**

**Given** a user is in the settings or onboarding flow
**When** they click "Connect Spotify"
**Then** they are redirected to Spotify's OAuth (PKCE) consent screen.
**And** upon successful authorization, their access and refresh tokens are securely stored in the spotify_integrations table.

**Prerequisites:** Epic 1.

**Technical Notes:** Implement the PKCE OAuth flow for Spotify. Handle token storage and refresh using the FastAPI backend.
