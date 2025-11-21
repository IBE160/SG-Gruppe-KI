# ibe160 - Epic Breakdown

**Author:** BIP
**Date:** 2025-11-21
**Project Level:** {{project_level}}
**Target Scale:** {{target_scale}}

---

## Overview

This document provides the complete epic and story breakdown for ibe160, decomposing the requirements from the [PRD](./PRD.md) into implementable stories.

**Living Document Notice:** This is the initial version. It will be updated after UX Design and Architecture workflows add interaction and technical details to stories.

**Workflow Mode:** CREATE
**Available Context:**
- PRD (required)
- Architecture (will incorporate technical decisions)

### Proposed Epic Structure

**Epic 1: Core Platform & User Foundation**
*   **Goal:** Establish the foundational infrastructure, user authentication, and conversational onboarding to enable basic user interaction and personalization.
*   **High-level scope:** User registration, login, profile management, and initial goal setting through an AI-guided conversation.

**Epic 2: AI-Powered Training & Logging**
*   **Goal:** Implement the core AI daily plan generation, workout player, and progress tracking to deliver personalized and adaptive training experiences.
*   **High-level scope:** AI plan generation based on user context, workout execution with logging capabilities, progress visualization, and integration of recovery signals.

**Epic 3: Enhanced User Experience & Settings**
*   **Goal:** Integrate Spotify for music, provide in-app reminders and offline capabilities, and offer comprehensive settings for user control.
*   **High-level scope:** Spotify integration for music playback, notifications, offline data caching, and a full-featured settings page for personalization and privacy.

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

**Epic 1: Core Platform & User Foundation**
*   FR001: Conversational Onboarding & Goal Setting
*   FR005: Authentication (OAuth for Google, Email)
*   FR013: User Profile Management (view/edit profile info, goals, equipment).

**Epic 2: AI-Powered Training & Logging**
*   FR002: AI Daily-Plan Generator (adapts to user context)
*   FR003: Workout Player with logging (reps, weight, RPE)
*   FR004: Progress Dashboard (volume, streaks, basic stats)
*   FR009: Context Window for manual user input (energy, mood, soreness)
*   FR010: Simulated Recovery Inputs to validate adaptive AI logic
*   FR011: Weekly Review Ritual (automated progress summary)

**Epic 3: Enhanced User Experience & Settings**
*   FR006: In-app Reminders & Nudges
*   FR007: Offline Cache for the daily workout plan and logs
*   FR008: Spotify Integration (PKCE OAuth, playback control, BPM-matched Session Mix v1)
*   FR012: Settings page with General, Appearance, Performance & Data, Music & Playback, AI & Personalization, Privacy & Account settings.

---

## Epic 1: Core Platform & User Foundation

**Goal:** Establish the foundational infrastructure, user authentication, and conversational onboarding to enable basic user interaction and personalization.

### Story 1.1: Project Initialization and Setup

As a Developer,
I want to initialize the project with Next.js, FastAPI, and Supabase,
So that we have a foundational structure for development.

**Acceptance Criteria:**

**Given** the project structure is defined in rchitecture.md
**When** the initialization commands are run
**Then** a Next.js frontend, a FastAPI backend, and a Supabase project are created and connected.
**And** the project is structured as a monorepo.

**Prerequisites:** None.

**Technical Notes:** Follow the Project Initialization section in rchitecture.md. Includes setting up .env files and basic configurations.

### Story 1.2: User Authentication with Email/Password

As a User,
I want to be able to sign up and log in with my email and password,
So that I can have a secure personal account.

**Acceptance Criteria:**

**Given** a user is on the login/signup page
**When** they enter a valid email and password and click "Sign Up"
**Then** a new user is created in the Supabase users table.
**And** they are automatically logged in.
**Given** a registered user is on the login page
**When** they enter their correct email and password and click "Log In"
**Then** they are successfully authenticated.

**Prerequisites:** Story 1.1.

**Technical Notes:** Use Supabase Auth for email/password authentication. Implement the UI for signup and login forms.

### Story 1.3: User Authentication with Google OAuth

As a User,
I want to be able to sign up and log in with my Google account,
So that I can have a quick and easy authentication experience.

**Acceptance Criteria:**

**Given** a user is on the login/signup page
**When** they click "Continue with Google"
**Then** they are redirected to Google's OAuth flow.
**And** upon successful authentication, they are redirected back to the app and are logged in.

**Prerequisites:** Story 1.1.

**Technical Notes:** Configure Google as an OAuth provider in Supabase. Implement the "Continue with Google" button and handle the OAuth callback.

### Story 1.4: Conversational Onboarding for Goal Setting

As a new User,
I want to be guided through a conversational onboarding process,
So that I can set up my initial fitness goals, preferences, and available equipment.

**Acceptance Criteria:**

**Given** a new user logs in for the first time
**When** they are redirected to the onboarding flow
**Then** they are presented with a series of questions about their goals, time availability, equipment, injuries, and preferred units.
**And** their responses are saved to their user profile in the users table.

**Prerequisites:** Story 1.2 or 1.3.

**Technical Notes:** Implement a multi-step conversational UI for onboarding. Store the collected data in the users table (goals, preferences, equipment, injuries, units columns).

### Story 1.5: User Profile Management

As a User,
I want to be able to view and edit my profile information, goals, and equipment,
So that I can keep my personal details up to date.

**Acceptance Criteria:**

**Given** an authenticated user
**When** they navigate to their profile page
**Then** they can see their current profile information, goals, and equipment.
**And** they can edit these details and save the changes.

**Prerequisites:** Story 1.4.

**Technical Notes:** Create a profile page that displays user data from the users table. Implement a form to allow users to update their information.
## Epic 2: AI-Powered Training & Logging

**Goal:** Implement the core AI daily plan generation, workout player, and progress tracking to deliver personalized and adaptive training experiences.

### Story 2.1: Context Window for Daily Input

As a User,
I want to provide daily context on my mood, energy, and soreness,
So that the AI can adapt my workout plan for the day.

**Acceptance Criteria:**

**Given** an authenticated user on the dashboard
**When** they open the "Context Window"
**Then** they can input their mood, energy level, and any muscle soreness.
**And** this data is saved to the daily_contexts table for the current date.

**Prerequisites:** Epic 1.

**Technical Notes:** Implement a UI for the Context Window. This could be a modal or a dedicated section on the dashboard.

### Story 2.2: AI Daily Plan Generation

As a User,
I want the AI to generate a personalized daily workout plan based on my goals, profile, and daily context,
So that I have a clear plan to follow.

**Acceptance Criteria:**

**Given** a user has provided their daily context
**When** they request a new plan for the day
**Then** the FastAPI backend constructs a prompt with the user's profile, daily context, and recent workout history.
**And** the AI returns a valid JSON workout plan which is then saved to the workout_plans table.

**Prerequisites:** Story 2.1.

**Technical Notes:** Implement the FastAPI endpoint for AI plan generation. This involves fetching data from Supabase, interacting with the OpenAI API, and validating the response.

### Story 2.3: Display Daily Workout Plan

As a User,
I want to see my generated daily workout plan on the dashboard,
So that I can review it and start my workout.

**Acceptance Criteria:**

**Given** a workout plan has been generated for the day
**When** the user views their dashboard
**Then** the workout plan is displayed in a clear and easy-to-understand format.

**Prerequisites:** Story 2.2.

**Technical Notes:** The frontend should fetch the daily plan from the backend and render it.

### Story 2.4: Workout Player UI

As a User,
I want a workout player interface that guides me through my workout,
So that I can focus on my exercises.

**Acceptance Criteria:**

**Given** a user starts a workout
**When** the workout player is launched
**Then** it displays the current exercise, set number, target reps/weight, and a timer for rest periods.

**Prerequisites:** Story 2.3.

**Technical Notes:** Create the UI for the workout player, which will be a stateful component managing the workout flow.

### Story 2.5: Workout Logging

As a User,
I want to log my completed reps, weight, and RPE for each set,
So that my progress can be tracked.

**Acceptance Criteria:**

**Given** a user is in the workout player
**When** they complete a set
**Then** they can input the reps, weight, and RPE.
**And** this data is saved to the workout_logs table.

**Prerequisites:** Story 2.4.

**Technical Notes:** Implement the functionality to save workout log entries to the database via the FastAPI backend.

### Story 2.6: Basic Progress Dashboard

As a User,
I want to see a progress dashboard with my workout volume, streaks, and basic stats,
So that I can track my performance over time.

**Acceptance Criteria:**

**Given** a user has completed one or more workouts
**When** they view their progress dashboard
**Then** they can see visualizations of their total workout volume, workout streak, and other basic metrics.

**Prerequisites:** Story 2.5.

**Technical Notes:** Create a dashboard page that fetches data from workout_logs and displays it in charts and graphs.

### Story 2.7: Simulated Recovery Inputs

As a Developer,
I want to be able to input simulated recovery data (HRV, sleep),
So that I can validate the AI's ability to adapt plans based on recovery metrics.

**Acceptance Criteria:**

**Given** the AI plan generation endpoint
**When** simulated recovery data is included in the prompt
**Then** the generated workout plan is adjusted accordingly (e.g., lower volume for poor recovery).

**Prerequisites:** Story 2.2.

**Technical Notes:** This is a developer-facing story. The FastAPI backend should be able to accept and use simulated recovery data in its prompts to OpenAI.

### Story 2.8: Weekly Review Ritual

As a User,
I want to receive an automated weekly summary of my progress,
So that I can stay motivated and see my achievements.

**Acceptance Criteria:**

**Given** a user has completed workouts during the week
**When** the week ends
**Then** an automated summary is generated showing their progress, PRs, and other highlights.

**Prerequisites:** Story 2.6.

**Technical Notes:** This can be implemented as a scheduled background job (e.g., using Celery) that generates the summary and stores it for the user to view.
## Epic 3: Enhanced User Experience & Settings

**Goal:** Integrate Spotify for music, provide in-app reminders and offline capabilities, and offer comprehensive settings for user control.

### Story 3.1: Spotify Account Connection

As a User,
I want to securely connect my Spotify account,
So that the application can access my playback controls and listening history.

**Acceptance Criteria:**

**Given** a user is in the settings or onboarding flow
**When** they click "Connect Spotify"
**Then** they are redirected to Spotify's OAuth (PKCE) consent screen.
**And** upon successful authorization, their access and refresh tokens are securely stored in the spotify_integrations table.

**Prerequisites:** Epic 1.

**Technical Notes:** Implement the PKCE OAuth flow for Spotify. Handle token storage and refresh using the FastAPI backend.

### Story 3.2: Spotify Playback Control in Workout Player

As a User,
I want to control Spotify music playback (play, pause, skip) directly from the workout player,
So that I can manage my music without leaving the workout.

**Acceptance Criteria:**

**Given** a connected Spotify account and an active workout
**When** the user is in the workout player
**Then** they see controls to play, pause, and skip tracks.
**And** these controls successfully interact with Spotify playback.

**Prerequisites:** Story 3.1, Epic 2.4 (Workout Player UI).

**Technical Notes:** Integrate the Spotify Web Playback SDK into the frontend. Use the FastAPI backend to relay playback commands to Spotify's API.

### Story 3.3: BPM-Matched Session Mix Generation

As a User,
I want the AI to generate a Spotify playlist with BPM-matched music for my workout,
So that my music aligns with the intensity of my training phases.

**Acceptance Criteria:**

**Given** a connected Spotify account and a generated workout plan
**When** the user requests a "Session Mix"
**Then** the AI analyzes their listening history and track BPMs.
**And** a new Spotify playlist is created and populated with BPM-matched tracks according to the workout phases.

**Prerequisites:** Story 3.1, Story 2.2 (AI Daily Plan Generation).

**Technical Notes:** FastAPI backend uses Spotify Web API for audio analysis (BPM) and playlist creation. This data can be cached in workout_music_sessions.

### Story 3.4: In-App Reminders and Nudges

As a User,
I want to receive timely in-app reminders and nudges,
So that I stay consistent with my training and goals.

**Acceptance Criteria:**

**Given** a user has enabled reminders
**When** it's time for a scheduled workout or other event
**Then** an in-app notification or message appears, reminding them.

**Prerequisites:** Epic 1.

**Technical Notes:** Implement a notification system within the frontend. Use background jobs (e.g., Celery) to trigger reminders.

### Story 3.5: Offline Cache for Daily Plans and Logs

As a User,
I want to access my daily workout plan and log my progress even when offline,
So that my training is not interrupted by connectivity issues.

**Acceptance Criteria:**

**Given** a user has loaded their daily plan while online
**When** they go offline
**Then** they can still view their daily plan and log sets.
**And** logged data is stored locally and synced to the backend upon reconnection.

**Prerequisites:** Epic 2.2 (AI Daily Plan Generation), Epic 2.5 (Workout Logging).

**Technical Notes:** Implement IndexedDB for local caching and an Outbox Pattern for syncing data when online.

### Story 3.6: Comprehensive Settings Page

As a User,
I want a comprehensive settings page to manage my general preferences, appearance, music, AI personalization, privacy, and account,
So that I have full control over my app experience.

**Acceptance Criteria:**

**Given** an authenticated user
**When** they navigate to the settings page
**Then** they can view and modify various categories of settings (General, Appearance, Performance & Data, Music & Playback, AI & Personalization, Privacy & Account).
**And** changes are persisted in the user_settings table.

**Prerequisites:** Epic 1.

**Technical Notes:** Design a multi-section settings UI. Implement CRUD operations for the user_settings table.
<!-- End epic repeat -->

## Epic {{N}}: {{epic_title_N}}

{{epic_goal_N}}

<!-- Repeat for each story (M = 1, 2, 3...) within epic N -->

### Story {{N}}.{{M}}: {{story_title_N_M}}

As a {{user_type}},
I want {{capability}},
So that {{value_benefit}}.

**Acceptance Criteria:**

**Given** {{precondition}}
**When** {{action}}
**Then** **expected_outcome**

**And** {{additional_criteria}}

**Prerequisites:** {{dependencies_on_previous_stories}}

**Technical Notes:** {{implementation_guidance}}

<!-- End story repeat -->

---

<!-- End epic repeat -->

---

## FR Coverage Matrix

| FR ID | Description | Epic | Story(s) |
|---|---|---|---|
| FR001 | Conversational Onboarding & Goal Setting | Epic 1 | 1.4 |
| FR002 | AI Daily-Plan Generator (adapts to user context) | Epic 2 | 2.2 |
| FR003 | Workout Player with logging (reps, weight, RPE) | Epic 2 | 2.4, 2.5 |
| FR004 | Progress Dashboard (volume, streaks, basic stats) | Epic 2 | 2.6 |
| FR005 | Authentication (OAuth for Google, Email) | Epic 1 | 1.2, 1.3 |
| FR006 | In-app Reminders & Nudges | Epic 3 | 3.4 |
| FR007 | Offline Cache for the daily workout plan and logs | Epic 3 | 3.5 |
| FR008 | Spotify Integration (PKCE OAuth, playback control, BPM-matched Session Mix v1) | Epic 3 | 3.1, 3.2, 3.3 |
| FR009 | Context Window for manual user input (energy, mood, soreness) | Epic 2 | 2.1 |
| FR010 | Simulated Recovery Inputs to validate adaptive AI logic | Epic 2 | 2.7 |
| FR011 | Weekly Review Ritual (automated progress summary) | Epic 2 | 2.8 |
| FR012 | Settings page with General, Appearance, Performance & Data, Music & Playback, AI & Personalization, Privacy & Account settings. | Epic 3 | 3.6 |
| FR013 | User Profile Management (view/edit profile info, goals, equipment). | Epic 1 | 1.5 |

---

## Summary

This document outlines the initial epic and story breakdown for the ibe160 project. The functional requirements from the Product Requirements Document (PRD) have been mapped to three core epics, each delivering distinct user value:

*   **Epic 1: Core Platform & User Foundation:** Focuses on establishing the foundational infrastructure, user authentication, and initial conversational onboarding.
*   **Epic 2: AI-Powered Training & Logging:** Concentrates on the core AI-driven plan generation, workout execution, logging, and progress tracking.
*   **Epic 3: Enhanced User Experience & Settings:** Integrates Spotify for music, provides in-app reminders and offline capabilities, and offers comprehensive user settings.

All functional requirements have been covered, and stories have been designed to be vertically sliced, independently valuable where possible, and sized for single-session developer completion. The breakdown also incorporates technical notes and prerequisites to guide implementation.

---

_For implementation: Use the `create-story` workflow to generate individual story implementation plans from this epic breakdown._

_This document will be updated after UX Design and Architecture workflows to incorporate interaction details and technical decisions._




