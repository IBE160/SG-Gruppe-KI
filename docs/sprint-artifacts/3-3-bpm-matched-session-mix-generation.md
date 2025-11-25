# User Story: 3.3 BPM-Matched Session Mix Generation

**As a:** User
**I want to:** the AI to generate a Spotify playlist with BPM-matched music for my workout,
**So that:** my music aligns with the intensity of my training phases.

## Description

This story covers the implementation of an AI-powered feature to generate Spotify playlists where the music's BPM (Beats Per Minute) matches the intensity requirements of the user's workout phases. This will enhance the user experience by providing an adaptive and motivating musical accompaniment to their training.

## Acceptance Criteria

**Given** a connected Spotify account and a generated workout plan
**When** the user requests a "Session Mix"
**Then** the AI analyzes their listening history and track BPMs.
**And** a new Spotify playlist is created and populated with BPM-matched tracks according to the workout phases.
    *   User can initiate "Session Mix" generation from the workout plan or player interface.
    *   The AI successfully analyzes the user's Spotify listening history to identify suitable tracks.
    *   The AI accurately determines the BPM of selected tracks using the Spotify Web API.
    *   A new Spotify playlist is created under the user's account.
    *   Tracks are added to the playlist, with consideration for matching BPM to workout phase intensity.
    *   The generated playlist is accessible within the application (e.g., via the workout player).

## Status

drafted

## Dev Notes

### Architecture Patterns and Constraints
This feature relies heavily on backend processing to interact with the Spotify Web API for audio analysis and playlist creation, and with the AI model for intelligent track selection. The FastAPI backend will orchestrate these interactions. Data persistence for music sessions will be handled by Supabase as per `architecture.md`. This story depends on `Story 3.1: Spotify Account Connection` for Spotify authentication and `Story 2.2: AI Daily Plan Generation` for the workout plan context.

### References
*   [Source: epics.md#story-3-3-bpm-matched-session-mix-generation]
*   [Source: architecture.md#spotify-integration]
*   [Source: architecture.md#ai-integration-and-prompting]

### Prerequisites
*   Story 3.1: Spotify Account Connection
*   Story 2.2: AI Daily Plan Generation

### Technical Notes
The FastAPI backend will utilize the Spotify Web API's audio analysis endpoints (`/audio-features`) to determine track BPMs. AI prompts will be crafted to leverage user listening history and workout phase intensity to curate the playlist. The backend will handle the creation and population of the Spotify playlist. Caching of audio analysis data in the `workout_music_sessions` table should be considered to optimize performance and reduce repeated API calls.

## Tasks

- [ ] Task 1: Implement UI element to request "Session Mix" (AC: #1)
- [ ] Task 2: Develop FastAPI endpoint for "Session Mix" generation (AC: #1)
- [ ] Task 3: Integrate Spotify Web API for track audio analysis (BPM) in backend (AC: #1)
- [ ] Task 4: Implement AI prompting logic to select BPM-matched tracks (AC: #1)
- [ ] Task 5: Develop FastAPI logic to create and populate Spotify playlist (AC: #1)
- [ ] Task 6: Implement logic to cache audio analysis data (AC: #1)
- [ ] Task 7: Ensure error handling for Spotify API and AI model interactions (AC: #1)
- [ ] Task 8: Integrate generated playlist into the workout player UI (AC: #1)
- [ ] Task 9: Write unit tests for Spotify API integration and AI logic.
- [ ] Task 10: Write integration tests for the "Session Mix" generation endpoint.
- [ ] Task 11: Conduct end-to-end testing for the full "Session Mix" generation and playback flow.

## Dev Agent Record

### Context Reference
This story was drafted based on the requirements in `epics.md` (Epic 3, Story 3.3) and previous validation feedback for story structure.

### Agent Model Used
Gemini-1.5-Flash

### Debug Log References
N/A

### Completion Notes List
- Initial draft of story with ACs and description.
- Added Dev Notes, Tasks, Dev Agent Record, and Change Log sections.
- Aligned ACs with `epics.md` and broke down into tasks.

### File List
- `docs/sprint-artifacts/3-3-bpm-matched-session-mix-generation.md` (MODIFIED)
- `docs/sprint-artifacts/sprint-status.yaml` (MODIFIED)

## Change Log

- **2025-11-25**: Initial draft created by Gemini CLI based on `epics.md`.
- **2025-11-25**: Added Status, Dev Notes, Tasks, Dev Agent Record, and Change Log sections. ACs reviewed and refined to align with epic. Status in `sprint-status.yaml` updated to 'drafted'.
