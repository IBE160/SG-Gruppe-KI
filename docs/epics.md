# AI-Powered Personal Training Advisor - Epic Breakdown

**Author:** BIP
**Date:** 2025-11-03
**Project Level:** 3
**Target Scale:** Complex system (12-40 stories)

---

## Overview

This document provides the detailed epic breakdown for AI-Powered Personal Training Advisor, expanding on the high-level epic list in the [PRD](./bmm-PRD.md).

Each epic includes:

- Expanded goal and value proposition
- Complete story breakdown with user stories
- Acceptance criteria for each story
- Story sequencing and dependencies

**Epic Sequencing Principles:**

- Epic 1 establishes foundational infrastructure and initial functionality
- Subsequent epics build progressively, each delivering significant end-to-end value
- Stories within epics are vertically sliced and sequentially ordered
- No forward dependencies - each story builds only on previous work

---

## Epic 1: Core Platform & User Foundation

**Expanded Goal:** This epic aims to establish the fundamental technical and user-facing infrastructure required for the application. It includes setting up the project, implementing secure user authentication, and guiding new users through a conversational onboarding process to gather essential personalization data. This foundation is critical for all subsequent features and ensures a smooth initial user experience.

### Story Breakdown

**Story 1.1.1: Initialize Frontend and Backend Project Structure**
As a developer,
I want to execute the initial project setup commands for the frontend and backend,
So that the basic monorepo structure is in place.

**Acceptance Criteria:**
1.  `npx create-next-app` is run successfully with the specified flags from `architecture.md`.
2.  A `backend` directory is created with a Python virtual environment.
3.  `fastapi`, `uvicorn`, and `python-dotenv` are installed in the virtual environment.

**Prerequisites:** None

**Story 1.1.2: Establish Supabase Integration and Basic Schema**
As a developer,
I want to connect the project to a Supabase instance and create the initial database schema,
So that the application has a persistent data layer.

**Acceptance Criteria:**
1.  A Supabase project is created and environment variables for the connection are added to both frontend and backend `.env` files.
2.  The `users`, `workout_plans`, `workout_logs`, `daily_contexts`, `spotify_integrations`, and `user_settings` tables are created in the Supabase PostgreSQL database as defined in `architecture.md`.
3.  Row-Level Security (RLS) is enabled on all tables, with a basic policy ensuring users can only access their own data.

**Prerequisites:** Story 1.1.1

**Story 1.1.3: Configure Basic CI/CD Pipeline**
As a developer,
I want to set up a basic CI/CD pipeline,
So that code changes are automatically built and tested.

**Acceptance Criteria:**
1.  A GitHub Actions (or similar) workflow is created.
2.  The workflow triggers on every push to the `main` branch.
3.  The workflow installs dependencies for both frontend and backend.
4.  The workflow runs linters (ESLint) for the frontend and builds the Next.js project successfully.
5.  (Optional Stretch) The workflow runs basic placeholder tests for frontend and backend.

**Prerequisites:** Story 1.1.1

**Story 1.2: Email & Password Authentication**

As a new user,
I want to create an account and log in using my email and a password,
So that I can securely access the application.

**Acceptance Criteria:**
1.  User registration with email and password is functional.
2.  User login with email and password is functional.
3.  Password hashing and secure token management are implemented.

**Prerequisites:** Story 1.1

**Story 1.3: Google OAuth Integration**

As a new user,
I want to create an account and log in using my Google account,
So that I can quickly and conveniently access the application.

**Acceptance Criteria:**
1.  Google OAuth flow is integrated and functional for registration and login.
2.  User data from Google is correctly mapped to the application's user profile.

**Prerequisites:** Story 1.1

**Story 1.4: Apple OAuth Integration (Phase 2)**

As a new user,
I want to create an account and log in using my Apple account,
So that I can quickly and conveniently access the application.

**Acceptance Criteria:**
1.  Apple OAuth flow is integrated and functional for registration and login.
2.  User data from Apple is correctly mapped to the application's user profile.

**Prerequisites:** Story 1.1

**Story 1.5.1: Conversational Onboarding UI/Logic**

As a new user,
I want to be guided through an engaging conversational onboarding process,
So that the AI can gather my goals, preferences, and limitations with clear feedback.

**Acceptance Criteria:**
1.  Onboarding flow (Warm Welcome, Conversational Check-in) is implemented as per UX spec.
2.  UI allows input for user goals, time/frequency, equipment, injuries, and units via interactive controls (sliders, chips, text input).
3.  User inputs are stored correctly in the database.
4.  Real-time feedback is provided during check-in as user adjusts inputs, as per UX spec.
5.  All defined states and variants for onboarding UI components are implemented.

**Prerequisites:** Story 1.1, Story 1.2, Story 1.3

**Story 1.5.2: First Plan Reveal UI/Logic**

As a new user,
I want to see my first personalized workout plan generated and presented clearly,
So that I understand what to expect and can confidently start my fitness journey.

**Acceptance Criteria:**
1.  The "Instant AI Feedback" and "First Plan Reveal" screens are implemented as per UX spec.
2.  AI processing state is clearly communicated with micro-status and visual animations.
3.  The generated plan summary and overview are displayed accurately.
4.  Buttons for "[View My Plan]" and "[Adjust Details]" are functional.
5.  All defined states and variants for plan reveal UI components are implemented.

**Prerequisites:** Story 1.5.1

**Story 1.6: Implement Core Accessibility Features**

As a developer,
I want to implement foundational accessibility features across the application,
So that the app is usable by a wider audience, including individuals with disabilities, and adheres to WCAG 2.1 AA standards.

**Acceptance Criteria:**
1.  Keyboard navigation is functional across all core interactive elements (buttons, links, form fields).
2.  Visible focus indicators are present for all interactive elements.
3.  All primary color combinations meet WCAG 2.1 AA contrast ratios.
4.  Basic ARIA attributes (roles, labels) are correctly applied to key UI components.
5.  Screen reader compatibility for core navigation and content areas is verified.

**Prerequisites:** Story 1.1, Story 1.5


---

## Epic 2: AI-Powered Training & Logging

**Expanded Goal:** This epic focuses on implementing the core intelligence of the application, enabling the AI to generate personalized daily workout plans based on user input and historical data. It also covers the development of the workout player for logging performance and the progress dashboard for visualizing user achievements and trends.

### Story Breakdown

**Story 2.1.1: Create AI Plan Generation Service**
As a developer,
I want to create a service in the FastAPI backend that connects to the OpenAI API,
So that I have a dedicated module for handling AI plan generation requests.

**Acceptance Criteria:**
1.  A new service module is created in the FastAPI backend (e.g., `services/plan_service.py`).
2.  The service can securely connect to the OpenAI API using an API key from environment variables.
3.  A basic function exists that can send a hardcoded prompt to the OpenAI API and receive a response.

**Prerequisites:** Story 1.1.2

**Story 2.1.2: Develop Prompt Engineering for Plan Generation**
As a developer,
I want to design and implement a prompt that incorporates user data to generate a structured workout plan,
So that the AI's response is personalized and predictable.

**Acceptance Criteria:**
1.  The prompt dynamically includes user profile data (goals, equipment), preferences, and recent context.
2.  The prompt explicitly requests the output in a specific, parsable JSON format that matches the `workout_plans.plan_json` schema.
3.  The prompt includes role-playing instructions (e.g., "You are an expert personal trainer...").

**Prerequisites:** Story 2.1.1

**Story 2.1.3: Expose Plan Generation via API Endpoint**
As a developer,
I want to create a secure API endpoint that triggers the AI plan generation,
So that the frontend can request a new workout plan for a user.

**Acceptance Criteria:**
1.  A new `POST /plans` endpoint is created in the FastAPI backend.
2.  The endpoint is protected and requires user authentication.
3.  The endpoint retrieves the necessary user data, calls the AI Plan Generation Service, and returns the generated JSON plan.
4.  The generated plan is saved to the `workout_plans` table in the database.

**Prerequisites:** Story 2.1.2

**Story 2.1.4: Implement AI Response Caching**
As a developer,
I want to implement a caching layer for AI-generated plans,
So that the system meets the p95 ≤ 10s latency requirement and reduces API costs.

**Acceptance Criteria:**
1.  Redis is integrated into the backend.
2.  Before calling the OpenAI API, the Plan Generation Service checks Redis for a cached response based on user ID and a hash of the input context.
3.  If a valid cached response exists, it is served directly.
4.  If no cached response exists, a new plan is generated and stored in Redis with an appropriate TTL (Time-To-Live).

**Prerequisites:** Story 2.1.3

**Story 2.2.1: Workout Player Core UI**

As a user,
I want an intuitive interface to view my daily workout,
So that I can easily follow the plan.

**Acceptance Criteria:**
1.  Workout Player UI displays exercises, sets, reps, and RPE targets as per UX spec.
2.  Navigation between exercises and sets is smooth.
3.  The UI supports responsive adaptation for mobile and desktop views as per UX spec.
4.  All defined states and variants for workout player UI components are implemented.

**Prerequisites:** Story 2.1

**Story 2.2.2: Workout Player Controls & Timers**

As a user,
I want integrated controls and timers within the workout player,
So that I can manage my workout session efficiently and stay focused.

**Acceptance Criteria:**
1.  Timers and cues are integrated for rest periods and exercise duration, as per UX spec.
2.  Main controls (Complete, Timer, Skip, Music) are implemented as per UX spec.
3.  Integration with music playback controls (play, pause, skip) from Spotify (if connected).
4.  All defined states and variants for player controls are implemented.

**Prerequisites:** Story 2.2.1, Story 3.2 (for music integration)

**Story 2.3: Implement Workout Logging**

As a user,
I want to log my reps, weight, and RPE for each set during a workout,
So that my performance is accurately recorded and can be used for progress tracking and AI adaptation.

**Acceptance Criteria:**
1.  Users can input reps, weight, and RPE for each set.
2.  Logged data is stored persistently and associated with the correct workout session.
3.  Ability to mark a set as "completed" without detailed input.

**Prerequisites:** Story 2.2

**Story 2.4: Implement the Progress Dashboard**

As a user,
I want to view my training progress and key metrics,
So that I can stay motivated and understand the impact of my efforts.

**Acceptance Criteria:**
1.  Dashboard displays total volume, intensity, and streak count.
2.  Basic statistics and trends are visualized (e.g., charts for volume over time) in an information-dense yet uncluttered layout, consistent with the "Data-Driven Dashboard" design direction.
3.  Visual styling (e.g., subtle elevation with box-shadows for cards, subtle borders) is applied as per UX spec.
4.  Dashboard data is accurate within ±1% compared to raw logs.
5.  The dashboard layout is responsive and adapts correctly to defined breakpoints.

**Prerequisites:** Story 2.3

**Story 2.5: Implement In-app Reminders**

As a user,
I want to receive in-app reminders and nudges,
So that I stay consistent with my training and don't miss planned sessions.

**Acceptance Criteria:**
1.  Users can set and receive in-app reminders for planned workouts.
2.  Nudges are context-aware (e.g., "Time to warm up!").

**Prerequisites:** Story 2.1

**Story 2.6: Implement Offline Caching for Daily Plan**

As a user,
I want my daily workout plan to be available offline,
So that I can access my training even without an internet connection.

**Acceptance Criteria:**
1.  The AI-generated daily plan is cached locally.
2.  Users can view their plan when offline.

**Prerequisites:** Story 2.1

**Story 2.7: Implement Offline Logging and Sync**

As a user,
I want to log my workouts offline and have them sync when I reconnect,
So that I don't lose my progress even with intermittent internet access.

**Acceptance Criteria:**
1.  Workout logs are cached locally when offline.
2.  Cached logs are automatically synced to the backend upon reconnection.
3.  Conflict resolution mechanism for offline/online data discrepancies.

**Prerequisites:** Story 2.3, Story 2.6

**Story 2.8: Implement AI Fallback Mechanism**

As a user,
I want a backup plan if the AI plan generation fails,
So that I can still complete a workout without interruption.

**Acceptance Criteria:**
1.  If AI plan generation times out or fails (Case A: AI Plan Fails), a cached or rule-based fallback session is provided, as per UX spec.
2.  Users are clearly notified that a fallback plan is being used with the message specified in UX spec.
3.  Users are presented with options to "[Start Fallback Session]" or "[Edit Plan]", as per UX spec.
4.  Music generation failures (Case B: Music Fails) are handled, with subtle warnings and options to "[Retry Music]" or "[Start Session Without Music]", as per UX spec.
5.  Offline/No Network scenarios (Case C: Offline / No Network) are handled, providing cached or offline templates with appropriate messaging, as per UX spec.

**Prerequisites:** Story 2.1

---

## Epic 3: Enhanced Experience & Personalization

**Story 2.9: Implement Weekly Review Ritual**

As a user,
I want to receive an automated summary of my weekly progress,
So that I can stay informed about my achievements and adjust my goals effectively.

**Acceptance Criteria:**
1.  System generates a weekly summary of key progress metrics (e.g., total volume, PRs, consistency).
2.  Summary is easily accessible within the application (e.g., via a dedicated section on the dashboard or a notification).
3.  Users can review their weekly summary and provide feedback.

**Prerequisites:** Story 2.4

---

## Epic 3: Enhanced Experience & Personalization

**Expanded Goal:** This epic focuses on enriching the user's training experience through seamless music integration and advanced AI personalization. It includes connecting with Spotify to provide BPM-matched session mixes, implementing a "Context Window" for real-time user feedback to adapt AI plans, and integrating simulated recovery inputs to validate the AI's adaptive logic.

### Story Breakdown

**Story 3.1: Implement Spotify Authentication**

As a user,
I want to securely connect my Spotify account to the application,
So that I can integrate my music preferences with my workouts.

**Acceptance Criteria:**
1.  Spotify OAuth (PKCE) flow is successfully integrated.
2.  User can connect and disconnect their Spotify account.
3.  Access and refresh tokens are securely stored.

**Prerequisites:** Story 1.1

**Story 3.2: Implement Music Playback Control**

As a user,
I want to control Spotify music playback directly within the workout player,
So that I don't have to switch between apps during my session.

**Acceptance Criteria:**
1.  Play, pause, and skip functionality for Spotify is available in the workout player.
2.  Users can select available Spotify playback devices.

**Prerequisites:** Story 3.1

**Story 3.3: Implement BPM-matched Session Mixes**

As a user,
I want the AI to generate music playlists that match the intensity of my workout phases,
So that my music motivates me and aligns with my training.

**Acceptance Criteria:**
1.  AI generates session mixes based on BPM targets for different workout phases.
2.  Mixes incorporate user's Spotify listening history and preferences.
3.  Users can review and adjust the generated playlist before starting a workout.

**Prerequisites:** Story 3.2

**Story 3.4.1: Context Window UI Input**

As a user,
I want an intuitive interface to provide daily feedback on my mood, energy, and soreness,
So that the AI can gather my current state.

**Acceptance Criteria:**
1.  Context Window UI (bottom sheet modal) is implemented as per UX spec, allowing input via:
    *   Energy slider (Low → Normal → High).
    *   Sleep quality chips (Bad 😴 / Okay 🙂 / Great 😁).
    *   Chips for physical/mental state (Sore legs, Stressed, Motivated, Need it easy, Ready to push).
    *   Optional free-text field.
2.  User input is captured and stored for AI processing.
3.  All defined states and variants for Context Window UI components are implemented.

**Prerequisites:** Story 2.1

**Story 3.4.2: Context Window Live Feedback & AI Integration**

As a user,
I want to receive transparent, real-time feedback from the AI as I provide my daily context,
So that I understand how my input influences my workout plan.

**Acceptance Criteria:**
1.  As the user adjusts inputs in the Context Window, transparent feedback (e.g., “Got it – I’ll reduce volume ~10%...”) is displayed live on the same sheet, as per UX spec.
2.  The AI processes the real-time input to provide adaptive feedback before plan generation.
3.  The Context Window transitions smoothly to a "Designing today's plan..." progress state upon user confirmation.

**Prerequisites:** Story 3.4.1, Story 2.1

**Story 3.5: Implement AI Adaptation to User Context**

As a user,
I want the AI to adapt my workout plan based on my daily context input,
So that my training is always optimized for my current physical and mental state.

**Acceptance Criteria:**
1.  AI processes Context Window input to adjust workout volume, intensity, or exercise selection.
2.  AI transparently communicates proposed changes to the user.
3.  Users can accept or decline AI suggestions.

**Prerequisites:** Story 3.4, Story 2.1

**Story 3.6: Implement Simulated Recovery Inputs**

As a developer,
I want to simulate recovery data (HRV, sleep) to validate the AI's adaptive logic,
So that I can ensure the AI responds correctly to different recovery states before real wearable integration.

**Acceptance Criteria:**
1.  System accepts simulated recovery inputs (e.g., via a hidden developer setting or specific Context Window options).
2.  AI plan generation demonstrably changes based on simulated recovery data (e.g., -10% volume for "poor" recovery).

**Prerequisites:** Story 3.5

---

## Epic 4: User Control & Settings

**Expanded Goal:** This epic aims to provide users with comprehensive control over their application experience, personal data, and AI interactions. It involves developing a dedicated settings page with various categories, allowing users to customize preferences, manage integrations, and exercise their privacy rights, ensuring a transparent and user-centric platform.

### Story Breakdown

**Story 4.1: Implement the Main Dashboard Layout**

As a user,
I want a clear and intuitive main dashboard layout,
So that I can get a quick overview of my current status and easily navigate the app.

**Acceptance Criteria:**
1.  A main dashboard UI is created that serves as the primary landing screen after login.
2.  The layout includes designated areas/placeholders for the daily workout summary, progress highlights (from Story 2.4), and navigation elements.
3.  The dashboard provides clear navigation paths to the full Workout Player, Progress Dashboard, and Settings.
4.  The layout is responsive and functions correctly on target devices.

**Prerequisites:** Story 2.4

**Story 4.2: Implement the Settings Page UI**

As a user,
I want a well-organized and easy-to-navigate settings page,
So that I can efficiently manage my preferences and account.

**Acceptance Criteria:**
1.  Settings page UI is clearly structured with categories (General, Appearance, etc.) accessible from the main navigation, as per UX spec.
2.  Each category navigates to a dedicated sub-page displaying relevant options.
3.  Changes made on sub-pages are applied instantly with visual feedback (e.g., confirmation toast).
4.  The settings page layout is responsive and adapts correctly to defined breakpoints.

**Prerequisites:** Story 1.1

**Story 4.3: Implement General Settings**

As a user,
I want to customize general application settings like language, units, and time format,
So that the app experience aligns with my personal preferences.

**Acceptance Criteria:**
1.  Users can change language, units (kg/lbs), and time format (12h/24h).
2.  Changes are applied immediately and persisted across sessions.

**Prerequisites:** Story 4.2

**Story 4.4: Implement Music and Playback Settings**

As a user,
I want to manage my Spotify connection and music playback preferences,
So that I have control over my integrated music experience.

**Acceptance Criteria:**
1.  Users can connect/disconnect Spotify.
2.  Options to enable/disable Session Mix and BPM matching are available.
3.  Users can select preferred playback devices.

**Prerequisites:** Story 4.2, Story 3.1

**Story 4.5: Implement AI and Personalization Settings**

As a user,
I want to review and manage the AI's learned preferences and constraints,
So that I can understand and influence how the AI personalizes my training.

**Acceptance Criteria:**
1.  Settings display a list of AI's learned preferences and constraints.
2.  Users can clear AI memory to reset personalization.

**Prerequisites:** Story 4.2, Story 3.5

**Story 4.6: Implement Privacy and Account Settings**

As a user,
I want to manage my privacy settings, export my data, or delete my account,
So that I have full control over my personal information in compliance with GDPR.

**Acceptance Criteria:**
1.  Users can manage consent settings for analytics and AI.
2.  Users can revoke third-party integrations (e.g., Spotify).
3.  Functionality to export user data (JSON/CSV) is available.
4.  Secure and GDPR-compliant account deletion process is implemented.
5.  Destructive actions like account deletion require a confirmation modal where the user must explicitly type "DELETE" to proceed, as per UX spec.

**Prerequisites:** Story 4.2, Story 1.1

**Story 4.7: Implement User Profile Management**

As a user,
I want to view and edit my profile information, goals, and equipment,
So that I can keep my personal details up-to-date and ensure accurate personalization.

**Acceptance Criteria:**
1.  Users can access a dedicated profile management section within settings.
2.  Users can view and edit their name, email, password, and other relevant profile details.
3.  Users can update their fitness goals and equipment list.
4.  Changes are validated and persisted to the database.

**Prerequisites:** Story 4.2

---

## Epic 5: Cross-cutting UX & Technical Polish

**Expanded Goal:** This epic consolidates various cross-cutting concerns and technical polish items identified during UX design, ensuring a high-quality, consistent, and maintainable application. It addresses the implementation of reusable custom components, consistent application of UX patterns, animations, comprehensive responsive adaptations, and robust handling of edge cases.

### Story Breakdown

**Story 5.1: Develop Core Custom UI Components**

As a developer,
I want to build the identified custom composite and utility components,
So that the application has reusable, project-specific UI elements that adhere to the design system.

**Acceptance Criteria:**
1.  All custom components (e.g., Adaptive Session Card, Context Check-In Form, Workout Player Controls) are implemented as per UX specifications for content/data, user actions, states, and variants.
2.  Each component includes basic Storybook documentation or equivalent for usage and states.
3.  Components are integrated with the chosen design system (`shadcn/ui`) and styled with Tailwind CSS.

**Prerequisites:** Story 1.1, Story 1.6

**Story 5.2: Implement Consistent UX Pattern Across Application**

As a developer,
I want to ensure all defined UX patterns (e.g., Feedback, Forms, Modals) are consistently applied throughout the application,
So that users experience a predictable and intuitive interface.

**Acceptance Criteria:**
1.  All implemented features (from Epics 1-4) utilize the UX patterns defined in the UX specification.
2.  Review of key user flows confirms consistent application of button hierarchy, feedback, form, modal, and navigation patterns.
3.  Notification patterns (duration, stacking) are implemented as per specification.

**Prerequisites:** Story 1.1, Story 1.6

**Story 5.3: Implement Animations and Transitions**

As a developer,
I want to implement subtle animations and transitions,
So that the user interface feels fluid, responsive, and delightful.

**Acceptance Criteria:**
1.  Key interactions and state changes (e.g., loading states, navigation transitions, content updates) incorporate smooth animations.
2.  Animations are performant and do not negatively impact user experience.
3.  Animations align with the "Speed: Perceived Magic" principle.

**Prerequisites:** Story 1.1, Story 5.2

**Story 5.4: Ensure Comprehensive Responsive Adaptation**

As a developer,
I want to ensure all application screens are fully responsive across defined breakpoints,
So that the user experience is optimal on mobile, tablet, and desktop devices.

**Acceptance Criteria:**
1.  All core screens and custom components adapt correctly to mobile, tablet, and desktop breakpoints.
2.  Navigation and content organization adapt as specified in the UX design.
3.  Touch targets are correctly sized for mobile interactions.

**Prerequisites:** Story 1.1, Story 5.1

**Story 5.5: Implement Robust Edge Case Handling**

As a developer,
I want to implement specific handling for identified edge cases,
So that the application remains stable and provides graceful feedback even in unusual scenarios.

**Acceptance Criteria:**
1.  All edge cases identified in user journey flows (e.g., incomplete onboarding, music playback failure) are explicitly handled.
2.  Users receive appropriate feedback or fallback options when edge cases occur.
3.  Error states are gracefully managed, providing clear guidance to the user.

**Prerequisites:** Story 1.1, Stories from relevant Epics where edge cases were identified.

---

## Story Guidelines Reference

**Story Format:**

```
**Story [EPIC.N]: [Story Title]**

As a [user type],
I want [goal/desire],
So that [benefit/value].

**Acceptance Criteria:**
1. [Specific testable criterion]
2. [Another specific criterion]
3. [etc.]

**Prerequisites:** [Dependencies on previous stories, if any]
```

**Story Requirements:**

- **Vertical slices** - Complete, testable functionality delivery
- **Sequential ordering** - Logical progression within epic
- **No forward dependencies** - Only depend on previous work
- **AI-agent sized** - Completable in 2-4 hour focused session
- **Value-focused** - Integrate technical enablers into value-delivering stories

---

**For implementation:** Use the `create-story` workflow to generate individual story implementation plans from this epic breakdown.