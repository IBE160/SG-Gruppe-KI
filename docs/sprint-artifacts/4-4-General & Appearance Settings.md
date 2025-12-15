# Story 4.4: General & Appearance Settings

Status: ready-for-dev

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
    -   [x] **UI Implementation (Flow 18, Screen 2 - General Settings Page):** Create `apps/web/src/app/settings/general/page.tsx` with React components for language selection and notification preference toggles.
    -   [x] **UI Implementation (Flow 18, Screen 3 - Appearance Settings Page):** Create `apps/web/src/app/settings/appearance/page.tsx` with React components for theme selection (light/dark/system), accent color picker, and font size adjustment.
    -   [x] **State Management (Zustand - Settings Store):** Create `apps/web/src/store/settingsStore.ts` to manage and persist theme, language, font size, and notification preferences. This store should utilize Zustand's `persist` middleware.
    -   [x] **Persistence (Client-side):** Implement logic within `settingsStore.ts` to persist user preferences to `localStorage`.
    -   [x] **Dynamic Styling:** Implement logic to dynamically apply selected theme, accent color, and font size changes across the application.
    -   [x] **Live Preview:** Implement logic to immediately reflect appearance changes in a live preview within the `apps/web/src/app/settings/appearance/page.tsx`.
    -   [x] **Internationalization (i18n) Setup:** Integrate a suitable i18n library (e.g., `react-i18next` or Next.js's built-in i18n) if not already present, and set up basic language switching functionality.
    -   **Testing:**
        *   [x] Write unit tests for new React components in `apps/web/src/app/settings/general/page.tsx` and `apps/web/src/app/settings/appearance/page.tsx`.
        *   [x] Write unit tests for `apps/web/src/store/settingsStore.ts` and its persistence logic.
        *   [x] Write integration tests for persistence mechanisms using mocked `localStorage`.
        *   [x] Write Playwright E2E tests for customizing general and appearance settings, including verifying live preview.

-   **Refinement:**
    -   [x] Ensure UI adheres to `ux_design_content` principles (e.g., visual consistency, intuitive controls).
    -   [x] Implement structured JSON logging for relevant frontend actions (e.g., settings changes).
    -   [x] Verify consistency with naming conventions for components and functions.

## Dev Notes

**Relevant Architecture Patterns and Constraints:**
*   **Frontend:** Next.js `apps/web` for UI components (Flow 18, Screen 2 & 3) and client-side logic.
*   **Project Structure:** Monorepo (`apps/web` for frontend).
*   **State Management:** Zustand for client-side state management for theme, language, and font preferences.
*   **Data Persistence:** Prioritize `localStorage` for frontend-centric settings like theme, language, and font size.
*   **Consistency Rules:** Adhere to defined naming conventions for React Components.

**Source Tree Components to Touch:**
*   `apps/web/src/app/settings/general/page.tsx`: New page for General settings.
*   `apps/web/src/app/settings/appearance/page.tsx`: New page for Appearance settings.
*   `apps/web/src/store/settingsStore.ts`: New Zustand store for managing settings.
*   `apps/web/src/lib/i18n.ts` (or similar): New file for i18n configuration if needed.
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

## Dev Agent Record

### Context Reference
- docs/sprint-artifacts/4-4-General & Appearance Settings.context.xml