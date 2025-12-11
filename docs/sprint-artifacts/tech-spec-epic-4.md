# Epic Technical Specification: {{epic_title}}

Date: {{date}}
Author: {{user_name}}
Epic ID: {{epic_id}}
Status: Draft

---

## Overview

This document provides the technical specification for Epic 4: User Control & Settings. This epic is focused on empowering the user with full control over their application experience, data, and privacy. It encompasses the development of a comprehensive settings area, including appearance customization, data management features like offline mode, and critical privacy functions such as data export and account deletion, ensuring compliance with GDPR.

## Objectives and Scope

### In-Scope
- Story 4.1: Building the main, searchable settings menu and its navigation structure.
- Story 4.2: Implementing performance and data settings, including an offline mode with local caching and data synchronization logic.
- Story 4.3: Developing privacy and account management features, including GDPR-compliant data export and a secure account deletion process.
- Story 4.4: Creating general and appearance settings for theme, language, and other UI customizations.
- Story 4.5: Building the UI for managing AI personalization, allowing users to view and reset learned preferences.

### Out-of-Scope
- Core workout functionality (Epic 2).
- Music integration (Epic 3).
- Initial user onboarding (Epic 1).

## System Architecture Alignment

This epic will involve significant work in both the frontend and backend, adhering to the established architecture. The frontend (`apps/web`) will house the new UI modules for all settings screens (Flow 18). The **Offline Mode** feature (Story 4.2) will require the implementation of a robust client-side caching strategy, likely using **IndexedDB** (or a wrapper library like `idb`) to store workout plans and logs locally. The backend (`apps/api`) will need new endpoints to support data export (`/export`) and account deletion (`/auth/user`), which will interact directly with Supabase services. These new features will follow all existing conventions for API design, state management, and error handling.

## Detailed Design

### Services and Modules

| Service/Module | Location | Responsibilities | Owner |
| :--- | :--- | :--- | :--- |
| **Data Export Service**| `apps/api` | Handles GDPR-compliant data export requests. Gathers all data for a user and packages it. | Backend |
| **Account Deletion Svc**| `apps/api` | Manages the secure and irreversible deletion of a user and all their associated data from the database. | Backend |
| **Settings Service** | `apps/api` | Provides endpoints for updating various user settings and preferences. | Backend |
| **Settings UI Module** | `apps/web` | A parent module containing the navigation and individual screens for all settings categories (Flow 18). | Frontend |
| **Offline Sync Service**| `apps/web` | A client-side service to manage local caching (via IndexedDB) and data synchronization for offline mode (Flow 17). | Frontend |
| **AI Prefs UI Module** | `apps/web` | Implements the UI for viewing and managing learned AI preferences (Flow 18, Screen 4). | Frontend |

### Data Models and Contracts

No new tables are required for this epic. However, the following modifications will be made:

**Table: `Users` (Updates)**
-   A new `preferences` (jsonb) column will be added to store UI-related settings like theme, language, etc. This is more scalable than adding individual columns.

**Local Storage (IndexedDB)**
-   **`offline_logs` Object Store:** Will be created to cache `WorkoutLogs` entries when the application is offline. Each entry will mirror the `WorkoutLogs` table structure with a `synced` flag.
-   **`cached_plans` Object Store:** Will store the current day's workout plan for offline access.

### APIs and Interfaces

*   **`POST /users/me/export`**
    *   **Headers:** `Authorization: Bearer <access_token>`
    *   **Response (Success):** `{ "data": { "message": "Data export initiated. You will receive an email when it is ready." } }`
*   **`DELETE /users/me`**
    *   **Headers:** `Authorization: Bearer <access_token>`
    *   **Response (Success):** `{ "data": { "message": "Account deletion process started." } }`
*   **`PUT /users/me/settings`**
    *   **Headers:** `Authorization: Bearer <access_token>`
    *   **Request:** `{ "preferences": { "theme": "dark", "language": "en" } }`
    *   **Response (Success):** `{ "data": { ...updated_user_preferences } }`
*   **`PUT /users/me/ai-preferences/reset`**
    *   **Headers:** `Authorization: Bearer <access_token>`
    *   **Response (Success):** `{ "data": { "message": "AI learning has been reset." } }`

### Workflows and Sequencing

1.  **Toggle Offline Mode:**
    1.  User enables "Offline Mode" in the Performance & Data settings (Flow 17).
    2.  The frontend's **Offline Sync Service** is activated. It pre-caches the current day's workout plan.
    3.  When a workout is performed, the Workout Player saves log entries to the `offline_logs` store in IndexedDB instead of calling the `/logs` API.
    4.  A persistent "Offline" indicator is shown in the UI.
2.  **Resume Sync:**
    1.  The application detects a restored internet connection.
    2.  The **Offline Sync Service** reads all unsynced entries from the `offline_logs` store.
    3.  It sends the cached logs in a batch to the `POST /logs` endpoint.
    4.  Upon successful API response, the local log entries are marked as `synced`.
3.  **Account Deletion:**
    1.  User navigates to Settings -> Privacy & Account and initiates deletion (Flow 16).
    2.  User must complete a high-friction confirmation (e.g., typing "DELETE").
    3.  Frontend calls the `DELETE /users/me` endpoint.
    4.  Backend's **Account Deletion Service** queues a job to scrub all data associated with the `user_id` from all tables (`Users`, `Goals`, `WorkoutLogs`, etc.).
    5.  The user's session is immediately terminated.

## Non-Functional Requirements

### Performance

-   **UI Responsiveness:** All settings screens must be highly responsive, with changes reflecting immediately in the UI (e.g., theme changes).
-   **Offline Sync:** The background data synchronization process must not block or degrade the performance of the main UI thread.

### Security

-   **GDPR Compliance:** The data export and account deletion features MUST be fully compliant with GDPR requirements for right to access and right to be forgotten.
-   **Data Deletion:** The account deletion process must be irreversible and scrub all personally identifiable information (PII) from all database tables.

### Reliability/Availability

-   **Data Sync:** The offline sync mechanism must be robust against conflicts. A "last-write-wins" strategy is acceptable for Phase 1, but the backend API for logging should be idempotent to handle potential duplicate sync attempts without creating duplicate records.
-   **Destructive Actions:** All destructive actions (Delete Account, Clear Cache) require a high-friction user confirmation to prevent accidental data loss.

### Observability

-   **Sync Logging:** The Offline Sync Service will log key events, such as "sync started," "sync completed," and any errors encountered during the process.
-   **Deletion Logging:** The Account Deletion Service will create an audit log entry upon successful completion of a data purge.

## Dependencies and Integrations

### Core Dependencies
-   **idb:** A lightweight wrapper library will be used on the frontend to simplify interactions with IndexedDB for the offline cache.

### Integrations
(No new external integrations for this epic)

## Acceptance Criteria (Authoritative)

**Story 4.1: Main Settings Menu & Navigation**
1.  **AC4.1.1:** A main settings menu is accessible within the application.
2.  **AC4.1.2:** The menu is categorized (General, Appearance, Privacy, etc.) and includes a search bar to filter options.

**Story 4.2: Performance & Data Settings**
3.  **AC4.2.1:** A user can toggle "Offline Mode" on or off.
4.  **AC4.2.2:** When offline, workout logs are saved to a local cache.
5.  **AC4.2.3:** When connection is restored, cached data is automatically synced to the backend.

**Story 4.3: Privacy & Account Management**
6.  **AC4.3.1:** A user can request an export of their personal data.
7.  **AC4.3.2:** A user can initiate the permanent deletion of their account.
8.  **AC4.3.3:** The deletion process requires explicit user confirmation (e.g., typing "DELETE").

**Story 4.4: General & Appearance Settings**
9.  **AC4.4.1:** A user can change the application theme (light/dark) and accent color.
10. **AC4.4.2:** Changes to appearance settings are previewed live and applied immediately.

**Story 4.5: AI & Personalization Settings**
11. **AC4.5.1:** A user can view a list of learned AI preferences.
12. **AC4.5.2:** A user can reset all AI learning to its default state.

## Traceability Mapping

| AC ID | Spec Section(s) | Component(s) / API(s) | Test Idea |
| :--- | :--- | :--- | :--- |
| AC4.2.2 | Data Models, Services | `Offline Sync Service` | E2E Test (Playwright): Disconnect network, log a workout set, verify data is in IndexedDB. |
| AC4.2.3 | Workflows, Services | `Offline Sync Service`, `POST /logs` | E2E Test (Playwright): Reconnect network, verify cached data is sent to the backend and cleared from local cache. |
| AC4.3.2 | APIs, Services | `DELETE /users/me`, `Account Deletion Svc`| Integration Test: Call the delete endpoint for a test user and verify that all their data is removed from the test DB. |
| AC4.4.1 | UI Modules | `Settings UI Module` | Component Test (RTL): Toggle the theme switch and verify the correct CSS classes are applied. |

## Risks, Assumptions, Open Questions

-   **Risk:** Data conflict or corruption during offline synchronization if the same entity is modified both locally and on the server while disconnected.
    -   **Mitigation (Phase 1):** For workout logs (which are append-only), the risk is low. The `POST /logs` endpoint will be made idempotent (e.g., by checking for existing log IDs) to prevent duplicates from failed sync retries. More complex conflict resolution is out of scope for Phase 1.
-   **Risk:** Incomplete account data deletion could lead to GDPR compliance violations.
    -   **Mitigation:** The `Account Deletion Service` must be thoroughly tested. A script will be created to run after the deletion job to verify that no data for the `user_id` remains in any table.
-   **Assumption:** The amount of data cached for offline mode will be small enough to not exceed browser storage limits for typical users.

## Test Strategy Summary

The test strategy will be updated to handle the new complexities of this epic.

-   **Unit Tests:** Will cover UI components for all the new settings screens.
-   **Integration Tests:** Will focus on the new backend endpoints for data export and account deletion, ensuring they are secure and function correctly.
-   **End-to-End Tests (Playwright):** A critical new set of tests will be developed for offline mode. These tests will use Playwright's network control features to:
    1.  Go offline.
    2.  Perform actions (e.g., log a workout).
    3.  Verify data is in the local cache.
    4.  Go back online.
    5.  Verify the data is successfully synced to the backend.
