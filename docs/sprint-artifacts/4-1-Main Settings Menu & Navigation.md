# Story 4.1: Main Settings Menu & Navigation

Status: ready-for-dev

## Story

As a user,
I want to access a comprehensive settings menu with categorized options and a search function,
So that I can easily find and manage my app preferences.

## Acceptance Criteria

1.  Given I am a logged-in user
2.  When I navigate to the main Settings menu (Flow 18, Screen 1 - `general/code.html`)
3.  Then I am presented with categorized settings options (e.g., General, Appearance, Performance & Data, Privacy & Account)
4.  And I can use a search bar to quickly find specific settings
5.  And tapping on a category navigates me to its respective sub-screen

## Tasks / Subtasks

-   **Frontend (apps/web):**
    -   [x] **UI Implementation (Flow 18, Screen 1):** Create React components for the main settings menu. This includes:
        *   Displaying categorized settings options (e.g., General, Appearance, Performance & Data, Privacy & Account).
        *   Implementing navigation to respective sub-screens upon category tap.
    -   [x] **Search Functionality:** Implement a client-side search bar to filter settings options.
    -   [x] **API Integration:** Ensure proper authentication (Prerequisite: Story 1.2) for accessing settings.
    -   **Testing:**
        -   [ ] Write unit tests for new React components.
        -   [ ] Write integration tests for navigation logic and search functionality.
        -   [ ] Write Playwright E2E tests for navigating to and within the settings menu.

-   **Refinement:**
    -   [x] Ensure UI adheres to `ux_design_content` principles (e.g., visual consistency, clear navigation).
    -   [x] Implement structured JSON logging for relevant frontend actions (e.g., settings changes).
    -   [x] Verify consistency with naming conventions for components and files.

## Dev Notes

**Relevant Architecture Patterns and Constraints:**
*   **Frontend:** Next.js `apps/web` for UI components and client-side logic.
*   **Project Structure:** Monorepo (`apps/web` for frontend).
*   **Consistency Rules:** Adhere to defined naming conventions for React Components (`PascalCase`).
*   **UX Design Direction (from ux-design-direction.md):**
    *   **Flow 18: Change Settings (General, Health, Playback & Privacy):** Specifically, the main settings menu is detailed in Flow 18, Screen 1 - `general/code.html`. Key UX improvements include contextual help, search functionality, and preview for appearance settings.
    *   **Overarching UX Principles:** Intuitive efficiency, transparent & trustworthy, accessible & robust.

**Source Tree Components to Touch:**
*   `apps/web/src/app` or `apps/web/src/components`: New React components for the main settings menu and navigation.
*   `apps/web/src/lib`: Client-side search logic, any shared UI utilities.
*   `apps/web/tests`: Frontend unit, integration, and E2E tests for settings.

**Testing Standards Summary:**
*   **Frontend:** Unit tests (Jest/React Testing Library) for settings components, integration tests for navigation and search, E2E tests (Playwright) for the settings menu flow.

### Project Structure Notes

**Project Structure Alignment:**
This story aligns with the `apps/web` (Next.js frontend) portion of the established monorepo project structure. The main settings menu and navigation components will reside within `apps/web/src/app` or `apps/web/src/components`. This foundational work will ensure a consistent and navigable settings interface for all future settings-related features.

**Lessons Learned from Previous Stories:**
No explicit lessons learned from previous stories are available as Story 3.3 ("In-Workout Music Playback & Controls") was recently drafted and is not yet implemented. Therefore, this story will proceed based on the architectural guidelines and design principles established in the `architecture.md` and `ux-design-direction.md` documents. The implementation should prioritize creating a robust and extensible navigation structure for the settings module.

### References

*   `docs/architecture.md`
*   `docs/epics.md`
*   `docs/ux-design-direction.md`
*   `docs/validation-report-architecture.md`
*   `docs/sprint-artifacts/sprint-status.yaml`

## Dev Agent Record

### Context Reference
- docs/sprint-artifacts/4-1-Main Settings Menu & Navigation.context.xml