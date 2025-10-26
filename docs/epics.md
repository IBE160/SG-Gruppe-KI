# AI-Powered Personal Training Advisor - Epic Breakdown

**Author:** BMad Product Manager
**Date:** 26.10.2025
**Project Level:** 3
**Target Scale:** Enterprise

---

## Overview

This document provides the detailed epic breakdown for the AI-Powered Personal Training Advisor, expanding on the high-level epic list in the [PRD](./PRD.md).

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

## Epic 1: Foundation and User Onboarding

**Goal:** Establish the project foundation, including the database schema, authentication, and a conversational onboarding experience.

**Story 1.1: Set up project structure and database schema.**

As a developer,
I want to set up the initial project structure and database schema,
So that we have a foundation to build upon.

**Acceptance Criteria:**
1. The repository is created on GitHub.
2. The database schema is defined and created in Supabase.
3. The project includes a README file with setup instructions.

**Prerequisites:** None

**Story 1.2: Implement user authentication with email and password.**

As a user,
I want to be able to create an account and log in with my email and password,
So that I can access the application.

**Acceptance Criteria:**
1. Users can register for a new account with a unique email and password.
2. Users can log in with their registered email and password.
3. Passwords are securely hashed and stored.

**Prerequisites:** Story 1.1

**Story 1.3: Implement Google OAuth.**

As a user,
I want to be able to sign up and log in with my Google account,
So that I can have a faster and more convenient authentication experience.

**Acceptance Criteria:**
1. Users can authenticate with their Google account.
2. A new user account is created if the user doesn't exist.
3. The user is logged in upon successful authentication.

**Prerequisites:** Story 1.1

**Story 1.4: Implement Apple OAuth.**

As a user,
I want to be able to sign up and log in with my Apple ID,
So that I can have a faster and more convenient authentication experience.

**Acceptance Criteria:**
1. Users can authenticate with their Apple ID.
2. A new user account is created if the user doesn't exist.
3. The user is logged in upon successful authentication.

**Prerequisites:** Story 1.1

**Story 1.5: Create the conversational onboarding flow.**

As a new user,
I want to be guided through a conversational onboarding process,
So that I can set up my profile and goals easily.

**Acceptance Criteria:**
1. The onboarding flow collects the user's goals, available equipment, and preferences.
2. The onboarding process feels like a conversation with an AI assistant.
3. The user's profile is updated with the collected information.

## Epic 2: Core Workout Experience

**Goal:** Implement the core workout experience, including AI plan generation, the workout player, and progress logging.

**Story 2.1: Implement AI plan generation.**

As a user,
I want to receive a personalized workout plan from the AI,
So that I can have a structured and effective workout.

**Acceptance Criteria:**
1. The system can send a request to the OpenAI API with the user's profile and context.
2. The system receives a structured JSON workout plan from the AI.
3. The workout plan is saved to the database.

**Prerequisites:** Story 1.5

**Story 2.2: Create the workout player UI.**

As a user,
I want to have a clear and intuitive workout player,
So that I can easily follow the workout.

**Acceptance Criteria:**
1. The workout player displays the current exercise, sets, reps, and weight.
2. The workout player includes a timer for rest periods.
3. The UI is clean and easy to navigate.

**Prerequisites:** Story 2.1

**Story 2.3: Implement workout logging.**

As a user,
I want to be able to log my workout progress,
So that I can track my performance over time.

**Acceptance Criteria:**
1. Users can log the reps, weight, and RPE for each set.
2. The logged data is saved to the database.
3. The UI for logging is simple and efficient.

**Prerequisites:** Story 2.2

**Story 2.4: Implement the progress dashboard.**

As a user,
I want to see my workout history and progress on a dashboard,
So that I can stay motivated and track my improvement.

**Acceptance Criteria:**
1. The dashboard displays key metrics like volume, intensity, and streaks.
2. The dashboard shows a summary of recent workouts.
3. The data on the dashboard is accurate and up-to-date.

**Prerequisites:** Story 2.3

**Story 2.5: Implement in-app reminders.**

As a user,
I want to receive in-app reminders for my workouts,
So that I can stay on track with my training schedule.

**Acceptance Criteria:**
1. The system can schedule and display in-app reminders.
2. Users can customize their reminder preferences.

**Prerequisites:** Story 1.2

**Story 2.6: Implement offline caching for the daily plan.**

As a user,
I want to be able to access my daily workout plan even when I'm offline,
So that I can train anywhere.

**Acceptance Criteria:**
1. The current day's workout plan is cached locally on the device.
2. The cached plan is available when the user is offline.

**Prerequisites:** Story 2.1

**Story 2.7: Implement offline logging and sync.**

As a user,
I want to be able to log my workout progress even when I'm offline,
So that I don't lose my data.

**Acceptance Criteria:**
1. Workout logs can be created and updated while offline.
2. The offline logs are automatically synced to the server when the connection is restored.

**Prerequisites:** Story 2.3, 2.6

**Story 2.8: Implement AI fallback mechanism.**

As a user,
I want to have a backup workout plan if the AI is unavailable,
So that I can still train.

**Acceptance Criteria:**
1. If the AI fails to generate a plan, the system loads a cached workout from the user's history.
2. The user is notified that a fallback plan is being used.

## Epic 3: Music and Context

**Goal:** Integrate Spotify for music, create the context window for user input, and enable the AI to adapt to user feedback.

**Story 3.1: Implement Spotify authentication.**

As a user,
I want to connect my Spotify account to the app,
So that I can listen to music during my workouts.

**Acceptance Criteria:**
1. Users can authenticate with their Spotify account using OAuth.
2. The access and refresh tokens are securely stored.
3. The user's profile shows the connection status.

**Prerequisites:** Story 1.2

**Story 3.2: Implement music playback control.**

As a user,
I want to be able to control the music playback within the app,
So that I don't have to switch between apps during my workout.

**Acceptance Criteria:**
1. The app can play, pause, and skip tracks.
2. The currently playing track is displayed in the UI.
3. The playback controls are easily accessible during a workout.

**Prerequisites:** Story 3.1

**Story 3.3: Implement BPM-matched session mixes.**

As a user,
I want the app to create a playlist for my workout with songs that match the intensity of my training,
So that I can stay motivated and energized.

**Acceptance Criteria:**
1. The system can generate a Spotify playlist with tracks that have a BPM appropriate for the workout phase.
2. The playlist is saved to the user's Spotify account.
3. The user can choose to use the generated playlist for their workout.

**Prerequisites:** Story 3.1

**Story 3.4: Create the context window UI.**

As a user,
I want to be able to provide feedback to the AI about my energy levels, mood, and sleep,
So that the AI can adjust my workout plan accordingly.

**Acceptance Criteria:**
1. The context window provides a free-text input for users to enter their feedback.
2. The UI is simple and easy to use.

**Prerequisites:** Story 2.1

**Story 3.5: Implement AI adaptation to user context.**

As a developer,
I want the AI to be able to understand and adapt to the user's context,
So that the workout plans are truly personalized.

**Acceptance Criteria:**
1. The user's context is sent to the AI along with the profile information.
2. The AI adjusts the workout plan based on the user's context.
3. The changes in the workout plan are communicated to the user.

**Prerequisites:** Story 3.4

**Story 3.6: Implement simulated recovery inputs.**

As a developer,
I want to be able to test the AI's adaptive logic with simulated recovery data,
So that I can validate the feature before integrating with real wearables.

**Acceptance Criteria:**
1. The system can accept simulated HRV and sleep data.
2. The AI adjusts the workout plan based on the simulated data.
3. The adjustments are consistent with the expected behavior.

## Epic 4: Dashboard and Settings

**Goal:** Build the user dashboard for progress tracking and the settings page for user control and personalization.

**Story 4.1: Design the user dashboard.**

As a user,
I want to have a clear and informative dashboard,
So that I can easily track my progress and see my workout history.

**Acceptance Criteria:**
1. The dashboard design is clean and modern.
2. The dashboard displays key metrics in an easy-to-understand format.
3. The design is responsive and works well on different screen sizes.

**Prerequisites:** Story 2.4

**Story 4.2: Implement the settings page UI.**

As a user,
I want to have a settings page where I can manage my preferences and integrations,
So that I can have control over my experience.

**Acceptance Criteria:**
1. The settings page is well-organized and easy to navigate.
2. The UI elements are intuitive and user-friendly.
3. The design is consistent with the rest of the application.

**Prerequisites:** Story 1.2

**Story 4.3: Implement general settings.**

As a user,
I want to be able to change general settings like language, units, and theme,
So that I can customize the app to my liking.

**Acceptance Criteria:**
1. Users can change the display language of the app.
2. Users can switch between metric and imperial units.
3. Users can choose between a light, dark, or system default theme.

**Prerequisites:** Story 4.2

**Story 4.4: Implement music and playback settings.**

As a user,
I want to be able to manage my music and playback settings,
So that I can control how music is integrated into my workouts.

**Acceptance Criteria:**
1. Users can connect, reconnect, or disconnect their Spotify account.
2. Users can enable or disable the session mix feature.
3. Users can enable or disable BPM matching for workout phases.

**Prerequisites:** Story 3.1, 4.2

**Story 4.5: Implement AI and personalization settings.**

As a user,
I want to have control over the AI's learned preferences and constraints,
So that I can ensure the AI is working for me.

**Acceptance Criteria:**
1. Users can view a list of the AI's learned preferences and constraints.
2. Users can edit or delete learned preferences and constraints.
3. Users can clear the AI's memory to start fresh.

**Prerequisites:** Story 3.5, 4.2

**Story 4.6: Implement privacy and account settings.**

As a user,
I want to be able to manage my privacy and account settings,
So that I can have control over my data.

**Acceptance Criteria:**
1. Users can manage their consent settings for analytics and AI permissions.
2. Users can revoke integrations with third-party services.
3. Users can export their data or delete their account.

**Prerequisites:** Story 1.2, 4.2

---
