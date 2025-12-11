# ibe160 - Epic Breakdown

**Author:** BIP
**Date:** 2025-12-04
**Project Level:** 3
**Target Scale:** Complex system (12-40 stories)

---

## Overview

This document provides the complete epic and story breakdown for {{project_name}}, decomposing the requirements from the [PRD](./PRD.md) into implementable stories.

**Living Document Notice:** This is the initial version. It will be updated after UX Design and Architecture workflows add interaction and technical details to stories.



---

## Functional Requirements Inventory

- FR001: Conversational Onboarding & Goal Setting
- FR002: AI Daily-Plan Generator (adapts to user context)
- FR003: Workout Player with logging (reps, weight, RPE)
- FR004: Progress Dashboard (volume, streaks, basic stats)
- FR005: Authentication (OAuth for Google, Email)
- FR006: In-app Reminders & Nudges
- FR007: Offline Cache for the daily workout plan and logs
- FR008: Spotify Integration (PKCE OAuth, playback control, BPM-matched Session Mix v1)
- FR009: Context Window for manual user input (energy, mood, soreness)
- FR010: Simulated Recovery Inputs to validate adaptive AI logic
- FR011: Weekly Review Ritual (automated progress summary)
- FR012: Settings page with General, Appearance, Performance & Data, Music & Playback, AI & Personalization, Privacy & Account settings.
- FR013: User Profile Management (view/edit profile info, goals, equipment).

---

## FR Coverage Map

- FR001: Conversational Onboarding & Goal Setting → Epic 1
- FR002: AI Daily-Plan Generator (adapts to user context) → Epic 2
- FR003: Workout Player with logging (reps, weight, RPE) → Epic 2
- FR004: Progress Dashboard (volume, streaks, basic stats) → Epic 2
- FR005: Authentication (OAuth for Google, Email) → Epic 1
- FR006: In-app Reminders & Nudges → Epic 2
- FR007: Offline Cache for the daily workout plan and logs → Epic 4
- FR008: Spotify Integration (PKCE OAuth, playback control, BPM-matched Session Mix v1) → Epic 3
- FR009: Context Window for manual user input (energy, mood, soreness) → Epic 3
- FR010: Simulated Recovery Inputs to validate adaptive AI logic → Epic 2
- FR011: Weekly Review Ritual (automated progress summary) → Epic 2
- FR012: Settings page with General, Appearance, Performance & Data, Music & Playback, AI & Personalization, Privacy & Account settings. → Epic 4
- FR013: User Profile Management (view/edit profile info, goals, equipment). → Epic 1

---

<!-- Repeat for each epic (N = 1, 2, 3...) -->

## Epic 1: Core Platform & User Foundation

Establish the foundational infrastructure, user authentication, and conversational onboarding to enable basic user interaction and personalization.

### Story 1.1: Project Setup & Core Infrastructure
As a developer,
I want to initialize the project with the specified tech stack,
So that I can begin developing features on a solid foundation.

**Acceptance Criteria:**
Given the project is new and empty
When I execute the `npx create-next-app@latest my-ai-trainer --typescript --tailwind --eslint --app --src-dir` command
Then a Next.js project structure is created in `apps/web`
And `apps/api` (FastAPI) directory is created as a peer to `apps/web`
And basic `.gitignore` and `README.md` files are present
And `package.json` reflects a monorepo setup

**Prerequisites:** None

**Technical Notes:** Follow `architecture_content` for monorepo structure and initial `create-next-app` command. Ensure `package.json` is updated for monorepo and dependencies are correctly installed. Install FastAPI within `apps/api`.

### Story 1.2: User Authentication - Email & Google OAuth
As a new user,
I want to create an account or log in using my email/password or Google,
So that I can securely access the application.

**Acceptance Criteria:**
Given I am on the Welcome/Authentication Gateway screen (Flow 1, Screen 1 - `welcome_screen/code.html`)
When I choose "Create Account" or "Log In" using email and password
Then I am presented with the Email Sign-up (Flow 1, Screen 2A - `email_signup/code.html`) or Email Login (Flow 1, Screen 2B - `email_authentication/code.html`) forms
And I can successfully register or log in with valid credentials
And I am redirected to either Onboarding (new user) or Dashboard (returning user)
When I choose "Continue with Google"
Then I am redirected to the Google OAuth flow
And I can successfully authenticate with my Google account
And I am redirected to either Onboarding (new user) or Dashboard (returning user)
Then authentication is handled via Supabase Auth
And user data is stored in the Supabase `Users` table

**Prerequisites:** Story 1.1

**Technical Notes:** Implement frontend UI based on Flow 1 `code.html` files. Integrate Supabase Auth for email/password and Google OAuth. Ensure JWTs are handled securely. Refer to `architecture_content` for Supabase integration.

### Story 1.3: Conversational Onboarding - Goals & Preferences
As a new user,
I want to be guided through a conversational setup to define my fitness goals, preferences, and limitations,
So that the AI can generate a personalized plan for me.

**Acceptance Criteria:**
Given I have just authenticated as a new user
When I am redirected to the Onboarding flow (Flow 2)
Then I am presented with a sequence of conversational screens (Flow 2, Steps 1-6)
And I can select my primary fitness goal, training frequency/duration, available equipment, and any injuries/limitations
And I can specify my preferred units (kg/lbs)
And all inputs are stored in `Goals` and `Users` tables (Supabase)
And the process includes a visual progress indicator in the header
And the system allows for flexible input for goals and equipment (custom text entry)

**Prerequisites:** Story 1.2

**Technical Notes:** Implement frontend UI based on Flow 2 `code.html` files. Store user inputs in Supabase `Goals` and `Users` tables. Ensure UI adheres to `ux_design_content` principles (dark theme, green accents, conversational interface, progress indicator, flexible input).

### Story 1.4: User Profile Management
As a user,
I want to view and edit my profile information, goals, and equipment settings,
So that I can keep my personal data up-to-date and influence AI plan generation.

**Acceptance Criteria:**
Given I am a logged-in user
When I navigate to my User Profile Management section (likely via Settings -> Privacy & Account, or a dedicated Profile screen in Phase 2)
Then I can view my current goals, equipment, and personal information
And I can modify these details
And changes are persisted in the Supabase `Users` and `Goals` tables
And validation is applied to updated fields

**Prerequisites:** Story 1.3


## Epic 2: AI-Powered Training & Logging

Implement the core AI daily plan generation, workout player, and progress tracking to deliver personalized and adaptive training experiences.

### Story 2.1: AI Daily Plan Generation API
As a backend service,
I want to expose an API endpoint that generates a structured daily workout plan based on user profile, historical data, and contextual inputs, including simulated recovery,
So that the frontend can display a personalized plan.

**Acceptance Criteria:**
Given the FastAPI backend is running
When a POST request is made to `/plans/generate` with `userId`, `goals`, `equipment`, `historicalData`, and `context` (including `recovery_bias` and simulated HRV/sleep)
Then the AI Orchestrator service constructs a prompt for the AI model
And the AI model (OpenAI API) generates a structured JSON workout plan
And the response includes an explanation for plan adaptations based on context
And `p95` API latency for non-AI components is < 300ms, and for AI is ≤ 10s
And the plan is stored in the `WorkoutPlans` database table

**Prerequisites:** Story 1.1, 1.3. FastAPI setup from `architecture_content`.

**Technical Notes:** Implement `/plans/generate` endpoint in FastAPI. Integrate with OpenAI API. Use Pydantic for request/response validation. Implement `AI Orchestrator` logic to fuse inputs and construct prompts. Store plans in Supabase `WorkoutPlans` table. Implement `NFR004` (Performance) and `NFR009` (Rate Limiting) for this endpoint.

### Story 2.2: Daily Plan Context Window
As a user,
I want to input my daily mood, energy, and soreness levels via a Context Window,
So that the AI can adapt my daily workout plan accordingly.

**Acceptance Criteria:**
Given I am on the Dashboard (or accessing the context window via other triggers)
When I interact with the Context Window UI (Flow 6, Screen 1 - `screen_1/code.html` top section)
Then I can select mood (emoticons) and energy level (segmented buttons)
And I can optionally add free-text input for specific details
And submitting this context triggers the AI Daily Plan generation (Story 2.1)
And the UI allows for smart suggestions based on historical patterns (`Flow 6, Screen 1`).

**Prerequisites:** Story 1.1, 1.3, 2.1.

**Technical Notes:** Implement frontend UI components for the Context Window as per `ux_design_content` (Flow 6, Screen 1). Implement client-side logic to capture inputs and send to `/context` API endpoint.

### Story 2.3: Display & Review Daily Plan
As a user,
I want to review the AI-generated daily workout plan, including any adaptations, and have the option to confirm or edit it,
So that I maintain control over my training.

**Acceptance Criteria:**
Given the AI has generated a daily workout plan (Story 2.1)
When I am presented with the "Review Proposed Plan" screen (Flow 6, Screen 3 - `screen_3/code.html`)
Then I can see the full workout plan, broken down by exercises and sets
And any AI adaptations are visually highlighted and explained (e.g., "Heard you were feeling a bit low on energy...")
And I have options to `[ Confirm Plan ]` or `[ Edit Plan ]`
And confirming the plan leads to the "Plan Confirmed!" screen (Flow 6, Screen 4 - `screen_4/code.html`) before redirecting to Dashboard

**Prerequisites:** Story 2.1, 2.2

**Technical Notes:** Implement frontend UI for plan review as per `ux_design_content` (Flow 6, Screen 3). Implement state management (Zustand) to display plan data. Call backend API to confirm or initiate editing.

### Story 2.4: Workout Player Core UI & Logging
As a user,
I want an intuitive interface to perform and log my workout sets (reps, weight, RPE) in real-time,
So that I can accurately track my progress.

**Acceptance Criteria:**
Given I have confirmed my daily workout plan (Story 2.3)
When I tap `[ Start Workout ]` from the Dashboard or plan card (Flow 7, Screen 1 - `screen_1/code.html` Loading State and Screen 2 - `screen_2/code.html` Pre-Workout)
Then the Workout Player loads, starting with a distinct Warm-up phase (Flow 7, Screen 3 - `screen_3/code.html`)
And I can log reps, weight, and RPE for each set during the main workout (Flow 9 - `code.html`)
And the UI provides optimized input for reps/weight/RPE (large buttons, sliders, smart pre-fills)
And a clear preview of the next exercise/set is displayed during rest periods
And all logged data is incrementally stored in `WorkoutLogs` (Supabase) via `/logs` API

**Prerequisites:** Story 2.3

**Technical Notes:** Implement frontend UI for Workout Player based on `ux_design_content` (Flow 7, Flow 9 `code.html` files). Implement API calls to `/logs` endpoint in FastAPI to store incremental data. Use Zustand for managing workout state.

### Story 2.5: Progress Dashboard Display
As a user,
I want to view a personalized dashboard with key metrics, progress visualizations, and a weekly review summary,
So that I can monitor my performance and understand my progress over time.

**Acceptance Criteria:**
Given I have completed at least one workout and logged data
When I navigate to the Dashboard (Flow 14, Screen 1 - `screen_1/code.html`)
Then I can see key stats like total volume, intensity, and workout streaks
And I can see "Celebrate Your Wins" for PRs and milestones
And the dashboard contains customizable widgets (though customization implemented in Flow 14, Screen 3 - `screen_3/code.html` is optional for this story)
And I can access a "Weekly Review" (Flow 14, Screen 2 - `screen_2/code.html`) showing trends and AI-generated insights (FR011)
And all displayed data accurately reflects my `WorkoutLogs` (±1% vs golden dataset - `NFR004` & `T4` from PRD)

**Prerequisites:** Story 2.4

**Technical Notes:** Implement frontend UI for Dashboard and Weekly Review based on `ux_design_content` (Flow 14 `code.html` files). Retrieve aggregated data from Supabase `WorkoutLogs` via FastAPI endpoints. Ensure performance metrics for data retrieval (`NFR004`).

### Story 2.6: In-app Reminders & Nudges
As a user,
I want to receive subtle in-app reminders and nudges about my training plan or progress,
So that I stay motivated and consistent.

**Acceptance Criteria:**
Given I have an active training plan
When a specific trigger condition is met (e.g., training day, plan not generated)
Then an in-app reminder (e.g., a banner, a dashboard widget notification) is displayed (e.g., "Time to train!", "Don't forget to generate your plan!")
And these reminders are subtle and non-intrusive (not push notifications in Phase 1)

**Prerequisites:** Story 2.3, 2.5



## Epic 3: Enhanced Experience & Personalization

Integrate Spotify for music, implement the Context Window for AI adaptation, and provide simulated recovery inputs to enrich the user experience and AI intelligence.

### Story 3.1: Spotify Integration & OAuth
As a user,
I want to securely connect my Spotify account to the app,
So that I can enable AI-powered music features for my workouts.

**Acceptance Criteria:**
Given I am on the Spotify Connection Explainer screen (Flow 3, Screen 1 - `screen_1/code.html`)
When I tap `[ Connect with Spotify ]`
Then I am redirected to the Spotify OAuth (PKCE) consent screen
And after granting permissions (user-read-playback-state, user-modify-playback-state, user-read-recently-played)
Then I am redirected back to the app, and the connection status is confirmed (Flow 3, Screen 3 - `screen_3/code.html`)
And Spotify tokens are securely stored in the `Integrations` database table

**Prerequisites:** Story 1.1, 1.2

**Technical Notes:** Implement frontend UI for Spotify connection flow as per `ux_design_content` (Flow 3, Screen 1 & 3). Implement backend API endpoint (`/music/connect/spotify`) to handle Spotify PKCE OAuth callback and token storage in Supabase `Integrations` table.

### Story 3.2: AI-Driven Session Mix Generation
As a user with a connected Spotify account,
I want the AI to generate personalized, phase-aligned workout playlists ("Session Mix"),
So that my music enhances my training experience.

**Acceptance Criteria:**
Given I have a connected Spotify account (Story 3.1) and an active workout plan
When I initiate "Generate Session Mix" (Flow 11, Screen 1 - `screen_1/code.html`)
Then I can select the mix type (e.g., Warm-up only, Full Session)
And the AI Music Scorer (backend) generates a playlist based on BPM, audio features, listening history, and user feedback
And I am presented with a "Session Mix Preview & Customization" screen (Flow 11, Screen 2 - `screen_2/code.html`)
And I can seed the mix with artists/genres, and review/customize individual tracks
And a custom playlist is created in my Spotify account (private or public)

**Prerequisites:** Story 2.1, 3.1

**Technical Notes:** Implement frontend UI for Session Mix generation and preview (Flow 11, Screen 1 & 2). Implement backend API endpoints (`/music/recently-played`, `/music/audio-features`, `/music/create-playlist`) to interact with Spotify API. Develop AI Music Scorer logic in FastAPI to rank tracks and generate playlists. Store music preferences in `MusicPreferences` table.

### Story 3.3: In-Workout Music Playback & Controls
As a user,
I want to control music playback and receive visual feedback on BPM matching during my workout,
So that I can maintain focus and optimize my performance.

**Acceptance Criteria:**
Given I have an active workout session and a generated Session Mix (Story 3.2)
When I am in the Workout Player (Flow 9, with conceptual integration from Flow 11, Screen 3)
Then music playback controls (play/pause, skip, volume) are available and functional
And I can see visual feedback on BPM matching for the current workout phase (e.g., a gauge or text)
And user interactions (skips, completions) are logged to refine future AI scoring

**Prerequisites:** Story 2.4, 3.2

**Technical Notes:** Integrate Spotify Web Playback SDK or equivalent for in-app controls. Implement UI overlays for music controls and BPM feedback in the Workout Player. Implement backend API endpoint (`/music/play`, `/music/pause`, (`/music/feedback`) to log music interactions.

## Epic 4: User Control & Settings

Develop a comprehensive settings page to give users full control over their preferences, privacy, and account management.

### Story 4.1: Main Settings Menu & Navigation
As a user,
I want to access a comprehensive settings menu with categorized options and a search function,
So that I can easily find and manage my app preferences.

**Acceptance Criteria:**
Given I am a logged-in user
When I navigate to the main Settings menu (Flow 18, Screen 1 - `general/code.html`)
Then I am presented with categorized settings options (e.g., General, Appearance, Performance & Data, Privacy & Account)
And I can use a search bar to quickly find specific settings
And tapping on a category navigates me to its respective sub-screen

**Prerequisites:** Story 1.2

**Technical Notes:** Implement frontend UI for the main settings menu and its navigation as per `ux_design_content` (Flow 18, Screen 1). Use a client-side filtering mechanism for the search bar.

### Story 4.2: Performance & Data Settings
As a user,
I want to manage offline mode and data synchronization settings,
So that I can control my app's behavior in various network conditions and manage local data.

**Acceptance Criteria:**
Given I am in the "Performance & Data" settings sub-screen (Flow 17, Screen 1 - `screen_1/code.html`)
When I toggle "Offline Mode"
Then the app switches between online and offline functionality, caching daily plans and logs locally
When I toggle "Auto-Sync Offline Data"
Then offline logs are automatically synced upon reconnection or require manual initiation
When I tap `[ Clear Local Cache ]`
Then a confirmation modal appears, and upon confirmation, local cached data is removed
And an offline status indicator is displayed in the main app UI when offline (Flow 17, Screen 2 - `screen_2/code.html`)
And a "Sync Now" button/prompt appears when connection is restored and unsynced data exists (Flow 17, Screen 2 & 3 - `screen_2/code.html` & `screen_3/code.html`)

**Prerequisites:** Story 2.4, 4.1

**Technical Notes:** Implement frontend UI for settings based on `ux_design_content` (Flow 17, Screen 1-4). Implement client-side local storage (IndexedDB or similar) for offline caching of plans and logs. Develop logic for network detection and data synchronization with FastAPI `/logs` endpoint.

### Story 4.3: Privacy & Account Management
As a user,
I want full control over my privacy settings, including data export and account deletion,
So that I can manage my personal information in compliance with GDPR.

**Acceptance Criteria:**
Given I am in the "Privacy & Account" settings sub-screen (Flow 18, Screen 5 - `privacy/code.html`)
When I tap `[ Export My Data ]`
Then I am taken to the "Export Data Information & Request" screen (Flow 15, Screen 1 - `screen_1/code.html`)
And I can request a GDPR-compliant export of my data, receiving confirmation and a timeline for delivery (Flow 15, Screen 2 - `screen_2/code.html`)
When I tap `[ Delete My Account ]`
Then I am presented with warnings and required to confirm deletion with explicit user input (Flow 16, Screen 1 & 2 - `screen_1/code.html` & `screen_2/code.html`)
And upon confirmation, my account and all associated data are permanently removed as per GDPR (Flow 16, Screen 3 & 4 - `screen_3/code.html` & `screen_4/code.html`)
When I tap `[ Logout ]`
Then I am securely logged out of the application

**Prerequisites:** Story 1.2, 4.1

**Technical Notes:** Implement frontend UI for privacy and account settings based on `ux_design_content` (Flow 15, Flow 16, Flow 18 `code.html` files). Implement backend API endpoints for data export (`/export`) and account deletion (`/auth/user`), ensuring GDPR compliance (`NFR002`, `NFR010`). Integrate with Supabase for data deletion and token invalidation.

### Story 4.4: General & Appearance Settings
As a user,
I want to customize general application preferences like language and appearance (theme, accent color, font size),
So that I can personalize my app experience.

**Acceptance Criteria:**
Given I am in the "General" settings sub-screen (Flow 18, Screen 2 - `genreralsettings/code.html`)
When I select a different language or toggle notification preferences
Then the changes are applied to the app
Given I am in the "Appearance" settings sub-screen (Flow 18, Screen 3 - `apperance/code.html`)
When I select a theme (light/dark/system), accent color, or adjust font size
Then these changes are immediately reflected in a live preview and applied to the app's UI

**Prerequisites:** Story 4.1

**Technical Notes:** Implement frontend UI for general and appearance settings based on `ux_design_content` (Flow 18, Screen 2 & 3). Use client-side state management (Zustand) for theme, language, and font preferences. Persist these settings in `Users` table or local storage.

### Story 4.5: AI & Personalization Settings
As a user,
I want to understand and manage how the AI learns from my interactions, including viewing and resetting learned preferences and constraints,
So that I have transparent control over my personalized experience.

**Acceptance Criteria:**
Given I am in the "AI & Personalization" settings sub-screen (Flow 18, Screen 4 - `ai/code.html`)
When I view "Learned Preferences" and "Learned Constraints"
Then I can see a list of rules the AI has developed based on my feedback
When I tap `[ Edit ]` or `[ Delete ]` on a specific preference/constraint
Then I can modify or remove that learning rule
When I tap `[ Reset All AI Learning ]`
Then a confirmation modal appears, and upon confirmation, all learned AI preferences and constraints are cleared

**Prerequisites:** Story 2.1, 4.1

**Technical Notes:** Implement frontend UI for AI & Personalization settings based on `ux_design_content` (Flow 18, Screen 4). Implement backend API endpoints to store, retrieve, and reset AI learned preferences (e.g., in a `UserPreferences` table or `Users` metadata column). Ensure robust handling of deleting AI memory.



---

## FR Coverage Matrix

| Functional Requirement | Epic | Stories |
| :--------------------- | :--- | :------ |
| FR001: Conversational Onboarding & Goal Setting | Epic 1 | 1.3 |
| FR002: AI Daily-Plan Generator (adapts to user context) | Epic 2 | 2.1, 2.3 |
| FR003: Workout Player with logging (reps, weight, RPE) | Epic 2 | 2.4 |
| FR004: Progress Dashboard (volume, streaks, basic stats) | Epic 2 | 2.5 |
| FR005: Authentication (OAuth for Google, Email) | Epic 1 | 1.2 |
| FR006: In-app Reminders & Nudges | Epic 2 | 2.6 |
| FR007: Offline Cache for the daily workout plan and logs | Epic 4 | 4.2 |
| FR008: Spotify Integration (PKCE OAuth, playback control, BPM-matched Session Mix v1) | Epic 3 | 3.1, 3.2, 3.3 |
| FR009: Context Window for manual user input (energy, mood, soreness) | Epic 2 | 2.2 |
| FR010: Simulated Recovery Inputs to validate adaptive AI logic | Epic 2 | 2.1 |
| FR011: Weekly Review Ritual (automated progress summary) | Epic 2 | 2.5 |
| FR012: Settings page | Epic 4 | 4.1, 4.2, 4.3, 4.4, 4.5 |
| FR013: User Profile Management | Epic 1 | 1.4 |

---

## Summary

This document outlines the breakdown of the AI-Powered Personal Training Advisor into four major epics:

*   **Epic 1: Core Platform & User Foundation:** Focuses on project setup, user authentication, onboarding, and basic profile management.
*   **Epic 2: AI-Powered Training & Logging:** Covers AI plan generation, contextual inputs, workout execution, logging, and dashboard display.
*   **Epic 3: Enhanced Experience & Personalization:** Integrates Spotify for music, AI-driven session mixes, and in-workout music controls.
*   **Epic 4: User Control & Settings:** Encompasses all user settings, including privacy, account management, offline mode, and personalization.

All Functional Requirements from the Product Requirements Document (PRD) have been mapped to specific epics and stories, ensuring comprehensive coverage and a clear path for implementation. The stories are designed to be vertically sliced, deliver incremental user value, and are sufficiently detailed for autonomous development.

---

_For implementation: Use the `create-story` workflow to generate individual story implementation plans from this epic breakdown._

_This document will be updated after UX Design and Architecture workflows to incorporate interaction details and technical decisions._
