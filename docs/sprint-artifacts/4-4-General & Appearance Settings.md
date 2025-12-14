# Story 4.4: General & Appearance Settings

Status: drafted

## Story

As a user,
I want to customize general application preferences like language and appearance (theme, accent color, font size),
So that I can personalize my app experience.

## Acceptance Criteria

1.  Given I am in the "General" settings sub-screen (Flow 18, Screen 2 - `genreralsettings/code.html`)
2.  When I select a different language or toggle notification preferences
3.  Then the changes are applied to the app
4.  Given I am in the "Appearance" settings sub-screen (Flow 18, Screen 3 - `apperance/code.html`)
5.  When I select a theme (light/dark/system), accent color, or adjust font size
6.  Then these changes are immediately reflected in a live preview and applied to the app's UI

## Tasks / Subtasks

-   **Frontend (apps/web):**
    -   [ ] **UI Implementation (Flow 18, Screen 2):** Create React components for the "General" settings sub-screen, including language selection and notification preference toggles.
    -   [ ] **UI Implementation (Flow 18, Screen 3):** Create React components for the "Appearance" settings sub-screen, including theme selection (light/dark/system), accent color picker, and font size adjustment.
    -   [ ] **State Management (Zustand):** Implement Zustand stores to manage and persist theme, language, font size, and notification preferences.
    -   [ ] **Persistence:** Integrate with local storage or Supabase `Users` table to persist user preferences across sessions.
    -   [ ] **Live Preview:** Implement logic to immediately reflect appearance changes in a live preview within the app.
    -   **Testing:**
        *   [ ] Write unit tests for new React components and Zustand stores.
        *   [ ] Write integration tests for persistence mechanisms (local storage/Supabase).
        *   [ ] Write Playwright E2E tests for customizing general and appearance settings.

-   **Refinement:**
    -   [ ] Ensure UI adheres to `ux_design_content` principles (e.g., visual consistency, intuitive controls).
    -   [ ] Implement structured JSON logging for relevant frontend actions (e.g., settings changes).
    -   [ ] Verify consistency with naming conventions for components and functions.

## Dev Notes

**Relevant Architecture Patterns and Constraints:**
*   **Frontend:** Next.js `apps/web` for UI components (Flow 18, Screen 2 & 3) and client-side logic.
*   **Project Structure:** Monorepo (`apps/web` for frontend).
*   **State Management:** Zustand for client-side state management for theme, language, and font preferences.
*   **Data Persistence:** Persist these settings in the `Users` table (Supabase) or local storage.
*   **Consistency Rules:** Adhere to defined naming conventions for React Components.

**Source Tree Components to Touch:**
*   `apps/web/src/app` or `apps/web/src/components`: New React components for general and appearance settings.
*   `apps/web/src/lib`: Zustand store definitions, persistence logic.
*   `apps/web/tests`: Frontend unit, integration, and E2E tests for general/appearance settings.

**Testing Standards Summary:**
*   **Frontend:** Unit tests for components, Zustand stores; integration tests for persistence; E2E tests for customization flows.

### Project Structure Notes

**Project Structure Alignment:**
This story aligns with the `apps/web` (Next.js frontend) portion of the established monorepo project structure. Frontend components for general and appearance settings will reside within `apps/web/src/app` or `apps/web/src/components`. State management will be handled using Zustand for client-side preferences, with persistence to either local storage or the Supabase `Users` table.

**Lessons Learned from Previous Stories:**
No explicit lessons learned from previous stories are available as Story 4.3 ("Privacy & Account Management") was recently drafted and is not yet implemented. Therefore, this story will proceed based on the architectural guidelines and design principles established in the `architecture.md` and `ux-design-direction.md` documents. The implementation should focus on creating a flexible and performant system for user preference management.

### References

*   `docs/architecture.md`
*   `docs/epics.md`
*   `docs/ux-design-direction.md`
*   `docs/validation-report-architecture.md`
*   `docs/sprint-artifacts/sprint-status.yaml`