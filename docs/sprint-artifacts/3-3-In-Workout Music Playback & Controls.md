# Story 3.3: In-Workout Music Playback & Controls

Status: drafted

## Story

As a user,
I want to control music playback and receive visual feedback on BPM matching during my workout,
So that I can maintain focus and optimize my performance.

## Acceptance Criteria

1.  Given I have an active workout session and a generated Session Mix (Story 3.2)
2.  When I am in the Workout Player (Flow 9, with conceptual integration from Flow 11, Screen 3)
3.  Then music playback controls (play/pause, skip, volume) are available and functional
4.  And I can see visual feedback on BPM matching for the current workout phase (e.g., a gauge or text)
5.  And user interactions (skips, completions) are logged to refine future AI scoring

## Tasks / Subtasks

-   **Frontend (apps/web):**
    -   [ ] **UI Integration:** Integrate music playback controls (play/pause, skip, volume) into the Workout Player UI (Flow 9).
    -   [ ] **Visual Feedback:** Implement visual feedback on BPM matching for the current workout phase (e.g., a gauge or text) within the Workout Player.
    -   [ ] **Spotify SDK Integration:** Integrate Spotify Web Playback SDK or equivalent for in-app music controls.
    -   [ ] **API Integration:** Implement client-side API calls to the FastAPI backend to log user music interactions (skips, completions).
    -   **Testing:**
        -   [ ] Write unit tests for new UI components and Spotify SDK integration.
        -   [ ] Write integration tests for API calls and state management.
        -   [ ] Write Playwright E2E tests for in-workout music playback and controls.

-   **Backend (apps/api):**
    -   **API Endpoint:**
        -   [ ] Create `/music/feedback` endpoint to receive and log user music interactions (skips, completions).
        -   [ ] Implement backend logic to process `/music/play` and `/music/pause` commands if direct backend control is desired.
    -   [ ] **Music Interaction Logging:** Store logged user interactions in the database to refine future AI scoring (Playback Feedback Loop).
    -   **Testing:**
        -   [ ] Write unit tests for music interaction logging logic.
        -   [ ] Write integration tests for the new API endpoints and database interactions.

-   **Refinement:**
    -   [ ] Ensure all API communication adheres to the standard format `{"data": { ... }}` and `{"error": { ... }}`.
    -   [ ] Implement structured JSON logging for all new backend services.
    -   [ ] Verify consistency with naming conventions (kebab-case routes, PascalCase tables, snake_case columns).

## Dev Notes

**Relevant Architecture Patterns and Constraints:**
*   **Backend:** FastAPI for handling music interaction logging (`/music/feedback`) and potentially playback commands.
*   **Frontend:** Next.js `apps/web` for UI components within the Workout Player (Flow 9) to display controls and BPM feedback.
*   **Novel Architectural Pattern - AI-Driven Music Matching ("Smart Radio"):** Specifically, the "Playback Feedback Loop" component is critical, capturing in-workout user actions (skipping tracks) to refine the AI Music Scorer.
*   **Consistency Rules:** Adhere to defined naming conventions for API routes (`kebab-case`), database tables (`PascalCase`), and columns (`snake_case`).
*   **API Contracts:** OpenAPI standard, API versioning (`/api/v1/...`), Bearer token for authentication.
*   **Security:** Use Pydantic for validation, environment variables for secrets.
*   **Performance:** Leverage FastAPI's asynchronous nature.

**Source Tree Components to Touch:**
*   `apps/web/src/app` or `apps/web/src/components`: Integration within existing Workout Player UI.
*   `apps/web/src/lib`: Spotify SDK integration, client-side API calls for music interactions.
*   `apps/web/tests`: Frontend unit, integration, and E2E tests for music controls.
*   `apps/api/app/api`: New API endpoint `/music/feedback`.
*   `apps/api/app/services`: Logic for logging music interactions.
*   `apps/api/tests`: Backend unit and integration tests.

**Testing Standards Summary:**
*   **Frontend:** Unit tests (Jest/React Testing Library) for music control components, integration tests for Spotify SDK and API calls, E2E tests (Playwright) for in-workout music playback flow.
*   **Backend:** Unit tests for music interaction logging logic, integration tests for `/music/feedback` API endpoint.

### Project Structure Notes

**Project Structure Alignment:**
This story aligns with the established monorepo project structure, separating concerns between the `apps/web` (Next.js frontend) and `apps/api` (FastAPI backend). Frontend components for in-workout music playback controls and BPM feedback will be integrated into the existing Workout Player UI within `apps/web/src/app` or `apps/web/src/components`. Backend logic for logging music interactions will be implemented within `apps/api`.

**Lessons Learned from Previous Stories:**
No explicit lessons learned from previous stories are available as Story 3.2 ("AI-Driven Session Mix Generation") was recently drafted and is not yet implemented. Therefore, this story will proceed based on the architectural guidelines and design principles established in the `architecture.md` and `ux-design-direction.md` documents. The implementation should focus on establishing robust and reusable patterns that can inform future music-related features, especially concerning the "Playback Feedback Loop."

### References

*   `docs/architecture.md`
*   `docs/epics.md`
*   `docs/ux-design-direction.md`
*   `docs/validation-report-architecture.md`
*   `docs/sprint-artifacts/sprint-status.yaml`