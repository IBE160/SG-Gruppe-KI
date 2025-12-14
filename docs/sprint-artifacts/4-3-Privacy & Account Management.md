# Story 4.3: Privacy & Account Management

Status: ready-for-dev

## Story

As a user,
I want full control over my privacy settings, including data export and account deletion,
So that I can manage my personal information in compliance with GDPR.

## Acceptance Criteria

1.  Given I am in the "Privacy & Account" settings sub-screen (Flow 18, Screen 5 - `privacy/code.html`)
2.  When I tap `[ Export My Data ]`
3.  Then I am taken to the "Export Data Information & Request" screen (Flow 15, Screen 1 - `screen_1/code.html`)
4.  And I can request a GDPR-compliant export of my data, receiving confirmation and a timeline for delivery (Flow 15, Screen 2 - `screen_2/code.html`)
5.  When I tap `[ Delete My Account ]`
6.  Then I am presented with warnings and required to confirm deletion with explicit user input (Flow 16, Screen 1 & 2 - `screen_1/code.html` & `screen_2/code.html`)
7.  And upon confirmation, my account and all associated data are permanently removed as per GDPR (Flow 16, Screen 3 & 4 - `screen_3/code.html` & `screen_4/code.html`)
8.  When I tap `[ Logout ]`
9.  Then I am securely logged out of the application

## Tasks / Subtasks

-   **Frontend (apps/web):**
    -   [ ] **UI Implementation (Flow 18, Screen 5):** Create React components for the "Privacy & Account" settings sub-screen, including buttons for "Export My Data," "Delete My Account," and "Logout."
    -   [ ] **UI Implementation (Flow 15, Screen 1-2):** Create React components for the "Export Data Information & Request" flow, including confirmation and timeline display.
    -   [ ] **UI Implementation (Flow 16, Screen 1-4):** Create React components for the "Delete My Account" flow, including warnings, explicit user input confirmation, and post-deletion screens.
    -   [ ] **API Integration:** Implement client-side API calls to the FastAPI backend for data export (`/export`), account deletion (`/auth/user`), and logout (Supabase Auth integration).
    -   **Testing:**
        *   [ ] Write unit tests for new React components and confirmation flows.
        *   [ ] Write integration tests for API calls and Supabase Auth interactions.
        *   [ ] Write Playwright E2E tests for data export, account deletion, and logout user journeys.

-   **Backend (apps/api):**
    -   [ ] **API Endpoints:**
        *   Implement `/export` endpoint for GDPR-compliant data export, fetching user data from Supabase.
        *   Implement `/auth/user` endpoint for account deletion, ensuring all associated data is removed from Supabase and tokens are invalidated.
    *   [ ] **Supabase Integration:** Ensure secure integration with Supabase for data operations (export, deletion) and authentication (logout).
    -   [ ] **GDPR Compliance:** Implement logic to ensure data export and deletion adhere to GDPR requirements (`NFR002`, `NFR010`).
    -   **Testing:**
        *   [ ] Write unit tests for data export and account deletion logic.
        *   [ ] Write integration tests for the new API endpoints and Supabase interactions.

-   **Refinement:**
    -   [ ] Ensure all API communication adheres to the standard format `{"data": { ... }}` and `{"error": { ... }}`.
    -   [ ] Implement structured JSON logging for all relevant backend actions related to privacy and account management.
    -   [ ] Verify consistency with naming conventions for components, functions, and API routes.

## Dev Notes

**Relevant Architecture Patterns and Constraints:**
*   **Frontend:** Next.js `apps/web` for UI components (Flow 15, Flow 16, Flow 18, Screen 5) and client-side logic for confirmation flows.
*   **Backend:** FastAPI `apps/api` for API endpoints: `/export` (data export) and `/auth/user` (account deletion).
*   **Data Persistence:** Supabase (PostgreSQL) for user data management, including data deletion and token invalidation.
*   **Authentication:** Supabase Auth for logout and account deletion processes.
*   **Security Architecture:** Emphasis on GDPR compliance (`NFR002`, `NFR010`), secure handling of user data, and Pydantic validation for API endpoints.
*   **Project Structure:** Monorepo (`apps/web` for frontend, `apps/api` for backend).
*   **Consistency Rules:** Adhere to defined naming conventions and structured logging.

**Source Tree Components to Touch:**
*   `apps/web/src/app` or `apps/web/src/components`: New React components for "Privacy & Account" settings, data export flows, and account deletion flows.
*   `apps/web/src/lib`: Client-side API integration for data export and deletion.
*   `apps/web/tests`: Frontend unit, integration, and E2E tests for privacy and account management.
*   `apps/api/app/api`: New API endpoints `/export` and `/auth/user` (for deletion).
*   `apps/api/app/services`: Logic for data export, account deletion, and Supabase integration.
*   `apps/api/tests`: Backend unit and integration tests.

**Testing Standards Summary:**
*   **Frontend:** Unit tests for components and confirmation flows; integration tests for API calls and Supabase Auth; E2E tests for data export, account deletion, and logout user journeys.
*   **Backend:** Unit tests for data export and account deletion logic; integration tests for `/export` and `/auth/user` API endpoints.

### Project Structure Notes

**Project Structure Alignment:**
This story aligns with the monorepo structure, impacting both the `apps/web` (Next.js frontend) for privacy and account management UI (Flows 15, 16, 18 Screen 5) and the `apps/api` (FastAPI backend) for handling data export (`/export`) and account deletion (`/auth/user`) API endpoints. Integration with Supabase will be key for secure user data management, logout, and token invalidation.

**Lessons Learned from Previous Stories:**
No explicit lessons learned from previous stories are available as Story 4.2 ("Performance & Data Settings") was recently drafted and is not yet implemented. Therefore, this story will proceed based on the architectural guidelines and design principles established in the `architecture.md` and `ux-design-direction.md` documents. Particular attention should be paid to security, data privacy, and robust error handling during data export and account deletion processes.

### References

*   `docs/architecture.md`
*   `docs/epics.md`
*   `docs/ux-design-direction.md`
*   `docs/validation-report-architecture.md`
*   `docs/sprint-artifacts/sprint-status.yaml`

## Dev Agent Record

### Context Reference
- docs/sprint-artifacts/4-3-Privacy & Account Management.context.xml