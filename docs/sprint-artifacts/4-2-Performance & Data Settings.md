# Story 4.2: Performance & Data Settings

Status: drafted

## Story

As a user,
I want to manage offline mode and data synchronization settings,
So that I can control my app's behavior in various network conditions and manage local data.

## Acceptance Criteria

1.  Given I am in the "Performance & Data" settings sub-screen (Flow 17, Screen 1 - `screen_1/code.html`)
2.  When I toggle "Offline Mode"
3.  Then the app switches between online and offline functionality, caching daily plans and logs locally
4.  When I toggle "Auto-Sync Offline Data"
5.  Then offline logs are automatically synced upon reconnection or require manual initiation
6.  When I tap `[ Clear Local Cache ]`
7.  Then a confirmation modal appears, and upon confirmation, local cached data is removed
8.  And an offline status indicator is displayed in the main app UI when offline (Flow 17, Screen 2 - `screen_2/code.html`)
9.  And a "Sync Now" button/prompt appears when connection is restored and unsynced data exists (Flow 17, Screen 2 & 3 - `screen_2/code.html` & `screen_3/code.html`)

## Tasks / Subtasks

-   **Frontend (apps/web):**
    -   [ ] **UI Implementation (Flow 17, Screen 1-4):** Create React components for the "Performance & Data" settings sub-screen. This includes toggles for "Offline Mode" and "Auto-Sync Offline Data," a button for "Clear Local Cache," and the display of offline status indicators and "Sync Now" prompts.
    -   [ ] **Offline Mode Logic:** Implement client-side logic for enabling/disabling offline mode, caching daily plans and workout logs using IndexedDB or similar.
    -   [ ] **Synchronization Logic:** Develop logic for detecting network connectivity changes and automatically/manually syncing offline data to the backend `/logs` endpoint.
    -   [ ] **Local Cache Management:** Implement functionality for clearing the local cache with user confirmation.
    -   [ ] **API Integration:** Ensure robust API calls to the FastAPI backend for data synchronization (e.g., `/logs` endpoint from Story 2.4).
    -   **Testing:**
        *   [ ] Write unit tests for new React components, offline logic, and synchronization logic.
        *   [ ] Write integration tests for local storage interactions and API calls.
        *   [ ] Write Playwright E2E tests for toggling offline mode, syncing data, and clearing cache.

-   **Backend (apps/api):**
    -   [ ] **API Endpoint Enhancement:** Ensure the `/logs` endpoint (from Story 2.4) can handle incremental data synchronization from offline mode, including conflict resolution if necessary.
    -   **Testing:**
        *   [ ] Write integration tests for the `/logs` endpoint handling offline data synchronization.

-   **Refinement:**
    -   [ ] Ensure UI adheres to `ux_design_content` principles (e.g., clear status indicators, confirmation modals).
    -   [ ] Implement structured JSON logging for all relevant frontend and backend actions related to offline mode and data synchronization.
    -   [ ] Verify consistency with naming conventions for components, functions, and API routes.

## Dev Notes

**Relevant Architecture Patterns and Constraints:**
*   **Frontend:** Next.js `apps/web` for UI components (Flow 17, Screen 1-4) and client-side logic for offline caching (IndexedDB or similar) and network detection.
*   **Backend:** FastAPI `apps/api` for the `/logs` endpoint, used for data synchronization.
*   **Project Structure:** Monorepo (`apps/web` for frontend, `apps/api` for backend).
*   **Consistency Rules:** Adhere to defined naming conventions and structured logging.
*   **UX Design Direction (from ux-design-direction.md):**
    *   **Flow 17: Toggle Offline Mode & Resume Sync:** Guides the implementation of offline functionality, clear status indicators, and sync mechanisms.
    *   **Overarching UX Principles:** Intuitive efficiency, accessible & robust (especially for offline functionality).

**Source Tree Components to Touch:**
*   `apps/web/src/app` or `apps/web/src/components`: New React components for "Performance & Data" settings.
*   `apps/web/src/lib`: Client-side caching logic, network detection, synchronization logic.
*   `apps/web/tests`: Frontend unit, integration, and E2E tests for offline mode and sync.
*   `apps/api/app/api`: Enhancement to `/logs` endpoint.
*   `apps/api/tests`: Backend integration tests for `/logs` endpoint.

**Testing Standards Summary:**
*   **Frontend:** Unit tests for components, offline logic, and sync; integration tests for local storage and API calls; E2E tests for full offline/sync user flows.
*   **Backend:** Integration tests for the `/logs` endpoint with offline data.

### Project Structure Notes

**Project Structure Alignment:**
This story aligns with the monorepo structure, primarily impacting the `apps/web` (Next.js frontend) for UI and client-side logic related to offline mode, caching, and synchronization indicators. The `apps/api` (FastAPI backend) will be involved in handling the `/logs` endpoint for data synchronization. This will require careful coordination between frontend and backend to ensure seamless offline functionality and data consistency.

**Lessons Learned from Previous Stories:**
No explicit lessons learned from previous stories are available as Story 4.1 ("Main Settings Menu & Navigation") was recently drafted and is not yet implemented. Therefore, this story will proceed based on the architectural guidelines and design principles established in the `architecture.md` and `ux-design-direction.md` documents. Emphasis should be placed on robust error handling for network interruptions and data conflict resolution during synchronization.

### References

*   `docs/architecture.md`
*   `docs/epics.md`
*   `docs/ux-design-direction.md`
*   `docs/validation-report-architecture.md`
*   `docs/sprint-artifacts/sprint-status.yaml`