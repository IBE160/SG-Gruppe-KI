# ATDD Checklist: First-Time User Onboarding

**Story**: A new user can successfully complete the conversational onboarding flow and receive their first workout plan.
**Primary Test Level**: E2E (End-to-End)

---

## 1. Failing Test Created

A new failing E2E test has been added to the test suite.

- **File**: `tests/e2e/onboarding.spec.ts`
- **Test**: `should allow a new user to complete the conversational onboarding flow`

This test will remain in a **RED** state until all implementation tasks are completed.

---

## 2. Implementation Checklist (Red → Green)

Follow these steps to make the test pass.

### Step 1: Implement UI and `data-testid` Attributes

Ensure the following components and `data-testid` attributes exist.

| Component / Page | `data-testid` Attribute | Notes |
| --- | --- | --- |
| Welcome Screen | `welcome-hero-card` | The main hero card on the `/` page. |
| Welcome Screen | `begin-onboarding-button` | The primary button to start the flow. |
| Onboarding Flow | `conversational-check-in` | The container for the chat-like interface. |
| Onboarding Flow | `goal-chip-build-strength` | Chip for selecting "Build strength". |
| Onboarding Flow | `training-days-slider` | Slider for selecting training days. |
| Onboarding Flow | `equipment-chip-dumbbells` | Chip for selecting "Dumbbells". |
| Onboarding Flow | `music-chip-energetic` | Chip for selecting "Energetic" music. |
| Onboarding Flow | `submit-onboarding-button` | The final button to submit choices. |
| Plan Reveal Screen | `plan-reveal-screen` | The container for the confirmation screen. |
| Plan Reveal Screen | `view-my-plan-button` | Button to view the generated plan. |
| Workout Preview | `workout-player-preview` | The container for the guided workout preview. |

### Step 2: Implement API Endpoints

The test expects the following API endpoints to be available.

1.  **Create User and Preferences**
    - **Endpoint**: `POST /api/users`
    - **Purpose**: To create a new user record with their onboarding choices.
    - **Expected Request Body**:
      ```json
      {
        "goal": "build-strength",
        "trainingDaysPerWeek": 3,
        "equipment": ["dumbbells"],
        "music": "energetic"
      }
      ```
    - **Success Response (201 Created)**:
      ```json
      {
        "id": "usr_...",
        "goal": "build-strength",
        ...
      }
      ```

2.  **Generate First Plan**
    - **Endpoint**: `POST /api/plans/generate`
    - **Purpose**: To trigger the generation of the user's first workout plan based on their preferences.
    - **Success Response (200 OK)**:
      ```json
      {
        "planId": "pln_...",
        "summary": "Your First Adaptive Plan"
      }
      ```

---

## 3. How to Run the Test

1.  **Run the specific test file**:
    ```bash
    npm run test:e2e -- onboarding.spec.ts
    ```

2.  **Run in UI Mode for debugging**:
    ```bash
    npx playwright test --ui onboarding.spec.ts
    ```

The test is considered **GREEN** when it passes reliably in both headed and headless modes.
