# Epic Technical Specification: {{epic_title}}

Date: {{date}}
Author: {{user_name}}
Epic ID: {{epic_id}}
Status: Draft

---

## Overview

This document provides the technical specification for Epic 3: Enhanced Experience & Personalization. This epic focuses on enriching the user experience by deeply integrating music into the workout sessions. It covers connecting the user's Spotify account, using AI to generate personalized and phase-aligned workout playlists ("Session Mix"), and providing in-app controls for music playback.

## Objectives and Scope

### In-Scope
- Story 3.1: Implementing the secure OAuth 2.0 (PKCE) flow to connect a user's Spotify account.
- Story 3.2: Developing the backend services and AI logic to generate personalized "Session Mix" playlists based on user listening history, workout phase, and BPM.
- Story 3.3: Integrating music playback controls (play, pause, skip) and visual BPM-matching feedback directly into the Workout Player UI.
- Storing Spotify tokens and user music preferences in the database.

### Out-of-Scope
- Core user authentication (handled in Epic 1).
- AI workout plan generation (handled in Epic 2).
- Support for music services other than Spotify.

## System Architecture Alignment

This epic is a direct implementation of the **"AI-Driven Music Matching ('Smart Radio')"** architectural pattern. A new **`Music Service`** will be created in the FastAPI backend (`apps/api`) to handle all interactions with the external Spotify API. This includes managing the OAuth flow, fetching user listening history, and creating playlists. The design introduces new Supabase tables (`Integrations`, `MusicPreferences`) to securely store API tokens and user music tastes. The frontend (`apps/web`) will implement the UI for the connection flow (Flow 3) and integrate playback controls into the existing `Workout Player UI` (Flow 9). All new components will adhere to the project's established conventions.

## Detailed Design

### Services and Modules

| Service/Module | Location | Responsibilities | Owner |
| :--- | :--- | :--- | :--- |
| **Music Service** | `apps/api` | Manages all interactions with the Spotify API, including OAuth, token management, and playlist creation. | Backend |
| **AI Music Scorer** | `apps/api` | A component within the Music Service that ranks tracks based on BPM, audio features, and user feedback to build "Session Mixes". | Backend |
| **Spotify Connect UI**| `apps/web` | Implements the frontend components for the Spotify connection flow (Flow 3), including the explainer screen. | Frontend |
| **Session Mix UI** | `apps/web` | Provides the interface for generating, previewing, and customizing the AI-driven workout playlist (Flow 11). | Frontend |
| **Playback Controls UI**| `apps/web` | A set of UI components (play, pause, skip buttons, BPM visualizer) to be integrated into the existing `Workout Player UI`. | Frontend |

### Data Models and Contracts

The following new tables are required for Epic 3.

**Table: `Integrations`**
*   `id` (uuid, PK): Primary key.
*   `user_id` (uuid, FK to `Users.id`): Foreign key linking to the user.
*   `provider` (varchar): The name of the integrated service (e.g., "spotify").
*   `access_token` (text): The encrypted access token for the external API.
*   `refresh_token` (text): The encrypted refresh token.
*   `expires_at` (timestamp with time zone): When the access token expires.
*   `scopes` (text[]): Array of granted OAuth scopes.
*   `created_at` (timestamp with time zone).

**Table: `MusicPreferences`**
*   `id` (uuid, PK): Primary key.
*   `user_id` (uuid, FK to `Users.id`): Foreign key linking to the user.
*   `seed_genres` (text[], nullable): An array of preferred genres to seed the AI.
*   `seed_artists` (text[], nullable): An array of preferred artists to seed the AI.
*   `negative_feedback_tracks` (text[], nullable): A list of Spotify track IDs the user has disliked or skipped.

### APIs and Interfaces

*   **`GET /music/connect/spotify`**
    *   Redirects the user to the Spotify OAuth consent screen with the required scopes.
*   **`GET /music/callback/spotify`**
    *   The callback URL that Spotify redirects to after user consent. The backend exchanges the received code for access/refresh tokens and stores them in the `Integrations` table.
*   **`POST /music/session-mix`**
    *   **Headers:** `Authorization: Bearer <access_token>`
    *   **Request:** `{ "workout_plan_id": "...", "mix_type": "full_session" }`
    *   **Response (Success):** `{ "data": { "playlist_id": "...", "tracks": [...] } }`
*   **`POST /music/feedback`**
    *   **Headers:** `Authorization: Bearer <access_token>`
    *   **Request:** `{ "track_id": "...", "feedback_type": "skip" }`
    *   **Response (Success):** `{ "data": { "message": "Feedback recorded" } }`
*   **`PUT /music/playback`**
    *   **Headers:** `Authorization: Bearer <access_token>`
    *   **Request:** `{ "action": "play" | "pause" | "skip_forward" }`
    *   **Response (Success):** `{ "data": { "message": "Action performed" } }`

### Workflows and Sequencing

1.  **Spotify Account Connection:**
    1.  User clicks "Connect with Spotify" in the UI (Flow 3).
    2.  Frontend opens a new window or redirects to the `GET /music/connect/spotify` backend endpoint.
    3.  User grants permissions on the Spotify website.
    4.  Spotify redirects back to `GET /music/callback/spotify`.
    5.  Backend exchanges the authorization code for tokens, encrypts them, and saves them to the `Integrations` table.
    6.  The callback page confirms success and closes, and the original UI updates to show a "Connected" status.
2.  **Session Mix Generation:**
    1.  Before a workout, the user opts to generate a "Session Mix" (Flow 11).
    2.  Frontend calls `POST /music/session-mix`.
    3.  Backend's **AI Music Scorer** fetches user preferences, analyzes the workout plan's phases, and queries the Spotify API for suitable tracks.
    4.  A new, temporary playlist is created in the user's Spotify account.
    5.  The playlist details are returned to the frontend for the user to preview and customize.
3.  **In-Workout Playback:**
    1.  User starts the workout.
    2.  The **Playback Controls UI** within the Workout Player is enabled.
    3.  User actions (play, pause, skip) trigger calls to the `PUT /music/playback` endpoint, which in turn controls the user's active Spotify session via their API.
    4.  A "skip" action also triggers a call to `POST /music/feedback` to negatively weight that track for future recommendations.

## Non-Functional Requirements

### Performance

-   **API Latency:** Calls to the Spotify API must have a timeout of 5 seconds. The frontend should display a loading indicator during these calls.
-   **UI Responsiveness:** In-workout playback controls must respond to user input in < 200ms.

### Security

-   **Token Storage:** All Spotify `access_token` and `refresh_token` values MUST be encrypted at rest in the `Integrations` database table.
-   **Token Exposure:** At no point should a user's API tokens be exposed to the client-side application after the initial OAuth callback. All API requests to Spotify must be proxied through the FastAPI backend.

### Reliability/Availability

-   **API Failure:** If the Spotify API is unavailable, all music-related features should be gracefully disabled in the UI, with a message informing the user. The core workout functionality must not be affected.
-   **Permission Revoked:** The application must handle cases where a user revokes permissions from their Spotify account settings, prompting for reconnection when a music feature is next accessed.

### Observability

-   **API Logging:** All requests to the Spotify API will be logged with their duration and response status to monitor performance and error rates.

## Dependencies and Integrations

### Core Dependencies
-   **spotipy:** A Python library will be used in the backend to simplify interactions with the Spotify Web API.
-   **spotify-web-playback-sdk:** The official Spotify SDK will be used on the frontend to enable in-app playback control.

### Integrations

-   **Spotify API:** The primary external dependency for this epic. Used for authentication, fetching user data, searching for tracks, and creating playlists.

## Acceptance Criteria (Authoritative)

**Story 3.1: Spotify Integration & OAuth**
1.  **AC3.1.1:** A user is redirected to the Spotify OAuth consent screen when they choose to connect their account.
2.  **AC3.1.2:** After granting permissions, the user is redirected back to the app, and the connection status is confirmed.
3.  **AC3.1.3:** Spotify access and refresh tokens are securely stored in the `Integrations` table.

**Story 3.2: AI-Driven Session Mix Generation**
4.  **AC3.2.1:** The user can request an AI-generated "Session Mix" for an active workout plan.
5.  **AC3.2.2:** The backend's `AI Music Scorer` generates a playlist based on the workout's phases and the user's music preferences.
6.  **AC3.2.3:** The user can preview and make minor customizations to the generated playlist before starting the workout.

**Story 3.3: In-Workout Music Playback & Controls**
7.  **AC3.3.1:** Music playback controls (play/pause, skip) are available in the Workout Player UI.
8.  **AC3.3.2:** The UI provides visual feedback on how the current track's BPM matches the workout phase's target.
9.  **AC3.3.3:** User interactions, such as skipping a track, are logged as feedback to improve future AI recommendations.

## Traceability Mapping

| AC ID | Spec Section(s) | Component(s) / API(s) | Test Idea |
| :--- | :--- | :--- | :--- |
| AC3.1.2 | APIs, Data Models | `GET /music/callback/spotify`, `Integrations` table | Integration test: Mock the Spotify token exchange response and verify that tokens are correctly stored in the test DB. |
| AC3.2.2 | Services, APIs | `AI Music Scorer`, `POST /music/session-mix` | Integration test: Mock Spotify API search results and verify the scorer selects appropriate tracks based on input criteria. |
| AC3.3.1 | UI Modules | `Playback Controls UI` | Component Test (RTL): Verify that clicking the play button triggers the correct event handler. |
| AC3.3.3 | APIs, Services | `POST /music/feedback` | E2E Test: Skip a track during a workout and verify the correct network request is sent to the feedback endpoint. |

## Risks, Assumptions, Open Questions

-   **Risk:** The Spotify API may change its endpoints or rate-limiting policies, which could break the integration.
    -   **Mitigation:** The `Music Service` will encapsulate all Spotify API calls, providing a single point for updates. The service will implement exponential backoff for retries on rate-limited requests.
-   **Risk:** The user might not have an active Spotify Premium account, which is required for many playback control features.
    -   **Mitigation:** The UI will clearly state that a Spotify Premium account is required for the full experience. The backend will check the user's account type after connection and gracefully disable features not available to free-tier users.
-   **Assumption:** The Spotify Web Playback SDK will work reliably across all target modern browsers (Chrome, Firefox, Safari).

## Test Strategy Summary

The test strategy will be heavily focused on mocking the external Spotify API to ensure reliable and repeatable tests.

-   **Unit Tests:** Will cover UI components and utility functions for formatting track data.
-   **Integration Tests:** The `Music Service` will be tested extensively. A mock Spotify API server (or a library like `requests-mock`) will be used to simulate successful responses, error codes (4xx, 5xx), rate limiting, and different user account types (Premium vs. Free).
-   **End-to-End Tests:** A Playwright test will cover the OAuth connection flow by mocking the redirect and callback. Another test will cover the user flow of generating a session mix and interacting with the playback controls during a workout, again using a mocked Spotify API.
