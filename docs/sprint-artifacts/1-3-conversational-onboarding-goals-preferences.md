# Story 1.3: Conversational Onboarding - Goals & Preferences

Status: review

## Story

As a new user,
I want to be guided through a conversational setup to define my fitness goals, preferences, and limitations,
so that the AI can generate a personalized plan for me.

## Requirements Context Summary

This story implements the conversational onboarding flow (Flow 2) for new users, a critical step for personalizing the AI experience. The primary goal is to gather essential user data—fitness goals, training preferences, available equipment, and physical limitations—through a guided, multi-step conversational interface.

**Key Technical & UX Requirements:**

*   **UI/UX:** The frontend implementation must adhere to the dark theme, vibrant green accents, and conversational UI principles (chat bubbles, progress indicators) detailed in `ux-design-direction.md` under "Flow 2: Goal & Preference Setup". The UI should be built based on the specific `code.html` files referenced for Flow 2 in the detailed UX design specification.
*   **Data Storage:** All collected data must be persisted in the Supabase database. This involves creating or updating the `Goals` and `Users` tables. The `Users` table will be updated with the `unit_preference`, while a new entry in the `Goals` table will capture the rest of the information, linked to the user's ID.
*   **API Layer:** The FastAPI backend will need an endpoint (e.g., `POST /onboarding`) to receive the collected data from the frontend and save it to the database, as specified in the Epic 1 Technical Specification.
*   **State Management:** Client-side state for the multi-step form will be managed using Zustand, as per the architectural decision (ADR-004).
*   **Flexibility:** The UI must support not just predefined options but also custom text input for goals and equipment, enhancing the personalization.

**References:**
*   `epics.md`#Story-1.3:-Conversational-Onboarding---Goals-&-Preferences
*   `ux-design-direction.md`#Flow-2:-Goal-&-Preference-Setup-(Conversational-Onboarding)
*   `architecture.md`#Data-Architecture
*   `docs/sprint-artifacts/tech-spec-epic-1.md`

## Acceptance Criteria

1.  After first authentication, new users are guided through a multi-step conversational UI (Flow 2).
2.  The UI allows users to select their primary fitness goal, training frequency, duration, and available equipment.
3.  The UI allows users to specify any injuries or limitations.
4.  The UI allows users to select their preferred measurement units (kg/lbs).
5.  A visual progress indicator is present in the header throughout the flow.
6.  The system provides an option for custom text entry for goals and equipment.
7.  All collected data is correctly stored in the Supabase `Goals` and `Users` tables upon completion.

## Tasks / Subtasks

- [x] **Task 1: Implement Conversational UI Shell & Navigation (AC: 1, 5)**
  - [x] Subtask 1.1: Create a main layout component for the onboarding flow in `apps/web/src/app/onboarding/` that includes the header with the visual progress indicator.
  - [x] Subtask 1.2: Implement a client-side router or state machine to manage the sequence of onboarding steps.
  - [x] Subtask 1.3: Create a Zustand store (`onboardingStore.ts`) to hold the user's selections as they progress through the flow.
  - [x] Subtask 1.4: Write unit tests (Jest/RTL) for the layout and navigation logic.
- [x] **Task 2: Implement Goal & Preferences Step (AC: 2)**
  - [x] Subtask 2.1: Create a component for the "Goal Selection" step (Flow 2, Step 1).
  - [x] Subtask 2.2: Create a component for the "Time & Frequency" step (Flow 2, Step 2).
  - [x] Subtask 2.3: Connect these components to the Zustand store to save user choices.
  - [x] Subtask 2.4: Write unit tests (Jest/RTL) for the Goal and Preferences components.
- [x] **Task 3: Implement Equipment Step (AC: 2, 6)**
  - [x] Subtask 3.1: Create a component for the "Equipment" step (Flow 2, Step 3), including a "Specify..." option for custom text input.
  - [x] Subtask 3.2: Update the Zustand store with the equipment selection.
  - [x] Subtask 3.3: Write unit tests (Jest/RTL) for the Equipment component, including custom input visibility.
- [x] **Task 4: Implement Injuries & Limitations Step (AC: 3)**
  - [x] Subtask 4.1: Create a component for the "Injuries & Limitations" step (Flow 2, Step 4).
  - [x] Subtask 4.2: Update the Zustand store with the user's input.
  - [x] Subtask 4.3: Write unit tests (Jest/RTL) for the Injuries and Limitations component.
- [x] **Task 5: Implement Units Step (AC: 4)**
  - [x] Subtask 5.1: Create a component for the "Units" selection step (Flow 2, Step 5).
  - [x] Subtask 5.2: Update the Zustand store with the unit preference.
  - [x] Subtask 5.3: Write unit tests (Jest/RTL) for the Units component.
- [x] **Task 6: Implement Backend Onboarding Endpoint (AC: 7)**
  - [x] Subtask 6.1: In `apps/api`, create a Pydantic model for the onboarding data.
  - [x] Subtask 6.2: Create a new FastAPI router with a `POST /onboarding` endpoint.
  - [x] Subtask 6.3: Implement the service logic to save onboarding data to the `Goals`, `Equipment`, and `Users` tables in Supabase.
  - [x] Subtask 6.4: Write integration tests for the endpoint.
- [x] **Task 7: Finalize Flow & Data Submission (AC: 7)**
  - [x] Subtask 7.1: Create the "Confirmation" step (Flow 2, Step 6).
  - [x] Subtask 7.2: On the final step, send all data from the Zustand store to the `POST /onboarding` endpoint.
  - [x] Subtask 7.3: Upon success, redirect the user to the main application dashboard.
  - [x] Subtask 7.4: Write an E2E test with Playwright for the complete onboarding flow.

## Dev Notes

*   **UI/UX:** This story is highly dependent on the UI components defined in the UX Design Specification for Flow 2. Adherence to the `code.html` examples for each step is critical for maintaining design consistency.
*   **Backend:** The backend component is straightforward but requires careful handling of data insertion into multiple tables (`Goals`, `Equipment`, `Users`) in a single logical transaction.
*   **Known Risk:** The existing backend testing issue (`ModuleNotFoundError`) is a known risk. E2E testing will be critical to validate the full flow if integration tests are blocked.

### Learnings from Previous Story (1.2: User Authentication)
*   The previous story is `in-progress`. While several frontend components for email auth were created, the full authentication flow (including Google OAuth and backend services) is not yet complete.
*   Authentication components were established in `apps/web/src/app/auth/`. This story should follow a similar pattern, creating its components under a dedicated `apps/web/src/app/onboarding/` route.
*   A `ModuleNotFoundError` in the Pytest setup for the backend will likely complicate or block integration tests for the new `/onboarding` endpoint.

### References
*   Previous Story: `docs/sprint-artifacts/1-2-user-authentication---email-google-oauth.md`
*   Architecture: `docs/architecture.md`
*   UX Design: `docs/ux-design-direction.md`
*   Epics: `docs/epics.md`

## Change Log

- 2025-12-08 - BIP - Initial draft created from epic 1.3.

## Dev Agent Record

### Context Reference

- `docs/sprint-artifacts/1-3-conversational-onboarding-goals-preferences.context.xml`

### Agent Model Used

Gemini

### Debug Log References

- **Task 1: Implement Conversational UI Shell & Navigation (AC: 1, 5)**
  - **Plan:**
    1. Create Onboarding Layout Component:
       - Create `apps/web/src/app/onboarding` directory.
       - Create `layout.tsx` for header with visual progress indicator (AC: 5).
    2. Implement Client-Side Router/State Machine:
       - Use React's state management for current step control.
    3. Create Zustand Store (`onboardingStore.ts`):
       - Create `apps/web/src/store/onboardingStore.ts`.
       - Define initial state for all onboarding inputs and actions to update state.
    4. Write Unit Tests:
       - Create `apps/web/src/app/onboarding/layout.test.tsx` and `apps/web/src/store/onboardingStore.test.ts`.

- **Task 2: Implement Goal & Preferences Step (AC: 2)**
  - **Plan:**
    1. Subtask 2.1: Create `apps/web/src/app/onboarding/goal-selection.tsx`.
       - Implement UI based on `docs/stich_design/Flow_2/onboarding_step_1_goal_selection/code.html`.
       - Use `useOnboardingStore` to set `goal` and `customGoal`.
    2. Subtask 2.2: Create `apps/web/src/app/onboarding/time-frequency.tsx`.
       - Implement UI based on `docs/stich_design/Flow_2/onboarding_step_2_time_and_frequency/code.html`.
       - Use `useOnboardingStore` to set `trainingFrequency` and `trainingDuration`.
    3. Subtask 2.3: Connect components to Zustand store (done in 2.1 & 2.2).
    4. Subtask 2.4: Write Unit Tests:
       - Create `apps/web/src/app/onboarding/goal-selection.test.tsx`.
       - Create `apps/web/src/app/onboarding/time-frequency.test.tsx`.

- **Task 3: Implement Equipment Step (AC: 2, 6)**
  - **Plan:**
    1. Subtask 3.1: Create `apps/web/src/app/onboarding/equipment-selection.tsx`.
       - Implement UI based on `docs/stich_design/Flow_2/onboarding_step_3_equipment/code.html`.
       - Handle multiple selections for equipment and a specific input for "Custom...".
    2. Subtask 3.2: Update the Zustand store with the equipment selection (done in 3.1).
    3. Subtask 3.3: Write Unit Tests:
       - Create `apps/web/src/app/onboarding/equipment-selection.test.tsx`.

- **Task 4: Implement Injuries & Limitations Step (AC: 3)**
  - **Plan:**
    1. Subtask 4.1: Create `apps/web/src/app/onboarding/injuries-limitations.tsx`.
       - Implement UI based on `docs/stich_design/Flow_2/onboarding_step_4_injuries_&_limitations/code.html`.
       - Handle multiple selections for injuries/limitations and a specific text area for custom input.
    2. Subtask 4.2: Update the Zustand store with the user's input (done in 4.1).
    3. Subtask 4.3: Write Unit Tests:
       - Create `apps/web/src/app/onboarding/injuries-limitations.test.tsx`.

- **Task 5: Implement Units Step (AC: 4)**
  - **Plan:**
    1. Subtask 5.1: Create `apps/web/src/app/onboarding/unit-selection.tsx`.
       - Implement UI based on `docs/stich_design/Flow_2/onboarding_step_5_units/code.html`.
       - Handle segmented control for 'kg'/'lbs' selection.
    2. Subtask 5.2: Update the Zustand store with the unit preference (done in 5.1).
    3. Subtask 5.3: Write Unit Tests:
       - Create `apps/web/src/app/onboarding/unit-selection.test.tsx`.

- **Task 6: Implement Backend Onboarding Endpoint (AC: 7)**
  - **Plan:**
    1. Subtask 6.1: In `apps/api`, create a Pydantic model for the onboarding data.
       - Create `apps/api/app/models/onboarding.py`.
       - Define `OnboardingData` model with `goal`, `customGoal`, `trainingFrequency`, `trainingDuration`, `equipment` (list of strings), `customEquipment`, `injuriesLimitations` (list of strings), `customInjuriesLimitations`, `unitPreference`.
    2. Subtask 6.2: Create a new FastAPI router with a `POST /onboarding` endpoint.
       - Create `apps/api/app/api/onboarding.py`.
       - Define FastAPI router.
       - Implement `POST` endpoint accepting `OnboardingData` and protected by authentication.
    3. Subtask 6.3: Implement the service logic to save onboarding data to the `Goals`, `Equipment`, and `Users` tables in Supabase.
       - Create `apps/api/app/services/onboarding_service.py`.
       - Interact with Supabase client to:
         - Update `unit_preference` in `Users` table using `user_id`.
         - Insert record into `Goals` table with `user_id`, `primary_goal`, `training_frequency`, `training_duration`, `injuries_limitations`.
         - Insert records into an `Equipment` table (or handle as JSONB).
    4. Subtask 6.4: Write integration tests for the endpoint.
       - Create `apps/api/tests/test_onboarding.py`.

- **Task 7: Finalize Flow & Data Submission (AC: 7)**
  - **Plan:**
    1. Subtask 7.1: Create `apps/web/src/app/onboarding/confirmation-step.tsx`.
       - Implement UI based on `docs/stich_design/Flow_2/onboarding_step_6_confirmation/code.html`.
       - Display confirmation message and "Continue" button.
    2. Subtask 7.2: Send all data from the Zustand store to the `POST /onboarding` endpoint.
       - In `confirmation-step.tsx`, use `useOnboardingStore` to get data.
       - Implement POST request to `/api/v1/onboarding`.
       - Handle loading and error states.
    3. Subtask 7.3: Upon success, redirect to the main application dashboard.
       - Use Next.js `useRouter` to navigate to `/dashboard`.
    4. Subtask 7.4: Write an E2E test with Playwright for the complete onboarding flow.
       - Create `tests/e2e/onboarding.spec.ts`.
       - Simulate user journey through all steps.
       - Verify data submission and redirection.
       - Mock backend `/api/v1/onboarding` for successful persistence.
       - Test data persistence and authentication protection.

### Completion Notes List
- All frontend UI components for the conversational onboarding flow (Goal Selection, Time & Frequency, Equipment Selection, Injuries & Limitations, Unit Selection, Confirmation Step) have been implemented based on UX design.
- The Zustand store (`onboardingStore.ts`) has been created and integrated for managing client-side state.
- Backend Pydantic model (`OnboardingData`) and FastAPI endpoint (`POST /api/v1/onboarding`) have been implemented, including service logic to save data to Supabase (Users, Goals, Equipment tables).
- Unit tests for frontend components and the Zustand store have been added.
- Integration tests for the backend endpoint have been added.
- An E2E test covering the full onboarding flow has been added.

### File List
- apps/web/src/app/onboarding/layout.tsx (modified)
- apps/web/src/app/onboarding/page.tsx (modified)
- apps/web/src/app/onboarding/onboarding-header.tsx (created)
- apps/web/src/app/onboarding/goal-selection.tsx (created)
- apps/web/src/app/onboarding/time-frequency.tsx (created)
- apps/web/src/app/onboarding/equipment-selection.tsx (created)
- apps/web/src/app/onboarding/injuries-limitations.tsx (created)
- apps/web/src/app/onboarding/unit-selection.tsx (created)
- apps/web/src/app/onboarding/confirmation-step.tsx (created)
- apps/web/src/store/onboardingStore.ts (created)
- apps/web/src/app/onboarding/layout.test.tsx (created)
- apps/web/src/store/onboardingStore.test.ts (created)
- apps/web/src/app/onboarding/goal-selection.test.tsx (created)
- apps/web/src/app/onboarding/time-frequency.test.tsx (created)
- apps/web/src/app/onboarding/equipment-selection.test.tsx (created)
- apps/web/src/app/onboarding/injuries-limitations.test.tsx (created)
- apps/web/src/app/onboarding/unit-selection.test.tsx (created)
- apps/web/src/app/types.ts (created)
- apps/api/app/models/onboarding.py (created)
- apps/api/app/api/onboarding.py (created)
- apps/api/app/core/config.py (created)
- apps/api/app/core/supabase.py (created)
- apps/api/app/services/onboarding_service.py (created)
- apps/api/tests/test_onboarding.py (created)
- tests/e2e/onboarding.spec.ts (created)
- apps/api/main.py (modified)
