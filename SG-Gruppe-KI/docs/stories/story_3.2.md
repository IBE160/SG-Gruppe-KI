As a User,
I want to control Spotify music playback (play, pause, skip) directly from the workout player,
So that I can manage my music without leaving the workout.

**Acceptance Criteria:**

**Given** a connected Spotify account and an active workout
**When** the user is in the workout player
**Then** they see controls to play, pause, and skip tracks.
**And** these controls successfully interact with Spotify playback.

**Prerequisites:** Story 3.1, Epic 2.4 (Workout Player UI).

**Technical Notes:** Integrate the Spotify Web Playback SDK into the frontend. Use the FastAPI backend to relay playback commands to Spotify's API.
