# User Story: 3.2 Spotify Playback Control in Workout Player

**As a:** User
**I want to:** control Spotify music playback (play, pause, skip) directly from the workout player,
**So that:** I can manage my music without leaving the workout.

## Description

This story covers the implementation of Spotify music playback controls within the workout player interface. Users should be able to play, pause, and skip tracks without needing to exit the workout experience, ensuring an uninterrupted training session.

## Acceptance Criteria

**Given** a connected Spotify account and an active workout
**When** the user is in the workout player
**Then** they see controls to play, pause, and skip tracks.
**And** these controls successfully interact with Spotify playback.
    *   The workout player UI displays clear play/pause, next track, and previous track buttons.
    *   Clicking play/pause toggles the current track's playback state via Spotify API.
    *   Clicking next track advances to the next song in the current Spotify queue/playlist.
    *   Clicking previous track returns to the previous song in the current Spotify queue/playlist.
    *   Playback state (playing/paused) is accurately reflected in the UI.

## Status

drafted

## Dev Notes

### Architecture Patterns and Constraints
The implementation will primarily involve frontend integration with the Spotify Web Playback SDK and communication with the FastAPI backend to relay playback commands to Spotify's Web API. Security for token management is handled by Supabase and the backend as per `architecture.md`. This story depends on `Story 3.1: Spotify Account Connection` for user authentication with Spotify.

### References
*   [Source: epics.md#story-3-2-spotify-playback-control-in-workout-player]
*   [Source: architecture.md#spotify-integration]
*   [Source: architecture.md#api-contracts]

### Prerequisites
*   Story 3.1: Spotify Account Connection
*   Epic 2.4: Workout Player UI

### Technical Notes
Integrate the Spotify Web Playback SDK into the frontend (Next.js application). The frontend will use the SDK to display controls and receive user input. Playback commands will be routed through the FastAPI backend to relay commands to Spotify's API, ensuring secure handling of access tokens and adherence to API rate limits.

## Tasks

- [ ] Task 1: Integrate Spotify Web Playback SDK into the frontend (AC: #1)
- [ ] Task 2: Implement UI for play/pause, next, and previous track controls in the workout player (AC: #1)
- [ ] Task 3: Develop frontend logic to send playback commands to the FastAPI backend (AC: #1)
- [ ] Task 4: Implement FastAPI endpoint to receive playback commands and interact with Spotify Web API (AC: #1)
- [ ] Task 5: Handle Spotify API responses and errors for playback commands (AC: #1)
- [ ] Task 6: Implement UI to reflect real-time Spotify playback state (AC: #1)
- [ ] Task 7: Ensure secure handling of Spotify access tokens in backend (AC: #1)
- [ ] Task 8: Write unit tests for frontend playback control components.
- [ ] Task 9: Write integration tests for FastAPI Spotify playback endpoint.
- [ ] Task 10: Conduct end-to-end testing for Spotify playback control within the workout player.

## Dev Agent Record

### Context Reference
This story was drafted based on the requirements in `epics.md` (Epic 3, Story 3.2) and previous validation feedback for story structure.

### Agent Model Used
Gemini-1.5-Flash

### Debug Log References
N/A

### Completion Notes List
- Initial draft of story with ACs and description.
- Added Dev Notes, Tasks, Dev Agent Record, and Change Log sections.
- Aligned ACs with `epics.md` and broke down into tasks.

### File List
- `docs/sprint-artifacts/3-2-spotify-playback-control-in-workout-player.md` (MODIFIED)
- `docs/sprint-artifacts/sprint-status.yaml` (MODIFIED)

## Change Log

- **2025-11-25**: Initial draft created by Gemini CLI based on `epics.md`.
- **2025-11-25**: Added Status, Dev Notes, Tasks, Dev Agent Record, and Change Log sections. ACs reviewed and refined to align with epic. Status in `sprint-status.yaml` updated to 'drafted'.
