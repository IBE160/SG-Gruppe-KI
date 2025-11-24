# Story 3.1: Spotify Account Connection

Status: ready-for-dev

## Story

As a User,
I want to securely connect my Spotify account,
so that the application can access my playback controls and listening history.

## Acceptance Criteria

1.  **Given** a user is in the settings or onboarding flow, **when** they click "Connect Spotify", **then** they are redirected to Spotify's OAuth (PKCE) consent screen.
2.  **And** upon successful authorization, their access and refresh tokens are securely stored in the `spotify_integrations` table.

## Tasks / Subtasks

- [ ] **Task 1: Frontend UI for Spotify Connection** (AC: #1)
  - [ ] Create a "Connect Spotify" button in the settings or onboarding flow.
  - [ ] Implement client-side logic to initiate the Spotify PKCE OAuth flow by redirecting to `GET /api/v1/spotify/connect`.
- [ ] **Task 2: Backend API for Spotify OAuth** (AC: #1, #2)
  - [ ] Create `GET /api/v1/spotify/connect` endpoint to initiate the Spotify PKCE OAuth flow. (Source: `tech-spec-epic-3.md#APIs-and-Interfaces`)
  - [ ] Create `GET /api/v1/spotify/callback` endpoint to handle the redirect from Spotify. (Source: `tech-spec-epic-3.md#APIs-and-Interfaces`)
  - [ ] Implement logic to exchange the authorization code for access and refresh tokens.
  - [ ] Securely encrypt and store the tokens in the `spotify_integrations` table. (Source: `tech-spec-epic-3.md#Data-Models-and-Contracts`)
- [ ] **Task 3: Data Model & Schema Verification** (AC: #2)
  - [ ] Verify the `spotify_integrations` table schema in Supabase (`id`, `user_id`, `spotify_user_id`, `access_token`, `refresh_token`, `expires_at`, `created_at`, `updated_at`). (Source: `tech-spec-epic-3.md#Data-Models-and-Contracts`)
  - [ ] Ensure RLS policies are applied to this table.
- [ ] **Task 4: Testing** (AC: #1, #2)
  - [ ] Add Pytest integration tests for the Spotify OAuth endpoints, mocking Spotify API calls.
  - [ ] Add Playwright E2E tests for the full Spotify connection flow, verifying redirection and token storage.

## Dev Notes

This story establishes the crucial integration with Spotify, enabling a wide range of music-related features in subsequent stories. Security and data privacy are paramount.

-   **Architecture**: This story involves both frontend and backend. The backend handles the sensitive OAuth flow and token storage, while the frontend initiates the process.
-   **Source Components**:
    -   **Backend**: `app/api/v1/spotify.py` (new module), `app/schemas/spotify.py` (new schemas).
    -   **Frontend**: New `Spotify Integration Module` components and logic.
-   **Testing**: Thorough testing of the OAuth flow, token security, and RLS is critical.

### Project Structure Notes

-   A new file `spotify.py` will be created in `backend/app/api/v1`.
-   New schemas will be created in `backend/app/schemas` for Spotify token handling.
-   New components for the Spotify Integration Module will be created in the frontend.

### Learnings from Previous Story

**From Story 2.8: Weekly Review Ritual (Status: ready-for-dev)**

-   **Architectural Foundation:** This story shifts focus from backend background processing to external API integration and authentication, but maintains the use of FastAPI and Supabase.
-   **Security Considerations:** Reinforces the need for secure handling of sensitive data (tokens).
-   **Testing Patterns:** Continues to emphasize robust backend integration testing and E2E testing for complex user flows.

### References

-   [Source: `docs/epics.md#Story-3.1:-Spotify-Account-Connection`]
-   [Source: `docs/sprint-artifacts/tech-spec-epic-3.md#APIs-and-Interfaces`]
-   [Source: `docs/sprint-artifacts/tech-spec-epic-3.md#Data-Models-and-Contracts`]
-   [Source: `docs/architecture.md#Spotify-Integration`]
-   [Source: `docs/architecture.md#Security-Architecture`]

## Dev Agent Record

### Context Reference

- `docs/sprint-artifacts/3-1-spotify-account-connection.context.xml`

### Agent Model Used

Gemini CLI

### Debug Log References

### Completion Notes List

### File List

## Change Log

- 2025-11-24: Initial draft created by Gemini CLI.
