# Story 3.2: AI-Driven Session Mix Generation

Status: ready-for-dev

## Story

As a user with a connected Spotify account,
I want the AI to generate personalized, phase-aligned workout playlists ("Session Mix"),
So that my music enhances my training experience.

## Acceptance Criteria

1.  Given I have a connected Spotify account (Story 3.1) and an active workout plan
2.  When I initiate "Generate Session Mix" (Flow 11, Screen 1 - `screen_1/code.html`)
3.  Then I can select the mix type (e.g., Warm-up only, Full Session)
4.  And the AI Music Scorer (backend) generates a playlist based on BPM, audio features, listening history, and user feedback
5.  And I am presented with a "Session Mix Preview & Customization" screen (Flow 11, Screen 2 - `screen_2/code.html`)
6.  And I can seed the mix with artists/genres, and review/customize individual tracks
7.  And a custom playlist is created in my Spotify account (private or public)

## Tasks / Subtasks

-   **Frontend (apps/web):**
    -   [ ] **UI Implementation (Flow 11, Screen 1):** Create React components for "Generate Session Mix" initiation, including mix type selection. Refer to `ux_design_content` Flow 11, Screen 1 `code.html`.
    -   [ ] **UI Implementation (Flow 11, Screen 2):** Create React components for "Session Mix Preview & Customization," including tracklist display, seed input for artists/genres, and track review/customization. Refer to `ux_design_content` Flow 11, Screen 2 `code.html`.
    -   [ ] **API Integration:** Implement client-side API calls to the FastAPI backend for generating the session mix and handling user customizations.
    -   [ ] **State Management:** Use Zustand to manage frontend state for mix generation, preview, and customization.
    -   **Testing:**
        -   [ ] Write unit tests for new React components.
        -   [ ] Write integration tests for API calls and state management.
        -   [ ] Write Playwright E2E tests for the entire Flow 11 user journey.

-   **Backend (apps/api):**
    -   **API Endpoints:**
        -   [ ] Create `/music/generate-session-mix` endpoint to handle session mix generation requests.
        -   [ ] Create endpoints for Spotify API interactions: `/music/recently-played`, `/music/audio-features`, `/music/create-playlist`.
    -   [ ] **AI Music Scorer Logic:** Implement the core AI Music Scorer logic to:
        -   Fetch user's Spotify listening history and preferences.
        *   Analyze audio features of potential tracks.
        *   Generate a playlist based on BPM, workout phase, and user feedback.
    -   [ ] **Spotify API Integration:** Implement secure interactions with the Spotify API (using stored tokens from Story 3.1).
    -   [ ] **Data Persistence:** Define and implement the `MusicPreferences` model (and potentially `MasterLists`) using Supabase/Prisma.
    -   **Testing:**
        -   [ ] Write unit tests for AI Music Scorer logic and Spotify API integration.
        -   [ ] Write integration tests for API endpoints and database interactions.

-   **Data Model:**
    -   [ ] Define `MusicPreferences` table structure in Supabase (or extend existing `Users` table with preferences).
    -   [ ] Consider schema for `MasterLists` if implemented in the database.

-   **Documentation:**
    -   [ ] Update API documentation with new endpoints.
    -   [ ] Add comments to complex AI Music Scorer logic.

-   **Refinement:**
    -   [ ] Ensure all API communication adheres to the standard format `{"data": { ... }}` and `{"error": { ... }}`.
    -   [ ] Implement structured JSON logging for all new backend services.
    -   [ ] Verify consistency with naming conventions (kebab-case routes, PascalCase tables, snake_case columns).

## Dev Notes

**Relevant Architecture Patterns and Constraints:**
*   **Backend:** FastAPI for AI Music Scorer logic and Spotify API interactions.
*   **Frontend:** Next.js `apps/web` for UI components (Flow 11, Screen 1 & 2) and API calls.
*   **Data Persistence:** Supabase (PostgreSQL) for `MusicPreferences` table and potentially Master Lists for music.
*   **Project Structure:** Monorepo (`apps/web`, `apps/api`).
*   **Novel Architectural Pattern - AI-Driven Music Matching ("Smart Radio"):**
    *   **Purpose:** Create a "Smart Radio" experience with personalized, phase-aware workout playlists.
    *   **Components:** Music Source (Spotify API), Master Lists (Database), AI Music Scorer (Backend), Session Playlist Generator (Backend), Pre-Workout Review UI (Frontend), Playback Feedback Loop (Frontend/Backend).
    *   **Data Flow:** AI Music Scorer seeds Master Lists -> Session Playlist Generator builds Session Playlist -> Preview UI -> Feedback Loop (skips, manual deletes).
*   **Consistency Rules:** Adhere to defined naming conventions for API routes (`kebab-case`), database tables (`PascalCase`), and columns (`snake_case`). Co-locate test files.
*   **API Contracts:** OpenAPI standard, API versioning (`/api/v1/...`), Bearer token for authentication.
*   **Security:** Use Pydantic for validation, environment variables for secrets.
*   **Performance:** Leverage FastAPI's asynchronous nature, consider database indexing.

**Source Tree Components to Touch:**
*   `apps/web/src/app` or `apps/web/src/components`: New React components for Flow 11 UI.
*   `apps/web/src/lib`: Client-side API integration logic, Zustand stores.
*   `apps/web/tests`: Frontend unit, integration, and E2E tests.
*   `apps/api/app/api`: New API endpoints for music generation.
*   `apps/api/app/services`: AI Music Scorer logic, Spotify API integration.
*   `apps/api/app/models.py`: Pydantic models for request/response.
*   `apps/api/tests`: Backend unit and integration tests.
*   Supabase schema: `MusicPreferences` table definition.

**Testing Standards Summary:**
*   **Frontend:** Unit tests (Jest/React Testing Library) for components and hooks, integration tests for API interactions and state, E2E tests (Playwright) for critical user flows (Flow 11).
*   **Backend:** Unit tests for individual functions (AI Music Scorer, Spotify integrations), integration tests for API endpoints and database interactions.

### Project Structure Notes

**Project Structure Alignment:**
This story aligns with the established monorepo project structure, separating concerns between the `apps/web` (Next.js frontend) and `apps/api` (FastAPI backend). Frontend components for Flow 11 will reside in `apps/web/src/app` or `apps/web/src/components`. Backend logic for the AI Music Scorer, Spotify API interactions, and Session Playlist generation will be implemented within `apps/api`. Data models and database interactions for `MusicPreferences` will be handled through the Supabase/Prisma layer within `apps/api`.

**Lessons Learned from Previous Stories:**
No explicit lessons learned from previous stories are available as Story 3.1 ("Spotify Integration & OAuth") is currently pending. Therefore, this story will proceed based on the architectural guidelines and design principles established in the `architecture.md` and `ux-design-direction.md` documents. The implementation should focus on establishing robust and reusable patterns that can inform future music-related features.

### References

*   `docs/architecture.md`
*   `docs/epics.md`
*   `docs/ux-design-direction.md`
*   `docs/validation-report-architecture.md`
*   `docs/sprint-artifacts/sprint-status.yaml`

## Dev Agent Record

### Context Reference
- docs/sprint-artifacts/3-2-AI-Driven Session Mix Generation.context.xml