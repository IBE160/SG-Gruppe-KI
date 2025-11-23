# Epic Technical Specification: Enhanced User Experience & Settings

Date: 2025-11-21
Author: BIP
Epic ID: 3
Status: Draft

---

## Overview

This epic focuses on enriching the user experience by integrating Spotify for music playback and BPM-matched session mixes, providing in-app reminders and offline capabilities, and offering comprehensive settings for user control.

## Objectives and Scope

**In-Scope:**
*   Secure Spotify account connection via PKCE OAuth (FR008).
*   Spotify playback control (play, pause, skip) directly from the workout player (FR008).
*   AI generation of BPM-matched Spotify playlists for workout sessions (FR008).
*   In-app reminders and nudges for consistency (FR006).
*   Offline caching of daily workout plans and logs, with data synchronization upon reconnection (FR007).
*   Comprehensive settings page for general preferences, appearance, performance & data, music & playback, AI & personalization, privacy & account (FR012).

**Out-of-Scope:**
*   Full-fledged music streaming service development (Spotify integration focuses on control and curated playlists).
*   Integration with other music streaming services.
*   Complex, real-time analytics for user preferences within the settings (basic persistence of choices).
*   Advanced notification features beyond in-app reminders.

## System Architecture Alignment

This epic aligns with architectural decisions by leveraging:
*   **Frontend (Next.js):** For the UI of Spotify integration (connection, playback controls), settings pages, and in-app reminder display (ADR: Frontend Framework).
*   **Backend (FastAPI):** For handling Spotify OAuth callbacks, token management, audio analysis, reminder triggers, and user settings CRUD operations (ADR: Backend Framework).
*   **Database (Supabase PostgreSQL):** For persistent storage of `spotify_integrations`, `workout_music_sessions`, and `user_settings` tables (ADR: Data Architecture).
*   **Spotify Web API & Web Playback SDK:** External integration for music features (ADR: Spotify Integration).
*   **Celery/Redis:** For background processing of reminders (ADR: Background Job Processing).
*   **IndexedDB + Outbox Pattern:** For enabling robust offline capabilities for plans and logs (ADR: Offline Data Sync).
## Detailed Design

### Services and Modules

### Services and Modules

*   **Frontend (Next.js Application):**
    *   **Spotify Integration Module:** UI for connecting/disconnecting Spotify, displaying playback controls in Workout Player, and requesting Session Mix. Interacts with `Spotify API`.
    *   **Settings Module:** Comprehensive UI for managing user preferences across various categories. Interacts with `User Settings API`.
    *   **Notification Module:** Displays in-app reminders and nudges.
    *   **Offline Module:** Manages IndexedDB for local caching and synchronizes data with backend using Outbox Pattern.

*   **Backend (FastAPI Application):**
    *   **Spotify API (`app/api/v1/spotify.py`):** Handles Spotify PKCE OAuth callback, token management (store/refresh), and relays playback commands to Spotify. Integrates with Spotify Web API for audio analysis.
    *   **User Settings API (`app/api/v1/user_settings.py`):** Endpoints for CRUD operations on user settings.
    *   **Reminder Service (`app/services/reminder_service.py`):** Background task (Celery) for triggering scheduled in-app reminders.
    *   **Offline Sync Service (`app/services/offline_sync_service.py`):** Processes data from Outbox Pattern (from frontend) and persists to database.
    *   **AI Music Service (`app/services/ai_music_service.py`):** Integrates with OpenAI API and Spotify Web API to generate BPM-matched session mixes based on workout plan and user listening history.

### Data Models and Contracts

### Data Models and Contracts

*   **`spotify_integrations` table:**
    *   `id` (UUID, Primary Key): Unique identifier for the integration record.
    *   `user_id` (UUID, Foreign Key to `users.id`, UNIQUE): 1-to-1 link to a user.
    *   `spotify_user_id` (TEXT, UNIQUE): User's unique ID from Spotify.
    *   `access_token` (TEXT, ENCRYPTED): OAuth access token.
    *   `refresh_token` (TEXT, ENCRYPTED): OAuth refresh token.
    *   `expires_at` (TIMESTAMP WITH TIME ZONE): Token expiration timestamp.
    *   `created_at`, `updated_at` (TIMESTAMP WITH TIME ZONE): Timestamps.

*   **`workout_music_sessions` table:**
    *   `id` (UUID, Primary Key): Unique identifier for the music session record.
    *   `workout_plan_id` (UUID, Foreign Key to `workout_plans.id`, UNIQUE): 1-to-1 link with a workout plan.
    *   `spotify_playlist_uri` (TEXT): URI of the Spotify playlist for the session.
    *   `target_bpm_min` (INTEGER, NULLABLE): Minimum target BPM.
    *   `target_bpm_max` (INTEGER, NULLABLE): Maximum target BPM.
    *   `mood_tags` (TEXT[], NULLABLE): Tags for musical mood.
    *   `track_analysis_cache` (JSONB, NULLABLE): Cached Spotify audio analysis results.
    *   `created_at`, `updated_at` (TIMESTAMP WITH TIME ZONE): Timestamps.

*   **`user_settings` table:**
    *   `id` (UUID, Primary Key): Unique identifier for the setting.
    *   `user_id` (UUID, Foreign Key to `users.id`): Links the setting to a user.
    *   `setting_key` (TEXT): Key for the setting (e.g., 'theme', 'notifications_enabled').
    *   `setting_value` (TEXT): Value for the setting.
    *   `created_at`, `updated_at` (TIMESTAMP WITH TIME ZONE): Timestamps.
    *   Composite UNIQUE constraint on `user_id` and `setting_key`.

*   **Offline Data (Client-side IndexedDB):** Stores `daily_contexts` and `workout_logs` when offline.
*   **Outbox Pattern (Client-side & Server-side):** Ensures reliable transmission of offline data to the backend.

### APIs and Interfaces

### APIs and Interfaces

*   **Spotify Endpoints (FastAPI `app/api/v1/spotify.py`):**
    *   `GET /api/v1/spotify/connect`:
        *   **Description:** Initiates Spotify PKCE OAuth flow.
        *   **Response (302 Redirect):** Redirects to Spotify authorization page.
    *   `GET /api/v1/spotify/callback`:
        *   **Description:** Spotify OAuth callback. Exchanges code for tokens.
        *   **Response (302 Redirect):** Redirects to frontend with session/status.
    *   `POST /api/v1/spotify/playback/{command}`:
        *   **Description:** Controls Spotify playback (e.g., play, pause, next).
        *   **Request Body:** (Optional) `{ "device_id": "string", "track_uri": "string" }`
        *   **Response (200 OK):** `{ "message": "success" }`
    *   `POST /api/v1/spotify/mix`:
        *   **Description:** Requests AI to generate a BPM-matched session mix.
        *   **Request Body:** `{ "workout_plan_id": "uuid", "target_bpm_min": "int", "target_bpm_max": "int", "mood_tags": ["string"] }`
        *   **Response (200 OK):** `{ "message": "success", "data": { "spotify_playlist_uri": "string", "workout_music_session_id": "uuid" } }`

*   **User Settings Endpoints (FastAPI `app/api/v1/user_settings.py`):**
    *   `GET /api/v1/user_settings`:
        *   **Description:** Retrieves all settings for the authenticated user.
        *   **Response (200 OK):** `{ "message": "success", "data": [{ "setting_key": "string", "setting_value": "string" }] }`
    *   `PUT /api/v1/user_settings/{key}`:
        *   **Description:** Updates a specific user setting.
        *   **Request Body:** `{ "value": "string" }`
        *   **Response (200 OK):** `{ "message": "success" }`

*   **Reminders (Internal Celery Task):**
    *   `trigger_in_app_reminder(user_id, message, type)`: Celery task to send in-app notifications.

*   **Offline Data Sync (FastAPI `app/api/v1/offline_sync.py` - Illustrative):**
    *   `POST /api/v1/offline_sync/workout_logs`:
        *   **Description:** Endpoint to receive batched workout logs from offline client.
        *   **Request Body:** `[{ "exercise_name": "string", ... }]`
        *   **Response (200 OK):** `{ "message": "success", "processed_count": "int" }`

*   **Spotify Web API (External):**
    *   `GET /v1/me/player`: Get user's current playback state.
    *   `PUT /v1/me/player/play`: Start/Resume playback.
    *   `POST /v1/playlists/{playlist_id}/tracks`: Add items to a playlist.
    *   `GET /v1/audio-features/{id}`: Get audio features for a track (e.g., BPM).
    *   Authorization via Access Token.

*   **Spotify Web Playback SDK (Frontend):**
    *   Client-side JavaScript library for controlling playback on web browsers. Provides an API to connect to Spotify and receive/send playback commands.

### Workflows and Sequencing

### Workflows and Sequencing

1.  **Spotify Account Connection (Story 3.1):**
    *   **Sequence:** User clicks "Connect Spotify" on frontend. Frontend generates PKCE code_verifier/challenge and redirects to Spotify. User authorizes app. Spotify redirects to FastAPI `GET /api/v1/spotify/callback`. Backend exchanges code for access/refresh tokens, encrypts, and stores in `spotify_integrations` table. Backend redirects to frontend with success/failure status.
    *   **Outcome:** User's Spotify account is securely linked to the application.

2.  **Spotify Playback Control in Workout Player (Story 3.2):**
    *   **Sequence:** Authenticated user starts workout with connected Spotify. Frontend `Spotify Integration Module` uses Spotify Web Playback SDK to connect to Spotify and render playback controls (play, pause, skip). User interacts with controls. Frontend sends commands via FastAPI `POST /api/v1/spotify/playback/{command}` to relay to Spotify Web API.
    *   **Outcome:** User can control Spotify music directly from the workout player.

3.  **BPM-Matched Session Mix Generation (Story 3.3):**
    *   **Sequence:** User requests "Session Mix" from frontend. Frontend sends `POST /api/v1/spotify/mix` with `workout_plan_id` and target BPMs.
    *   **Backend (`AI Music Service`):**
        *   Retrieves user's Spotify listening history/playlists.
        *   Calls Spotify Web API to get audio features (BPM) for tracks.
        *   Uses AI (OpenAI API) to curate a playlist matching BPM and workout intensity.
        *   Creates new playlist on Spotify via Spotify Web API.
        *   Stores `spotify_playlist_uri` and `track_analysis_cache` in `workout_music_sessions` table.
        *   Returns playlist URI to frontend.
    *   **Outcome:** A personalized, BPM-matched Spotify playlist is generated for the workout.

4.  **In-App Reminders and Nudges (Story 3.4):**
    *   **Sequence:** User enables reminders (via Settings Module). Frontend saves preference via `User Settings API`. Backend `Reminder Service` (Celery task) periodically checks for scheduled reminders. When due, triggers in-app notification to frontend `Notification Module`.
    *   **Outcome:** User receives timely reminders to maintain consistency.

5.  **Offline Cache for Daily Plans and Logs (Story 3.5):**
    *   **Sequence:**
        *   **Offline Plan Access:** Frontend loads daily plan online, stores in IndexedDB. If offline, loads from IndexedDB.
        *   **Offline Logging:** During offline workout, `Workout Player Module` logs sets to IndexedDB.
        *   **Sync on Reconnection:** Upon network reconnection, frontend `Offline Module` uses Outbox Pattern to send batched offline logs (via `Offline Sync API`) to backend. Backend `Offline Sync Service` processes and saves to `workout_logs` table.
    *   **Outcome:** Uninterrupted training and data logging during connectivity issues.

6.  **Comprehensive Settings Page (Story 3.6):**
    *   **Sequence:** User navigates to Settings (Frontend `Settings Module`). Frontend fetches current settings via `GET /api/v1/user_settings`. User modifies settings. Frontend sends `PUT /api/v1/user_settings/{key}` requests. Backend `User Settings API` updates `user_settings` table.
    *   **Outcome:** User has full control and personalization options for their app experience.

## Non-Functional Requirements

### Performance

### Performance

*   **Spotify API Latency:** Integrations with Spotify APIs for playback control and audio analysis should be optimized to minimize latency and provide a smooth user experience. Backend caching (Redis) of audio analysis data (`track_analysis_cache`) will mitigate repeated API calls.
*   **Offline Operation (NFR007):** The application must provide full session logging capabilities offline. This implies that the IndexedDB and Outbox Pattern for offline data synchronization must be performant and not introduce noticeable delays for the user when logging workouts or accessing cached plans.
*   **Settings Persistence:** User settings changes should be persisted rapidly without perceptible delay.
*   **Reminder Delivery:** In-app reminders should be delivered promptly as scheduled, leveraging efficient background processing.

### Security

### Security

*   **Spotify OAuth (NFR006):** Implementation of Spotify PKCE OAuth must be secure, protecting user access and refresh tokens from compromise. Tokens will be encrypted at rest in the `spotify_integrations` table.
*   **Data Privacy (NFR002, NFR003):** All user settings and Spotify integration data will be protected by Row-Level Security (RLS) policies in Supabase, ensuring users can only access their own data. GDPR compliance for Spotify data (revocation, deletion) is critical.
*   **Sensitive Data Handling:** Strict measures to prevent exposure of sensitive Spotify access tokens, user IDs, or PII in logs or through insecure frontend storage.
*   **API Access:** API endpoints for Spotify integration and user settings will require authenticated access and adhere to least privilege principles.

### Reliability/Availability

### Reliability/Availability

*   **Spotify Integration Robustness:** The application should gracefully handle Spotify API errors, rate limits, and network issues during OAuth, playback control, or mix generation, providing informative feedback to the user without crashing.
*   **Offline Data Sync Reliability:** The IndexedDB and Outbox Pattern must ensure the reliable synchronization of offline logged workout data, preventing data loss and handling potential conflicts.
*   **Reminder Delivery:** Celery/Redis background jobs for reminders should be highly reliable, ensuring scheduled nudges are delivered as intended.
*   **Availability (NFR005):** Core services for user settings and Spotify integration should contribute to the overall 99% uptime target for Phase 1.

### Observability

### Observability

*   **Structured Logging (NFR008):** All interactions with Spotify APIs, user settings modifications, offline data sync events, and reminder triggers will be logged with relevant contextual information.
*   **Metrics:** Monitor Spotify API call success rates, latency, and rate limit occurrences. Track offline data sync queue lengths and processing times. Monitor user settings change frequency and reminder delivery success rates.
*   **Error Tracking:** Capture and alert on errors related to Spotify integration failures (e.g., token refresh failures), offline data sync issues, or user settings persistence failures.
*   **GDPR Operations Tracking:** Metrics and alerts for GDPR operations related to Spotify data and user settings (e.g., data export/deletion job metrics).

## Dependencies and Integrations

## Dependencies and Integrations

This epic primarily focuses on integrating with Spotify and managing user preferences, building on existing core services:

*   **Internal Dependencies:**
    *   **Supabase PostgreSQL Database:** Core dependency for data persistence:
        *   `users` table (from Epic 1): For linking Spotify integrations and user settings.
        *   `workout_plans` table (from Epic 2): Linked to `workout_music_sessions`.
        *   `spotify_integrations` table: Stores Spotify authorization tokens.
        *   `workout_music_sessions` table: Stores musical context for workout plans.
        *   `user_settings` table: Stores all user preferences configured via the settings page.
    *   **Redis:** Serves as a message broker for Celery for background reminders.
    *   **Celery (Background Job Processor):** Executes asynchronous tasks such as triggering scheduled reminders.
    *   **Next.js Frontend:** Provides the UI for Spotify integration, settings page, and displays reminders.
    *   **FastAPI Backend:** Provides API endpoints for Spotify OAuth, playback control, session mix generation, user settings management, and offline data synchronization.

*   **External Dependencies:**
    *   **Spotify Web API:** Used by the FastAPI backend for audio analysis (BPM), playlist creation, and relaying playback commands.
    *   **Spotify Web Playback SDK:** Used by the Next.js frontend for direct in-app control of Spotify playback.
    *   **OpenAI API:** Utilized by the backend `AI Music Service` for intelligent BPM-matched session mix generation.

*   **Novel Pattern Implementations:**
    *   **Offline Data Synchronization (IndexedDB + Outbox Pattern):** Essential for `Story 3.5` to enable offline logging and plan access.

## Acceptance Criteria (Authoritative)

## Acceptance Criteria (Authoritative)

### Story 3.1: Spotify Account Connection
*   **AC 3.1.1:** Given a user is in the settings or onboarding flow, when they click "Connect Spotify", then they are redirected to Spotify's OAuth (PKCE) consent screen.
*   **AC 3.1.2:** And upon successful authorization, their access and refresh tokens are securely stored in the `spotify_integrations` table.

### Story 3.2: Spotify Playback Control in Workout Player
*   **AC 3.2.1:** Given a connected Spotify account and an active workout, when the user is in the workout player, then they see controls to play, pause, and skip tracks.
*   **AC 3.2.2:** And these controls successfully interact with Spotify playback.

### Story 3.3: BPM-Matched Session Mix Generation
*   **AC 3.3.1:** Given a connected Spotify account and a generated workout plan, when the user requests a "Session Mix", then the AI analyzes their listening history and track BPMs.
*   **AC 3.3.2:** And a new Spotify playlist is created and populated with BPM-matched tracks according to the workout phases.

### Story 3.4: In-App Reminders and Nudges
*   **AC 3.4.1:** Given a user has enabled reminders, when it's time for a scheduled workout or other event, then an in-app notification or message appears, reminding them.

### Story 3.5: Offline Cache for Daily Plans and Logs
*   **AC 3.5.1:** Given a user has loaded their daily plan while online, when they go offline, then they can still view their daily plan and log sets.
*   **AC 3.5.2:** And logged data is stored locally and synced to the backend upon reconnection.

### Story 3.6: Comprehensive Settings Page
*   **AC 3.6.1:** Given an authenticated user, when they navigate to the settings page, then they can view and modify various categories of settings (General, Appearance, Performance & Data, Music & Playback, AI & Personalization, Privacy & Account).
*   **AC 3.6.2:** And changes are persisted in the `user_settings` table.

## Traceability Mapping

| AC ID | Description (from Epic/Story) | Spec Section(s) | Component(s)/API(s) | Test Idea |
|---|---|---|---|---|
| 3.1.1 | Redirected to Spotify's OAuth (PKCE) consent screen | Detailed Design: APIs and Interfaces (GET /api/v1/spotify/connect) | Frontend Spotify Integration Module | UI test: click connect button, verify redirect to Spotify. |
| 3.1.2 | Access and refresh tokens stored securely | Detailed Design: Data Models (`spotify_integrations` table) | FastAPI Spotify API, Supabase `spotify_integrations` | Integration test: complete OAuth, verify encrypted tokens in DB. |
| 3.2.1 | See playback controls in workout player | Detailed Design: Services & Modules (Spotify Integration Module) | Frontend Workout Player, Spotify Web Playback SDK | UI test: during workout, verify Spotify controls appear. |
| 3.2.2 | Controls successfully interact with Spotify playback | Detailed Design: APIs and Interfaces (POST /api/v1/spotify/playback/{command}) | Frontend Spotify Integration Module, FastAPI Spotify API, Spotify Web API | UI test: click play/pause/skip, verify Spotify playback changes. |
| 3.3.1 | AI analyzes listening history and track BPMs | Detailed Design: Services & Modules (AI Music Service) | FastAPI AI Music Service, OpenAI API, Spotify Web API (audio analysis) | Integration test: request mix, verify backend calls Spotify for BPM data. |
| 3.3.2 | New Spotify playlist created with BPM-matched tracks | Detailed Design: APIs and Interfaces (POST /api/v1/spotify/mix) | FastAPI AI Music Service, Spotify Web API | Integration test: request mix, verify new playlist created on Spotify with relevant tracks. |
| 3.4.1 | In-app notification for scheduled event | Detailed Design: Services & Modules (Reminder Service) | Celery, Redis, Frontend Notification Module | Integration test: schedule reminder, verify in-app notification appears at correct time. |
| 3.5.1 | View daily plan and log sets offline | Detailed Design: Workflows and Sequencing (Offline Cache) | Frontend Offline Module (IndexedDB) | UI test: load plan online, go offline, verify plan visible and sets can be logged. |
| 3.5.2 | Logged data synced upon reconnection | Detailed Design: APIs and Interfaces (POST /api/v1/offline_sync/workout_logs) | Frontend Offline Module (Outbox Pattern), FastAPI Offline Sync Service | Integration test: log offline, reconnect, verify data appears in backend DB. |
| 3.6.1 | View and modify various categories of settings | Detailed Design: Services & Modules (Settings Module) | Frontend Settings Module, `GET /api/v1/user_settings` | UI test: navigate to settings, verify all categories and current values are displayed. |
| 3.6.2 | Changes persisted in `user_settings` table | Detailed Design: APIs and Interfaces (PUT /api/v1/user_settings/{key}) | Frontend Settings Module, FastAPI User Settings API, Supabase `user_settings` | Integration test: change setting via UI, verify value updated in DB. |

## Risks, Assumptions, Open Questions

## Risks, Assumptions, Open Questions

*   **Risks:**
    *   **Spotify API Rate Limits & Changes:** Exceeding Spotify API rate limits or unexpected changes to their API could disrupt integration functionality. Requires robust error handling and monitoring.
    *   **Offline Data Sync Complexity:** Ensuring 100% data integrity and conflict resolution for offline data sync (IndexedDB and Outbox Pattern) can be challenging and error-prone, potentially leading to data loss or inconsistencies.
    *   **AI Music Mix Quality:** The quality of BPM-matched session mixes generated by AI (Story 3.3) might not always meet user expectations, requiring continuous refinement of the AI model and prompting.
    *   **Security of Spotify Tokens:** Compromise of Spotify access/refresh tokens could lead to unauthorized access to a user's Spotify account. Strong encryption and secure storage are paramount.

*   **Assumptions:**
    *   Spotify's Web Playback SDK is stable and provides sufficient control for the intended in-app music experience.
    *   The `track_analysis_cache` for Spotify audio features will significantly reduce repeated API calls and stay performant.
    *   Users will have a stable internet connection for initial plan loading and eventual synchronization of offline data.
    *   The volume of reminders and nudges will not overwhelm users, and appropriate user controls will be available in settings.

*   **Open Questions:**
    *   What are the specific performance targets for offline data synchronization (e.g., how quickly should data sync once online)?
    *   What level of customization will be offered for BPM-matched session mixes (e.g., genre preferences, explicit content filters)?
    *   How will the `track_analysis_cache` be invalidated or updated if Spotify's audio analysis changes or new tracks are added to a playlist?
    *   What mechanisms will be in place to detect and alert on failed reminder deliveries?

## Test Strategy Summary

## Test Strategy Summary

The testing strategy for Epic 3 will emphasize integration testing with Spotify, robust offline functionality, and comprehensive settings validation.

*   **Unit Tests:**
    *   **Frontend:** Test UI components for Spotify connection, playback controls, settings pages, and notification displays using Jest/React Testing Library.
    *   **Backend:** Use Pytest for unit testing FastAPI endpoints (Spotify OAuth, user settings CRUD), Supabase client interactions, and the `AI Music Service` logic (mocking OpenAI/Spotify API calls).
*   **Integration Tests:**
    *   **Spotify Integration:** End-to-end integration tests for the Spotify OAuth flow, token storage/refresh, playback control, and BPM-matched mix generation (involving real Spotify API calls with test accounts).
    *   **Offline Data Sync:** Rigorous testing of the IndexedDB and Outbox Pattern, including scenarios for network loss, re-connection, and potential data conflicts during synchronization.
    *   **Settings Persistence:** Verify that changes made in the settings UI are correctly persisted to the `user_settings` table and reflected across sessions.
    *   **Reminder Delivery:** Integration tests for Celery tasks to ensure scheduled reminders are triggered and delivered to the frontend.
*   **API Tests:** Comprehensive API testing of all FastAPI endpoints related to Epic 3 using tools like Postman, ensuring correct request/response schemas, authentication, and authorization (RLS).
*   **End-to-End (E2E) Tests:** Use Playwright or Cypress for E2E scenarios covering:
    *   Connecting a Spotify account and verifying playback controls within the Workout Player.
    *   Modifying various user settings and verifying their persistence.
    *   Simulating offline conditions for workout logging and verifying successful data sync upon reconnection.
*   **Security Testing:** Focus on the security of Spotify token handling (encryption, secure transmission), RLS policies on `spotify_integrations` and `user_settings`, and potential vulnerabilities in OAuth callback handling.
*   **Performance Testing:** Conduct performance tests on Spotify API calls and offline data sync mechanisms to ensure responsiveness and efficient data handling.
*   **Edge Case Testing:** Scenarios including Spotify API rate limits, invalid Spotify credentials, network disconnections during OAuth, and unexpected data formats from Spotify APIs. Also, test for boundary conditions in user settings (e.g., very long text inputs, invalid selections).
