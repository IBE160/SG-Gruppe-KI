# Story 4.5: AI & Personalization Settings

Status: ready-for-dev

## Story

As a user,
I want to understand and manage how the AI learns from my interactions, including viewing and resetting learned preferences and constraints,
So that I can have transparent control over my personalized experience.

## Acceptance Criteria

1.  Given I am in the "AI & Personalization" settings sub-screen (Flow 18, Screen 4 - `ai/code.html`)
2.  When I view "Learned Preferences" and "Learned Constraints"
3.  Then I can see a list of rules the AI has developed based on my feedback
4.  When I tap `[ Edit ]` or `[ Delete ]` on a specific preference/constraint
5.  Then I can modify or remove that learning rule
6.  When I tap `[ Reset All AI Learning ]`
7.  Then a confirmation modal appears, and upon confirmation, all learned AI preferences and constraints are cleared

## Tasks / Subtasks

-   **Frontend (apps/web):**
    -   [ ] **UI Implementation (Flow 18, Screen 4):** Create React components for the "AI & Personalization" settings sub-screen. This includes:
        *   Displaying "Learned Preferences" and "Learned Constraints" lists.
        *   Implementing "Edit" and "Delete" functionality for individual preferences/constraints.
        *   Implementing a "Reset All AI Learning" button with a confirmation modal.
    -   [ ] **API Integration:** Implement client-side API calls to the FastAPI backend for viewing, editing, deleting, and resetting AI learned preferences.
    -   **Testing:**
        *   [ ] Write unit tests for new React components and interaction logic.
        *   [ ] Write integration tests for API calls.
        *   [ ] Write Playwright E2E tests for viewing, editing, deleting, and resetting AI preferences.

-   **Backend (apps/api):**
    -   [ ] **API Endpoints:**
        *   Create API endpoints to store, retrieve, edit, delete, and reset AI learned preferences (e.g., `/user-preferences/ai`).
    -   [ ] **Data Persistence:** Implement logic to store, retrieve, and manage AI learned preferences in Supabase (e.g., in a `UserPreferences` table or as part of the `Users` table metadata).
    -   [ ] **Robust Handling:** Ensure robust handling of deleting AI memory and resetting preferences.
    -   **Testing:**
        *   [ ] Write unit tests for AI preference management logic.
        *   [ ] Write integration tests for the new API endpoints and Supabase interactions.

-   **Refinement:**
    -   [ ] Ensure all API communication adheres to the standard format `{"data": { ... }}` and `{"error": { ... }}`.
    -   [ ] Implement structured JSON logging for all relevant backend actions related to AI personalization settings.
    -   [ ] Verify consistency with naming conventions for components, functions, and API routes.

## Dev Notes

**Relevant Architecture Patterns and Constraints:**
*   **Frontend:** Next.js `apps/web` for UI components (Flow 18, Screen 4) to display and manage AI preferences.
*   **Backend:** FastAPI `apps/api` for API endpoints to store, retrieve, edit, and reset AI learned preferences (e.g., in a `UserPreferences` table or `Users` metadata column).
*   **Data Persistence:** Supabase (PostgreSQL) for storing `UserPreferences` or similar data structures.
*   **Project Structure:** Monorepo (`apps/web` for frontend, `apps/api` for backend).
*   **Consistency Rules:** Adhere to defined naming conventions and structured logging.

**Source Tree Components to Touch:**
*   `apps/web/src/app` or `apps/web/src/components`: New React components for "AI & Personalization" settings.
*   `apps/web/src/lib`: Client-side API integration for AI preference management.
*   `apps/web/tests`: Frontend unit, integration, and E2E tests for AI settings.
*   `apps/api/app/api`: New API endpoints for AI preference management.
*   `apps/api/app/services`: Logic for AI preference management and Supabase integration.
*   `apps/api/tests`: Backend unit and integration tests.

**Testing Standards Summary:**
*   **Frontend:** Unit tests for components and interaction logic; integration tests for API calls; E2E tests for viewing, editing, deleting, and resetting AI preferences.
*   **Backend:** Unit tests for AI preference management logic; integration tests for API endpoints and Supabase interactions.

### Project Structure Notes

**Project Structure Alignment:**
This story aligns with the monorepo structure, impacting both the `apps/web` (Next.js frontend) for UI components (Flow 18, Screen 4) to display and manage AI preferences, and the `apps/api` (FastAPI backend) for providing API endpoints to store, retrieve, edit, and reset AI learned preferences. Data persistence will involve Supabase (PostgreSQL) to store `UserPreferences` or similar data structures.

**Lessons Learned from Previous Stories:**
No explicit lessons learned from previous stories are available as Story 4.4 ("General & Appearance Settings") was recently drafted and is not yet implemented. Therefore, this story will proceed based on the architectural guidelines and design principles established in the `architecture.md` and `ux-design-direction.md` documents. The implementation should prioritize clear API contracts for managing AI preferences and robust data handling to ensure user control and transparency.

### References

*   `docs/architecture.md`
*   `docs/epics.md`
*   `docs/ux-design-direction.md`
*   `docs/validation-report-architecture.md`
*   `docs/sprint-artifacts/sprint-status.yaml`

## Dev Agent Record

### Context Reference
- docs/sprint-artifacts/4-5-AI & Personalization Settings.context.xml

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List