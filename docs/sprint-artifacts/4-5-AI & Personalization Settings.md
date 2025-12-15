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
    -   [x] **UI Implementation (Flow 18, Screen 4):** Create `apps/web/src/app/settings/ai-personalization/page.tsx` with React components for the "AI & Personalization" settings sub-screen. This includes:
        *   Displaying "Learned Preferences" and "Learned Constraints" lists.
        *   Implementing "Edit" and "Delete" functionality for individual preferences/constraints.
        *   Implementing a "Reset All AI Learning" button with a confirmation modal.
    -   [x] **API Integration:** Implement client-side API calls to the FastAPI backend for viewing, editing, deleting, and resetting AI learned preferences.
    -   **Testing:**
        *   [x] Write unit tests for new React components and interaction logic.
        *   [x] Write integration tests for API calls.
        *   [x] Write Playwright E2E tests for viewing, editing, deleting, and resetting AI preferences.

-   **Backend (apps/api):**
    -   [x] **API Endpoints:**
        *   Create `apps/api/app/api/ai_preferences.py` with API endpoints to store, retrieve, edit, delete, and reset AI learned preferences (e.g., `POST /ai-preferences`, `GET /ai-preferences`, `PUT /ai-preferences/{id}`, `DELETE /ai-preferences/{id}`, `POST /ai-preferences/reset`).
    -   [x] **Service Logic:** Implement `apps/api/app/services/ai_preference_service.py` to handle the business logic for AI preference management.
    -   [x] **Data Model (Pydantic):** Define Pydantic models in `apps/api/app/models/ai_preference.py` for representing AI preferences.
    -   [x] **Data Persistence:** Implement logic to store, retrieve, and manage AI learned preferences in Supabase (e.g., in a new `AIPreferences` table).
    -   [x] **Robust Handling:** Ensure robust handling of deleting AI memory and resetting preferences.
    -   **Testing:**
        *   [x] Write unit tests for AI preference management logic in `apps/api/app/services/ai_preference_service.py`.
        *   [x] Write integration tests for the new API endpoints (`apps/api/app/api/ai_preferences.py`) and Supabase interactions.

-   **Refinement:**
    -   [x] Ensure all API communication adheres to the standard format `{"data": { ... }}` and `{"error": { ... }}`.
    -   [x] Implement structured JSON logging for all relevant backend actions related to AI personalization settings.
    -   [x] Verify consistency with naming conventions for components, functions, and API routes.

## Dev Notes

**Relevant Architecture Patterns and Constraints:**
*   **Frontend:** Next.js `apps/web` for UI components (`apps/web/src/app/settings/ai-personalization/page.tsx`) to display and manage AI preferences.
*   **Backend:** FastAPI `apps/api` for API endpoints (`apps/api/app/api/ai_preferences.py`) to store, retrieve, edit, and reset AI learned preferences.
*   **Data Persistence:** Supabase (PostgreSQL) for storing `AIPreferences` table.
*   **Project Structure:** Monorepo (`apps/web` for frontend, `apps/api` for backend).
*   **Consistency Rules:** Adhere to defined naming conventions and structured logging.

**Source Tree Components to Touch:**
*   `apps/web/src/app/settings/ai-personalization/page.tsx`: New page for AI & Personalization settings.
*   `apps/web/src/lib/api/aiPreferencesApi.ts` (or similar): New client-side API integration for AI preference management.
*   `apps/web/tests`: Frontend unit, integration, and E2E tests for AI settings.
*   `apps/api/app/api/ai_preferences.py`: New API endpoints for AI preference management.
*   `apps/api/app/services/ai_preference_service.py`: New service for AI preference management.
*   `apps/api/app/models/ai_preference.py`: New Pydantic models for AI preferences.
*   `apps/api/tests`: Backend unit and integration tests.

### Project Structure Notes

**Project Structure Alignment:**
This story aligns with the monorepo structure, impacting both the `apps/web` (Next.js frontend) for UI components (`apps/web/src/app/settings/ai-personalization/page.tsx`) to display and manage AI preferences, and the `apps/api` (FastAPI backend) for providing API endpoints to store, retrieve, edit, and reset AI learned preferences. Data persistence will involve Supabase (PostgreSQL) to store a new `AIPreferences` table.

**Data Model Suggestion (AIPreferences Table in Supabase):**
*   `id` (uuid, PK): Primary key.
*   `user_id` (uuid, FK to `Users.id`): Foreign key linking to the user.
*   `type` (varchar): 'preference' or 'constraint'.
*   `key` (varchar): A unique identifier for the preference/constraint (e.g., 'exercise_avoidance', 'preferred_intensity').
*   `value` (jsonb): JSON object storing the details of the preference/constraint (e.g., `{"exercise": "burpees"}`, `{"level": "high"}`).
*   `created_at` (timestamp with time zone): Timestamp of creation.
*   `updated_at` (timestamp with time zone): Timestamp of last update.

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