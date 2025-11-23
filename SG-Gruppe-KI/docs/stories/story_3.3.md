As a User,
I want the AI to generate a Spotify playlist with BPM-matched music for my workout,
So that my music aligns with the intensity of my training phases.

**Acceptance Criteria:**

**Given** a connected Spotify account and a generated workout plan
**When** the user requests a "Session Mix"
**Then** the AI analyzes their listening history and track BPMs.
**And** a new Spotify playlist is created and populated with BPM-matched tracks according to the workout phases.

**Prerequisites:** Story 3.1, Story 2.2 (AI Daily Plan Generation).

**Technical Notes:** FastAPI backend uses Spotify Web API for audio analysis (BPM) and playlist creation. This data can be cached in workout_music_sessions.
