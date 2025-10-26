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

The MVP will be a web-first application focused on delivering a highly interactive and personalized training experience.

*   **Conversational Onboarding:** A chatbot-like setup process that gathers user goals, equipment, and preferences through an engaging dialogue.
*   **Adaptive Dialogue & Context Window:** The core feature where users provide daily context (mood, energy). The AI proposes workout changes with clear reasoning, and users can accept, decline, or provide further feedback, creating a collaborative planning experience.
*   **"Smart Radio" Music Integration:** An adaptive music experience for Spotify that learns implicitly from user skips during different workout phases to constantly improve playlist personalization. For non-premium users, the app will use track skips as an implicit feedback mechanism for the AI and provide symbols for users to give explicit feedback on whether a track matches the workout intensity.
*   **AI Personalization Settings:** A dedicated settings page where users can view and manage the AI's learned preferences and constraints, ensuring transparency and control.
*   **Data Privacy and User Control:** Wearable data sharing will be optional, with transparency in the settings page about what data the AI is using. Data will be anonymized where possible.
*   **Resilient AI:** If the AI is unavailable, the app will fall back to a cached workout from the user's history (e.g., last push/pull workout) and allow manual edits.
*   **Core Workout Tools:** Includes a workout player with timers and logging (sets, reps, RPE), a progress dashboard, and offline caching for the daily plan and logs.

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
