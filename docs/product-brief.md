# Product Brief: AI-Powered Personal Training Advisor

## 1. Problem & Background

Many individuals struggle with workout consistency due to a lack of clear plans, motivation, and integrated tools. Existing fitness apps are often fragmented, separating training, music, and coaching, which hinders long-term habit formation.

## 2. Purpose & Goal

To develop an AI-assisted training companion that provides adaptive daily workout plans, integrated music, and motivational support to help users achieve their fitness goals efficiently and build lasting consistency.

## 3. Target Users

*   **Beginners:** Seeking safe, structured, day-by-day guidance.
*   **Experienced Trainees:** Needing tools for progression control and periodization.
*   **Busy Individuals:** Requiring efficient and flexible workout options.
*   **Recreational Athletes:** Looking for data-driven insights.

## 4. Core Functionality (Phase 1 MVP)

The MVP will be a web-first application with the following key features:

*   **Conversational Onboarding:** An interactive setup process to gather user goals, equipment, and preferences.
*   **AI Daily Plan Generator:** Generates personalized, adaptive workout plans based on user input.
*   **Context Window:** A core feature allowing users to provide daily context (mood, energy, sleep) via free-text and emoticons. The AI provides transparent feedback and learns from user choices.
*   **Workout Player:** Guides the user through their daily workout with timers and logging for sets, reps, and RPE.
*   **"Smart Radio" Music Integration:** An adaptive music experience that learns implicitly from user skips to create personalized Spotify playlists that match the workout's intensity.
*   **Progress Dashboard:** Tracks key metrics like volume, intensity, and streaks.
*   **Offline Caching:** Ensures the daily workout and logging are available without an internet connection.
*   **AI Personalization Settings:** A dedicated settings page where users can view and manage the AI's learned preferences.

## 5. Technology Stack (Phase 1)

*   **Frontend:** Next.js (App Router) + TypeScript + Tailwind CSS
*   **Backend:** FastAPI (Python)
*   **AI Engine:** OpenAI API (GPT)
*   **Music Integration:** Spotify Web API
*   **Database:** PostgreSQL (Supabase)
*   **Authentication:** Supabase (OAuth for Google/Apple, Email/Password)

## 6. Success Metrics (Phase 1)

*   **Onboarding Completion:** ≥ 80% of users complete onboarding.
*   **User Engagement:** ≥ 60% of active users log at least 3 sessions per week.
*   **AI Plan Latency:** p95 latency of ≤ 10 seconds for plan generation.
*   **Context Window Usage:** ≥ 50% of weekly active users interact with the context window.
*   **Spotify Connection:** ≥ 40% of users connect their Spotify account.
