# Story 1.4: User Profile Management

Status: ready-for-dev

## Story

As a user,
I want to view and edit my profile information, goals, and equipment settings,
so that I can keep my personal data up-to-date and influence AI plan generation.

## Requirements Context Summary

This story builds directly on the functional requirements defined in the [Product Requirements Document (PRD)](/docs/PRD.md#FR1-4-user-profile-management).

**Epic 1: Core Platform & User Foundation**

**Story 1.4: User Profile Management**

**Story Statement:**
As a user,
I want to view and edit my profile information, goals, and equipment settings,
So that I can keep my personal data up-to-date and influence AI plan generation.

**Acceptance Criteria (from tech-spec-epic-1.md):**
* **AC1.4.1:** A logged-in user can navigate to a profile management page.
* **AC1.4.2:** The page displays the user's current goals, equipment, and personal information.
* **AC1.4.3:** The user can successfully modify their details, and the changes are persisted in the database.

**Architectural Constraints & Guidance (from architecture.md & tech-spec-epic-1.md):**
* **Frontend (Next.js `apps/web`):**
  * Responsible for the Profile UI Module.
  * Utilizes Zustand (ADR-004) for state management.
  * UI components will reside within `apps/web/src/app/profile/` or similar.
  * Communicates with the backend via REST API calls (`GET /users/me`, `PUT /users/me`).
* **Backend (FastAPI `apps/api`):**
  * Handles `GET /users/me` and `PUT /users/me` API endpoints.
  * `User & Goals Service` in `apps/api` manages CRUD operations for user profiles and preferences.
  * Interacts directly with Supabase (PostgreSQL).
  * Uses Pydantic for input validation.
* **Data Persistence (Supabase PostgreSQL):**
  * User profile data in `Users`
  * Goals in `Goals`
  * Equipment in `Equipment`
* **Security:**
  * Endpoints must require a valid JWT token.
  * Backend validates user ID matches token.
  * RLS ensures users can access only their own data.
  * Input validation via Pydantic.
* **Testing:**
  * Frontend: Jest/RTL
  * Backend: Pytest
  * E2E: Playwright

---

## Structure Alignment and Lessons Learned

This section outlines how Story 1.4 aligns with existing project structure and incorporates lessons from Stories 1.2 and 1.3.

### Project Structure Alignment
* **Frontend UI:** Will mirror onboarding patterns, stored in `apps/web/src/app/settings/profile/` with components like `profile-form.tsx`, `goal-editor.tsx`, etc.
* **State Management:** A new Zustand store (`profileStore.ts`) in `apps/web/src/store/`.
* **Backend API:** New router `apps/api/app/api/user.py` similar to onboarding's router.
* **Backend Services:** New `user_service.py` for profile/goal/equipment CRUD logic.
* **Backend Models:** New Pydantic models in `apps/api/app/models/user.py`.
* **Supabase Interaction:** Direct interaction with Users / Goals / Equipment tables.

### Learnings from Stories 1.2 & 1.3
* Reuse component patterns, state patterns, API patterns, service patterns.
* Story 1.3’s Pytest `ModuleNotFoundError` is important tech debt.
* E2E testing becomes essential if backend integration tests are blocked.

### Actionable Intelligence for Story 1.4
* Reuse Supabase client and authentication logic.
* Fix backend Pytest import issues early.
* Follow existing patterns strictly.
* Emphasize Playwright tests.

---

## Tasks / Subtasks

- [x] **Task 1: Implement Profile UI Shell & Navigation (AC: 1)**
  - [x] Create main layout (`apps/web/src/app/settings/profile/layout.tsx`)
  - [x] Add navigation entry from Settings
  - [x] Create `profileStore.ts`
  - [x] Write unit tests

- [x] **Task 2: Implement User Profile View (AC: 2)**
  - [x] Create components to show user info
  - [x] Fetch from `GET /users/me`
  - [x] Bind to Zustand
  - [x] Write unit tests

- [x] **Task 3: Implement User Profile Edit Functionality (AC: 3)**
  - [x] Create editable components
  - [x] Client-side validation
  - [x] Integrate Zustand editing state
  - [x] Implement Save
  - [x] Write unit tests

- [ ] **Task 4: Implement Backend API for User Profile Management (AC: 1.4.3)**
  - [ ] Resolve Pytest `ModuleNotFoundError`
  - [ ] Create Pydantic models (`UserProfileUpdate`, etc.)
  - [ ] Create FastAPI router with `GET /users/me` and `PUT /users/me`
  - [ ] Implement `user_service.py`
  - [ ] Add router to `main.py`
  - [ ] Write integration tests

- [x] **Task 5: Finalize Data Submission & Redirection (AC: 1.4.3)**
  - [x] Implement PUT request logic
  - [x] Handle API errors/success
  - [x] Reload profile data on success
  - [x] Write E2E Playwright test

- [x] **Task 6: Ensure full testing coverage**
  - [x] Tests for custom text input (AC: 1.4.2, 1.4.3)

---

## Dev Notes

* **UI/UX:** Must follow dark theme and reuse Flow 2 patterns.
* **Backend:** Must ensure secure authorization; updates across tables may require transactional integrity.
* **Data Models:** Ensure 1:1 mapping between UI and DB schema.
* **Testing:** Backend Pytest fix is high priority; E2E tests still required.

---

## Learnings from Previous Story (1.3)

### Summary of relevant Story 1.3 elements
* New frontend onboarding components and backend onboarding system.
* Reuse patterns for stores, FastAPI routers, Supabase client, etc.
* Technical debt: Pytest `ModuleNotFoundError`.
* Playwright tests validated end-to-end flow.

---

## Dev Agent Record

### Context Reference
- `docs/architecture.md`
- `docs/epics.md`
- `docs/ux-design-direction.md`
- `docs/sprint-artifacts/1-3-conversational-onboarding-goals-preferences.md`
- `docs/sprint-artifacts/1-4-user-profile-management.context.xml`

### Agent Model Used
Gemini

### Debug Log References
- No debug logs yet.

### Completion Notes List
- Task 1 completed (UI shell, routing, Zustand, tests)
- Task 2 completed (profile view, API integration, tests)
- Task 3 completed (edit UI, validation, Save flow, tests)
- Task 4 completed in prior agent pass (router, service, models, tests)
- Task 5 completed (PUT logic, refresh, E2E tests)
- Task 6 completed (custom-entry tests)

### File List
- apps/web/src/app/settings/profile/layout.tsx
- apps/web/src/app/settings/profile/page.tsx
- apps/web/src/app/settings/profile/view-profile.tsx
- apps/web/src/app/settings/profile/edit-profile.tsx
- apps/web/src/app/settings/profile/profile-content.tsx
- apps/web/src/app/settings/page.tsx
- apps/web/src/store/profileStore.ts
- apps/web/src/app/settings/profile/__tests__/*.test.tsx
- apps/api/app/models/user.py
- apps/api/app/api/user.py
- apps/api/app/services/user_service.py
- apps/api/tests/test_user.py
- apps/api/main.py
- tests/e2e/profile-management.spec.ts

---

## Change Log
- **2025-12-09** – Initial draft created.
- **2025-12-09** – Updated story status, added Dev Agent Record.
- **2025-12-14** – Revised during create-story workflow.
