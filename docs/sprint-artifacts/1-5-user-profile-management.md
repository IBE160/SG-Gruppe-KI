# Story 1.5: User Profile Management

Status: ready-for-dev

## Story

As a User,
I want to be able to view and edit my profile information, goals, and equipment,
so that I can keep my personal details up to date.

## Acceptance Criteria

1.  **Given** an authenticated user, **when** they navigate to their profile page, **then** they can see their current profile information, goals, and equipment.
2.  **And** they can edit these details and save the changes.

## Tasks / Subtasks

- [x] **Task 1: Frontend UI for User Profile Page** (AC: #1, #2)
  - [x] Create a new page/route for user profile management.
  - [x] Build the UI to display current profile information (name, goals, preferences, equipment, injuries, units).
  - [x] Implement forms/input fields to allow editing of these details.
  - [x] Implement client-side logic to fetch user data using `GET /api/v1/users/me`.
  - [x] Implement client-side logic to submit updated data using `PUT /api/v1/users/me`.
- [x] **Task 2: Backend API for User Profile Management** (AC: #1, #2)
  - [x] Ensure `GET /api/v1/users/me` endpoint in FastAPI correctly retrieves user data from Supabase `users` table. (Source: `tech-spec-epic-1.md#APIs-and-Interfaces`)
  - [x] Ensure `PUT /api/v1/users/me` endpoint in FastAPI correctly updates user data in Supabase `users` table. (Source: `tech-spec-epic-1.md#APIs-and-Interfaces`)
  - [x] Implement validation for incoming update data using Pydantic schemas (e.g., `UserProfileUpdate`). (Source: `tech-spec-epic-1.md#Services-and-Modules`)
  - [x] Ensure Row-Level Security (RLS) is enforced for all user profile operations.
- [x] **Task 3: Data Model & Schema Verification** (AC: #1, #2)
  - [x] Verify that the `users` table schema in Supabase (`id`, `email`, `name`, `goals`, `preferences`, `equipment`, `injuries`, `units`) supports all required fields for profile management. (Source: `tech-spec-epic-1.md#Data-Models-and-Contracts`)
  - [x] Verify that Pydantic schemas in `app/schemas/user.py` are aligned with the `users` table for updates.
- [ ] **Task 4: Testing** (AC: #1, #2)
  - [ ] Add Pytest integration tests for `GET /api/v1/users/me` and `PUT /api/v1/users/me` endpoints.
  - [x] Add React Testing Library tests for the frontend profile components.
  - [ ] Add Playwright E2E test for navigating to the profile page, editing details, and saving changes successfully.

## Dev Notes

This story focuses on providing users the ability to manage their personal profile, goals, and equipment.

-   **Architecture**: Leverage FastAPI for backend API and Next.js for the frontend UI. Data persistence will be in the Supabase `users` table. Authentication is handled by Supabase Auth with RLS for authorization. (Source: `docs/architecture.md#Decision-Summary`, `docs/architecture.md#Security-Architecture`)
-   **Source Components**:
    -   **Backend**: `app/api/v1/users.py` (existing module, update endpoints), `app/schemas/user.py` (new/updated schemas).
    -   **Frontend**: New `Profile Module` components and logic.
-   **Testing**: Focus on integration and E2E testing to ensure the full flow of fetching, editing, and saving profile data works correctly, with attention to RLS enforcement.

### Project Structure Notes

-   Continues to follow the monorepo structure. New code will primarily reside within a new frontend `Profile Module` and updates to `backend/app/api/v1/users.py` and `app/schemas/user.py`. (Source: `docs/architecture.md#Project-Structure`)
-   No conflicts with previous work are anticipated; builds on existing authentication and onboarding data structures.

### Learnings from Previous Story

**From Story 1.4: Conversational Onboarding for Goal Setting (Status: ready-for-dev)**

-   **Architectural Foundation:** Confirmed use of Supabase Auth for identity management, FastAPI for backend API, and Next.js for frontend. Data persistence in Supabase `users` table. (Source: `docs/sprint-artifacts/1-4-conversational-onboarding-for-goal-setting.md#Learnings-from-Previous-Story`)
-   **Auth Component Structure:** Established patterns for API endpoints (`app/api/v1/`) and frontend module organization. This story will build upon `app/api/v1/users.py`. (Source: `docs/sprint-artifacts/1-4-conversational-onboarding-for-goal-setting.md#Learnings-from-Previous-Story`)
-   **Pydantic Schemas:** Understanding of using Pydantic for request/response validation (relevant for `UserProfileUpdate`). (Source: `docs/sprint-artifacts/1-4-conversational-onboarding-for-goal-setting.md#Learnings-from-Previous-Story`)
-   **Testing Patterns:** Follow Pytest for backend and Playwright for E2E tests. (Source: `docs/sprint-artifacts/1-4-conversational-onboarding-for-goal-setting.md#Learnings-from-Previous-Story`)
-   **Monorepo:** Continued adherence to the established monorepo structure. (Source: `docs/sprint-artifacts/1-4-conversational-onboarding-for-goal-setting.md#Learnings-from-Previous-Story`)

### References

-   [Source: `docs/epics.md#Story-1.5:-User-Profile-Management`]
-   [Source: `docs/sprint-artifacts/tech-spec-epic-1.md#APIs-and-Interfaces`]
-   [Source: `docs/architecture.md#Data-Architecture`]
-   [Source: `docs/architecture.md#Security-Architecture`]
-   [Source: `docs/sprint-artifacts/1-4-conversational-onboarding-for-goal-setting.md#Dev-Notes`]

## Dev Agent Record

### Context Reference

- `docs/sprint-artifacts/1-5-user-profile-management.context.xml`

### Agent Model Used

Gemini CLI

### Debug Log References

### Completion Notes List

### File List

#### Frontend Files
- src/app/(app)/profile/page.tsx
- src/app/lib/api/user.ts

#### Backend Files
- backend/app/api/v1/users.py
- backend/app/schemas/user.py

## Change Log

- 2025-11-24: Initial draft created by Gemini CLI.
