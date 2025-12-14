### Requirements Context Summary

#### Story: 1.3 Conversational Onboarding - Goals & Preferences

**Epic 1: Core Platform & User Foundation**
Establish the foundational infrastructure, user authentication, and conversational onboarding to enable basic user interaction and personalization.

**User Story Statement:**
As a new user, I want to be guided through a conversational setup to define my fitness goals, preferences, and limitations, So that the AI can generate a personalized plan for me.

**Acceptance Criteria:**
*   Given I have just authenticated as a new user
*   When I am redirected to the Onboarding flow (Flow 2)
*   Then I am presented with a sequence of conversational screens (Flow 2, Steps 1-6)
*   And I can select my primary fitness goal, training frequency/duration, available equipment, and any injuries/limitations
*   And I can specify my preferred units (kg/lbs)
*   And all inputs are stored in `Goals` and `Users` tables (Supabase)
*   And the process includes a visual progress indicator in the header
*   And the system allows for flexible input for goals and equipment (custom text entry)

#### Architectural Context

**Key Architectural Decisions:**
*   **Data Persistence:** Supabase (PostgreSQL) - User inputs for goals and preferences will be stored in Supabase `Goals` and `Users` tables.
*   **State Management:** Zustand - Can be used for managing the state of the conversational onboarding flow on the frontend.

**UX Design Direction (Flow 2: Goal & Preference Setup):**
*   **Purpose:** Engage new users in a low-friction process to gather essential data for AI personalization.
*   **Core User Journey:** A step-by-step, visually engaging conversational interaction (chat bubbles with AI avatar) set against the app's dark theme with green accents. Users select goals and preferences using rounded buttons, providing inputs via a sticky composer. Visual progress is indicated in the header.
*   **Key UX Direction / Improvements:** Consistent Brand Aesthetic, Visual Progress Indicator, Enhanced Input Flexibility.

**Technical Notes from Epic:**
*   Implement frontend UI based on Flow 2 `code.html` files.
*   Store user inputs in Supabase `Goals` and `Users` tables.
*   Ensure UI adheres to `ux_design_content` principles (dark theme, green accents, conversational interface, progress indicator, flexible input).