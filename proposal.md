# 💪 Case Title
AI-Powered Personal Training Advisor

---

## 🧩 Background
Many people struggle to stay consistent with training because they lack a clear daily plan, motivation, and seamless tools.  
Existing apps often separate training, music, coaching, and community — making it difficult to build long-term habits.

This project aims to solve that by creating an **AI-assisted training companion** that combines personalized guidance, habit support, **music integration**, and a seamless user experience.

---

## 🎯 Purpose
Develop a personal training app that generates **adaptive daily plans with AI**, including:
- Training and recovery tips  
- Motivation and music playback  
- Wearable syncing  
- Progress tracking  

The goal is efficient progress and lasting consistency.

---

## 👥 Target Users
- **Beginners** – safe, structured day-by-day guidance  
- **Experienced trainees** – progression control and periodization  
- **Busy individuals** – efficient, flexible workouts  
- **Recreational athletes** – data-driven insights through wearables and music feedback  

---

## ⚙️ Core Functionality

### 🧱 Must-Have (MVP)
1. **Onboarding & Goals**
   - Goals, available time/equipment, injuries, preferences  
2. **AI Daily-Plan Generator**
   - OpenAI API → structured JSON workout plan  
3. **Workout Player**
   - Timers, cues, logging (reps/weight/RPE)  
4. **Progress Dashboard**
   - Volume, intensity, streaks, progress tracking  
5. **Authentication & Security**
   - OAuth 2.0 (Google/Email), GDPR compliance  
6. **Reminders & Nudges**
   - Push notifications and daily summaries  
7. **Offline Cache**
   - Local storage of today’s workout  
8. **Music Integration (Spotify)**
   - PKCE OAuth, playback control, BPM-matched playlists  
   - Analyzes “Recently Played” to learn preferences  
9. **Wearable Sync**
   - Apple Health, Google Fit, Garmin, Polar, Fitbit  
   - Sync workouts, HR/HRV/sleep for adaptive plans  
   - Match music data to workout sessions  
   **Live Heart Rate Broadcast (BLE)** – Connect directly to a heart rate sensor/watch in real time without using a cloud API, enabling live display and coaching cues during the workout.
10. **Context Window**
    - Free-text box for today’s focus, energy, mood, BPM, etc.  
    - Automatically structured and used to guide AI and music selection  
11. **Apple Health (iOS) via HealthKit**  
    - A lightweight iOS companion app reads user-authorized HealthKit data (workouts, heart rate, HRV, sleep) and syncs deltas to our backend using anchored queries and background delivery.

---

### 💡 Nice-to-Have   
- Camera-based form guidance  
- Event-based periodization  
- Safety prompts for health alerts
- During an active workout, if live heart rate is available, AI can trigger short guidance cues when the user exceeds certain thresholds (e.g., "Reduce pace by 10% for 60s").

---

## ⚙️ Settings Page (New Feature)

A dedicated **Settings page** gives users full control over personal preferences, health integrations, and interface behavior.

### 🧭 General
- **Language:** English / Norwegian / Spanish / German  
- **Units:** Kilograms (kg) / Pounds (lbs)  
- **Measurement System:** Metric / Imperial  
- **Time Format:** 12-hour / 24-hour  

### 🎨 Appearance
- **Theme Mode:** Light / Dark / System Default  
- **Accent Color:** Select from preset palette  
- **Font Size:** Small / Medium / Large  
- **Animations:** Enable / disable UI motion effects  

### ⚡ Performance & Data
- **Data Sync Frequency:** Realtime / Daily / Manual  
- **Offline Mode:** Enable caching of workouts and logs  
- **Clear Local Cache:** Button to reset stored data  

### ❤️ Health & Wearables
**Available integrations (toggle per source):**
- **Apple Health (iOS / Apple Watch)** — via companion app + HealthKit  
- **Samsung Health (via Health Connect on Android)**  
- **Google Fit (Android)**  
- **Fitbit**  
- **Garmin Connect**  
- **Polar Flow**

**Per-integration options (displayed when enabled):**
- **Data Types:** Workouts / Heart Rate / HRV / Sleep  
- **Sync Mode:** Background (recommended) / Manual Pull  
- **Backfill Range:** 7 / 30 / 90 days  
- **Last Sync:** <timestamp>  **[Sync now]**  

**Apple Health (extra visibility when on iOS):**
- Permission status per category  
- Background Delivery: On / Off  
- Manage in Health app: [Open permissions]  

**Health Connect (Android):**
- Shows granted permissions  
- Link to system-level Health Connect permissions  

### 📡 Live Heart Rate (Workout)
- **Live HR (BLE):** On / Off  
- **HR Source Preference:** Auto (Wearable) / BLE Broadcast  
- **Broadcast Timeout:** 5–120 min (default 60)  
- **AI Live Coaching:** On / Off  *(real-time cues when HR thresholds are exceeded)*

### 🎵 Music & Playback
- **Spotify Connection:** Connect / Reconnect / Disconnect  
- **Use Session Mix:** On / Off  
- **BPM Matching by Workout Phase:** On / Off  

### 🔒 Privacy & Account
- **Consent Settings:** Manage analytics and AI permissions  
- **Revoke Integrations:** Spotify / Apple Health / Health Connect / Google Fit / Fitbit / Garmin / Polar  
- **Data Export:** Download workout + health data (JSON/CSV)  
- **Delete Account:** Full GDPR-compliant account removal  
  
---

## 🧱 Technology Stack

| Layer | Technology | Notes |
|------|------------|-------|
| **Frontend (Web)** | Next.js (App Router) + TypeScript + Tailwind CSS | Responsive, SSR, RSC-based UI |
| **Mobile (Companion App)** | Swift (iOS / watchOS) via HealthKit | Apple Health sync (Phase 1) |
| **Mobile (Full App)** | React Native / Swift + Kotlin | **Phase 2** – native workout player + BLE |
| **Backend API** | FastAPI (Python) | Async, REST, AI orchestration |
| **Database** | PostgreSQL (Supabase) | Users, plans, logs, integrations |
| **Authentication** | Supabase | OAuth (Google, Apple), Email/Password, JWT |
| **Wearables (Cloud Integrations)** | Google Fit, Fitbit, Garmin, Polar | **Phase 2** – deep cloud sync |
| **Device Health (Local Sync)** | Apple Health (HealthKit), Android Health Connect | Phase 1 (Apple/Samsung) |
| **Live HR Streaming** | Web Bluetooth (BLE Heart Rate Service) | Phase 1 (web); native UX in Phase 2 |
| **AI Engine** | OpenAI API (GPT) | Structured plan + music scoring |
| **Music Intelligence** | Spotify Web API | Session Mix (BPM + history) |
| **Storage** | Supabase Storage / Amazon S3 | Progress photos, logs, exports |
| **Notifications** | OneSignal / Firebase Cloud Messaging | **Phase 2** |
| **Hosting** | Vercel (Frontend) + Fly.io / Render (Backend) | CDN + containers |
| **Analytics (Optional)** | Plausible / PostHog | Anonymous usage |

---

## 🧠 AI Implementation

The AI engine continuously adapts workout and music generation based on user history, physiological signals, and session context.

### 🗂 Input Fusion
The daily plan prompt is generated from a dynamic context that includes:
- **User profile** (goals, experience level, equipment, preferences)
- **Recent session performance** (last 3 workouts, RPE trends, fatigue scores)
- **Wearable insights** (HR/HRV, sleep duration/stages, recovery estimates)
- **Manual context inputs** (mood, energy level, focus tags)
- **Music preference history** (tracks previously used/enjoyed during workouts)

### 📤 AI Output
- Structured JSON training plan split into phases (e.g., Warm-up → Main Sets → Intervals → Cooldown)
- Estimated RPE per set + adaptive intensity guidance
- Suggested duration and pacing cues
- Optional recommended BPM profile for music phases

### 📈 Adaptive Logic
- Adjusts training volume ±10% based on previous RPE and session strain
- Reduces intensity for low HRV or insufficient sleep
- Elevates load when progress is consistent and recovery is high

### 🎵 AI-Driven Music Matching
- Pulls candidate tracks from *Recently Played*, prioritizing songs used in past workouts
- Scores tracks based on BPM fit, energy level, phase relevance, historical skips/completions
- Uses Spotify audio features (BPM, energy, danceability) and genres
- Backfills using recommendations when insufficient phase-fitting tracks exist

**BPM intensity mapping (default):**
| Phase      | Target BPM |
|-----------|------------|
| Warm-up    | 100–120 BPM |
| Main phase | 130–160 BPM |
| Intervals  | 160–180 BPM |
| Cooldown   | 80–100 BPM  |

### 📡 Real-Time Adaptation (Optional)
- If live heart rate (BLE) is enabled, the AI may trigger micro-coaching prompts:
  - *“You're over target HR — reduce pace 10% for 60s”*
  - *“You're under target — increase intensity slightly”*

### 🛡️ Resilience & Fallback
- If AI fails, system loads cached plan (valid for 24 hours)
- Simple rule-based templates available as a backup
- AI adjustments logged over time for progressive refinement

---

## 🗂️ Data Model (ERD)

- **Users** – id, name, email, units  
- **Goals** – goal, equipment, injuries  
- **WorkoutPlans** – plan_json, model, cache  
- **WorkoutLogs** – workout data and RPE  
- **Integrations** – Spotify, Google Fit, Garmin, etc.  
- **MusicPreferences** – playlists, BPM profile, phase_bpm_overrides_json, artist_caps, repeat_window  
- **MusicHistory** — id, user_id, track_id, played_at, bpm, audio_features_json, phase_tag, skip, play_ms  
- **SessionPlaylists** — id, user_id, workout_id, playlist_id, mode, tracks_json, created_at  
- **ContextEntries** – free text and structured JSON  
- **WorkoutSync** – wearable data  
- **AppleHealthSyncAnchors** – user_id, type, anchor_token, updated_at  
- **AppleHealthSamples** – id, user_id, type, start_at, end_at, value_json, source_bundle_id, uuid, created_at

Sensitive data is encrypted (tokens, HRV, photos).

---

## 🔌 API (FastAPI) — Overview

### Auth
| Method | Endpoint                | Purpose                           |
|-------:|-------------------------|-----------------------------------|
| POST   | /auth/register          | Email + password sign-up          |
| POST   | /auth/login             | Email + password sign-in          |
| POST   | /auth/oauth/google      | Google OAuth callback              |
| POST   | /auth/oauth/apple       | Apple OAuth callback               |
| POST   | /auth/verify            | Verify email (if applicable)       |
| POST   | /auth/forgot-password   | Start password reset               |
| POST   | /auth/reset-password    | Complete password reset            |
| DELETE | /auth/user              | GDPR account deletion              |

### Plans & Logs
| Method | Endpoint                | Purpose                           |
|-------:|-------------------------|-----------------------------------|
| POST   | /plans/generate         | Generate AI daily plan            |
| GET    | /plans/{planId}         | Fetch plan by id                  |
| POST   | /logs                   | Append set/rep/RPE to active log  |
| PATCH  | /workouts/{id}          | Edit synced/completed workout     |

### Context
| Method | Endpoint                | Purpose                           |
|-------:|-------------------------|-----------------------------------|
| POST   | /context                | Upsert today’s context            |
| GET    | /context/current        | Get current context snapshot      |
| DELETE | /context/{id}           | Delete a context entry            |

### Music (Spotify)
| Method | Endpoint                | Purpose                                        |
|-------:|-------------------------|------------------------------------------------|
| POST   | /music/connect/spotify  | Connect via OAuth (PKCE)                       |
| GET    | /music/recently-played  | Listening history for BPM/seed                 |
| GET    | /music/devices          | Available playback devices                     |
| POST   | /music/create-playlist  | Create Session Mix playlist                    |
| POST   | /music/play             | Start/resume playback                          |
| POST   | /music/pause            | Pause playback                                 |
| GET    | /music/status           | Current playback status                        |
| POST   | /music/feedback         | Capture in-session actions (skip/like/complete) |

### Wearables & Health (Cloud)
| Method | Endpoint                | Purpose                           |
|-------:|-------------------------|-----------------------------------|
| POST   | /wearables/sync         | Sync Strava/Fit/Garmin/Polar/etc. |
| GET    | /wearables/workouts     | Aggregated workouts for dashboard |

### Apple Health (iOS)
| Method | Endpoint                      | Purpose                                   |
|-------:|--------------------------------|-------------------------------------------|
| POST   | /apple-health/sync/start       | Get anchors + signed session token        |
| POST   | /apple-health/sync/upload      | Upload batched samples (JSON)             |
| POST   | /apple-health/sync/finish      | Finalize sync window                       |
| GET    | /apple-health/export           | (Optional) export Apple Health samples     |

### Health Connect (Android)
| Method | Endpoint                      | Purpose                                   |
|-------:|--------------------------------|-------------------------------------------|
| POST   | /health-connect/sync/start     | Begin anchored sync window                 |
| POST   | /health-connect/sync/upload    | Upload batched samples                     |
| POST   | /health-connect/sync/finish    | Finish window                              |

### Live Heart Rate (BLE)
| Method | Endpoint  | Purpose                                |
|-------:|-----------|----------------------------------------|
| POST   | /live/hr  | Batch log live HR to current session   |

### Settings & Export
| Method | Endpoint                   | Purpose                                  |
|-------:|----------------------------|------------------------------------------|
| PATCH  | /settings/user/{id}        | Persist user preferences/toggles         |
| GET    | /export                    | Generate signed URL for GDPR data export |


---

## 🧩 UX Spec — Context Window

- **Placement:** sticky, collapsible panel  
- **Chips:** quick tags (*cutting*, *deload*, *posterior chain*)  
- **Parsing:** client hints + LLM structuring  
- **Scope:** session / week / always  
- **Privacy:** user controls data retention and deletion  

---

## ♿ Accessibility & Compliance
- WCAG 2.1 AA  
- GDPR: consent, token deletion, data retention limits  
- No medical diagnostics  
- Full user control over context data  

---

## User Flows

---

### ✅ Flow 1 – Account Creation & Authentication (Google • Apple • Email)

**Trigger:**  
User opens the app for the first time or returns after logging out.

**Steps:**  
1. User selects **“Sign In / Continue.”**  
2. User is presented with multiple authentication options:
   - **Continue with Google (OAuth)**
   - **Continue with Apple (OAuth)**
   - **Sign in with Email & Password**
   - **Create Account (Email & Password)**
3. If the user selects Google or Apple, an OAuth flow is initiated → on success, user is authenticated.
4. If the user selects “Create Account”, they register using email + password → system sends an optional verification email.
5. Upon successful login or registration, backend checks whether this is a first-time user.
6. If **new user** → a new entry is created in `Users` with fields such as `provider` (`google`, `apple`, or `password`).
7. If **returning user** → existing profile is retrieved.
8. First-time users are redirected to **Onboarding**; returning users go directly to the **Dashboard**.

**APIs & Data:**  
- `POST /auth/register` – Create account (Email + Password)  
- `POST /auth/login` – Manual sign-in  
- `POST /auth/oauth/google` – Google OAuth callback  
- `POST /auth/oauth/apple` – Apple OAuth callback  
- `POST /auth/verify` – Email verification (if required)

**Users table fields updated/created:**  
`id`, `email`, `provider('google'|'apple'|'password')`, `email_verified_at`, `createdAt`, `metadata`

**Success Outcome:**  
✅ User is authenticated and redirected either to Onboarding (first-time) or Dashboard (returning).

**Failure / Fallback:**  
❌ Invalid email/password → error message displayed  
❌ Canceled OAuth flow → user returns to login screen  
❌ Unverified email (manual accounts) → prompt to verify or resend link  
❌ Network failure → retry or fallback to cached session (if available)

---

### ✅ Flow 2 – Goal & Preference Setup (Onboarding Continuation)

**Trigger:**  
Immediately after first authentication or when user re-enters onboarding.

**Steps:**  
1. User selects training goal (e.g., Strength / Fat Loss / Endurance).  
2. User chooses available training time per week and session length.  
3. User selects available equipment (e.g., bodyweight, dumbbells, full gym).  
4. User indicates any injuries or limitations.  
5. User sets unit system (kg/lbs, metric/imperial).  
6. User confirms setup and proceeds to optional integrations.

**APIs & Data:**  
- Stores data in `Goals`: `goal`, `equipment`, `injuries`, `frequency`  
- Updates `Users` with units & measurement system

**Success Outcome:**  
✅ AI has contextual info to generate personalized plans.

**Failure / Fallback:**  
❌ Missing required fields → user prompted to complete.  
❌ User skips setup → defaults applied (may reduce accuracy).

---

### ✅ Flow 3 – Connect Spotify (Optional Music Integration)

**Trigger:**  
User clicks **“Connect Spotify”** during onboarding or later in **Settings → Music & Playback**.

**Steps:**  
1. App redirects the user to Spotify OAuth (PKCE) consent screen.  
2. User grants permissions for:
   - Playback control  
   - Device access  
   - Listening history (“Recently Played”)  
3. After approval, Spotify redirects back with an authorization code.  
4. Backend exchanges the code for an access token + refresh token.  
5. Tokens are securely encrypted and stored in `Integrations`.  
6. App confirms connection status with a success state: **“Spotify connected”**.  
7. Optional: User can now enable features such as:
   - Session Mix (AI-generated workout playlists)  
   - BPM-based music matching per workout phase  
   - Auto-playback within Workout Player  

**APIs & Data:**  
- `POST /music/connect/spotify` (OAuth callback handling)  
- Spotify scopes requested:
  - `user-read-playback-state`  
  - `user-modify-playback-state`  
  - `user-read-recently-played`  
- Stored in `Integrations(spotify_token, refresh_token, expires_at)`  
- Music preferences stored in `MusicPreferences` (e.g., BPM profile)

**Success Outcome:**  
✅ Personalized playlist generation, BPM analysis, and in-app playback become available for workouts.

**Failure / Fallback:**  
❌ User cancels → music features remain disabled.  
❌ Token expires → app automatically refreshes or prompts user to reconnect.  
❌ No active playback device → user is prompted to open Spotify on a device.  

---

### ✅ Flow 4 – Connect Health Apps & Wearables (Optional Sync)

**Trigger:**  
User taps **“Connect Health/Wearables”** during onboarding or in **Settings**.

**Options shown (cards/toggles):**  
- **Apple Health (iOS / Apple Watch)**  
- **Samsung Health (via Health Connect on Android)**  
- **Google Fit (Android)**  
- **Fitbit**  
- **Garmin Connect**  
- **Polar Flow**  
- **Live Heart Rate (BLE broadcast)** — optional, for real-time coaching

**Steps:**  
1) User selects one or more sources to connect.  
2) Platform flow starts:  
   - **Apple Health (iOS):** Opens companion app → requests HealthKit permissions (Workouts, Heart Rate, HRV, Sleep).  
   - **Samsung Health (Android):** Connect via **Health Connect** permissions.  
   - **Google Fit:** OAuth consent.  
   - **Fitbit / Garmin / Polar:** OAuth consent on provider site.  
3) Backend receives and securely stores tokens/anchors in `Integrations` (and `AppleHealthSyncAnchors` for Apple).  
4) User chooses **Data Types** (Workouts / HR / HRV / Sleep) and **Backfill Range** (7/30/90 days).  
5) Initial sync kicks off:  
   - Cloud sources (Fitbit/Garmin/Polar/Google Fit): `POST /wearables/sync` (with backfill window).  
   - Apple Health (iOS): companion app runs anchored queries → `POST /apple-health/sync/start` → `.../upload` (batched samples) → `.../finish`.  
6) Synced sessions and metrics appear in **Dashboard** and inform AI planning.

**APIs & Data:**  
- `POST /wearables/sync` (Fitbit/Garmin/Polar/Google Fit/Health Connect)  
- `POST /apple-health/sync/start` → `/upload` → `/finish` (HealthKit anchored sync)  
- `GET /wearables/workouts` (aggregated view)  
- Tables:  
  - `Integrations` (fitbit_token, garmin_token, polar_token, google_fit_token, health_connect_grants, apple_companion_session, expires_at)  
  - `WorkoutSync` (normalized workouts)  
  - `AppleHealthSyncAnchors` (per-type anchors)  
  - `AppleHealthSamples` (typed samples: HR, HRV, Sleep, Workouts)

**Live HR (BLE):**  
- User can toggle **Live Heart Rate (BLE)** during a workout: scans for heart_rate service → live BPM at ≥1 Hz.  
- Optional: AI real-time cues when thresholds are exceeded (e.g., “Reduce pace by 10% for 60s”).  
- Data can be buffered and linked to the active `WorkoutLogs` entry.

**Settings (per source):**  
- **Sync Mode:** Background (recommended) / Manual pull  
- **Data Types:** Workouts / Heart Rate / HRV / Sleep  
- **Backfill Range:** 7 / 30 / 90 days  
- **Data Sync Frequency:** Realtime / Daily / Manual  
- **Apple Health Sync:** On/Off (per-type toggles)  
- **Live HR (BLE):** On/Off, **HR Source Preference:** Auto (Wearable) / BLE

**Success Outcome:**  
✅ Past workouts and health metrics are synced; AI uses HR/HRV/Sleep to bias daily plans.

**Failure / Fallback:**  
❌ User skips → app relies on AI-only plans (manual logs).  
❌ OAuth/permission error or rate limit → queued retries, user prompt to reconnect.  
❌ iOS background delivery delay → manual “Sync now” available.  
❌ BLE not supported/unavailable → continue without live HR.

**Privacy & Security:**  
- Explicit consent screens per source and data type.  
- Token encryption at rest; revocation via **Revoke Integrations** in Settings.  
- GDPR-compliant export/delete (affects synced health data as well).

---

### ✅ Flow 5 – Connect Apple Health (iOS via HealthKit & Apple Watch)

**Trigger:**  
User enables **“Apple Health Sync”** during onboarding or under **Settings → Health & Wearables → Apple Health (iOS)**.

**Requirements:**  
- User has iPhone with Health app  
- (Optional) Apple Watch paired for workout and HR data  

**Steps:**  
1. User installs or opens the iOS companion app.  
2. User taps **“Enable Apple Health Sync”**, triggering the HealthKit permission sheet.  
3. The app requests read access to selected data types:
   - Workouts  
   - Heart Rate  
   - HRV (Heart Rate Variability)  
   - Sleep  
4. User approves permissions.  
5. App calls `POST /apple-health/sync/start` to retrieve:
   - A secure session token  
   - Per-datatype sync anchors (for incremental sync)  
6. Initial sync is performed using anchored HealthKit queries:
   - Time range determined by user-selected **Backfill Range** (7 / 30 / 90 days)
7. Data is uploaded in batches via `POST /apple-health/sync/upload`.  
8. When completed, app calls `POST /apple-health/sync/finish`.  
9. HealthKit **Background Delivery** is enabled to automatically sync new data when available.  
10. Synced workouts and health metrics appear in Dashboard and inform AI plan adjustments.

**APIs & Data:**  
- `POST /apple-health/sync/start`  
- `POST /apple-health/sync/upload`  
- `POST /apple-health/sync/finish`  
- Tables updated:  
  - `AppleHealthSyncAnchors` (stores per-type anchor tokens)  
  - `AppleHealthSamples` (raw HR, HRV, sleep, workout details)  
  - `WorkoutSync` (normalized workouts merged for session history)

**Success Outcome:**  
✅ Apple Health workouts, HR, HRV, and sleep data are synced and used to personalize future AI training plans (e.g., lower volume after poor sleep/HRV).

**Failure / Fallback:**  
❌ User denies permissions → Apple Health remains disabled.  
❌ HealthKit background delivery unavailable → user may trigger manual sync from Settings.  
❌ Sync failure or network drop → sync is retried or user is notified to retry manually.  

---

### ✅ Flow 6 – Generate AI Daily Plan

**Trigger:**  
User opens Dashboard and taps “Generate Today’s Plan” (or it's auto-generated each morning if enabled).

**Steps:**  
1. Context Window opens with mood, sleep, energy, goal tags.  
2. User selects or types current feeling (e.g., “low energy, slept 5h”).  
3. Backend sends prompt to AI using profile + last sessions + wearable insights.  
4. AI generates structured training plan (JSON with sets/phases).  
5. Plan is displayed; user reviews and confirms.  
6. Plan is stored as today’s workout schedule.

**APIs & Data:**  
- `POST /plans/generate`  
- Data used: `Goals`, `WorkoutLogs`, `WearableSync`, `ContextEntries`

**Success Outcome:**  
✅ Personalized workout plan becomes available in Workout Player.

**Failure / Fallback:**  
❌ AI request timeout → cached plan used or AI retry suggested.

---

### ✅ Flow 7 – Start Workout (Using AI Plan or Synced Plan)

**Trigger:**  
User taps “Start Workout” from dashboard or specific plan card.

**Steps:**  
1. Workout Player loads plan (sets, reps, RPE targets).  
2. Timer and active exercise section appear.  
3. User may optionally connect live HR (BLE) at this stage.  
4. System prepares session log entry in `WorkoutLogs`.  
5. Timer starts and first set is ready for logging.

**APIs & Data:**  
- Initializes a new `WorkoutLogs` entry  
- References `WorkoutPlans(plan_json)`

**Success Outcome:**  
✅ Workout session is now active; logging and cues begin.

**Failure / Fallback:**  
❌ Missing plan → user can load previous/cached plan or create manual session.

---

### ✅ Flow 8 – Connect Live Heart Rate (BLE Broadcast)

**Trigger:**  
User taps **“Connect Heart Rate”** inside the Workout Player (optional feature).

**Requirements:**  
- A Bluetooth Low Energy (BLE) heart rate broadcasting device (e.g., Apple Watch in broadcast mode, Garmin / Polar / Fitbit watches with HR broadcast support, dedicated HR straps such as Polar H10 or Garmin HRM-Pro).  
- Browser or client must support Web Bluetooth (or native BLE on iOS/Android in future native app).

**Steps:**  
1. User taps **“Connect Heart Rate”** in the Workout Player.  
2. The app initiates a device scan for BLE devices exposing the standard **heart_rate** service.  
3. User selects their device from the list (e.g., Garmin, Polar, Apple Watch in broadcast mode).  
4. A live BPM stream begins, typically with a refresh frequency of ≥1 Hz.  
5. Heart rate is displayed in real time, including visualized zones/intensity markers.  
6. If **AI Live Coaching** is enabled, the system evaluates HR against thresholds and may trigger real-time cues such as:
   - *“Heart rate is too high – reduce pace for 60s”*
   - *“You’re below target zone – increase effort slightly”*
7. Live HR data may be buffered and stored as part of the active session in `WorkoutLogs` or associated with a specific entry.

**APIs & Data:**  
- Live BLE communication via Web Bluetooth (client-side)  
- Optional: `POST /live/hr` for batching HR logging linked to a session  
- Data stored under:
  - `WorkoutLogs` (session HR trace)
  - or appended to `AppleHealthSamples` (if unified HR sample storage is used)

**Success Outcome:**  
✅ User receives continuous heart rate feedback during the workout, optionally enhanced by real-time AI coaching for optimal pacing or safety.

**Failure / Fallback:**  
❌ BLE not supported on the device/browser → user is informed and may proceed without HR.  
❌ Device not detected or not broadcasting → user is prompted to retry or check device settings.  
❌ Connection drops mid-session → app offers auto-reconnect or “Continue without HR” option.

---

### ✅ Flow 9 – Perform & Log Workout

**Trigger:**  
User is inside Workout Player and begins progressing through exercises.

**Steps:**  
1. User performs first set and inputs reps / weight / RPE (or selects “Completed”).  
2. Timer advances to rest period, showing countdown.  
3. User proceeds set by set through each exercise phase.  
4. Plan can be modified mid-workout (e.g., change reps or swap exercise).  
5. All performance data is recorded incrementally.  
6. HR data (if connected via BLE or wearable sync) is optionally displayed and stored.

**APIs & Data:**  
- `POST /logs` (append reps/sets/RPE data)  
- `PATCH /workouts/:id` (plan adjustment/versioning)  
- `WorkoutLogs` row updated per set

**Success Outcome:**  
✅ Logs accurately track performance; user reaches final phase.

**Failure / Fallback:**  
❌ Local device offline → logs cached locally and synced when online.

---

### ✅ Flow 10 – Finish Workout & AI Feedback

**Trigger:**  
User taps “Finish Session” in Workout Player.

**Steps:**  
1. App summarizes session metrics (volume, time, PRs, avg HR, zone time).  
2. User rates perceived fatigue or confirms final RPE.  
3. System calculates progression indicators.  
4. AI generates post-session feedback (optional) – “Coach summary” or suggestions for next session.  
5. Final log is stored and locked unless edited manually afterward.

**APIs & Data:**  
- Logs are finalized in `WorkoutLogs`  
- AI micro-feedback may call a secondary AI prompt  
- Optional: store `ai_recommendations`

**Success Outcome:**  
✅ Workout session is marked complete; AI insights are displayed.

**Failure / Fallback:**  
❌ AI feedback fails → show local summary only; user may retry later.

---

### ✅ Flow 11 – Generate Session Mix (Optional AI-Based Playlist)

**Trigger:**  
After confirming the AI-generated workout plan or at the end of a session, the user taps **“Generate Session Mix”** (available only if Spotify is connected).

**Steps:**  
1. User selects a playlist mode:
   - **Warm-up only**
   - **Full session (phased by plan)**
   - **Recovery / cooldown**
2. App extracts target BPM ranges per workout phase (e.g., Warm-up: 100–120 BPM, Main: 130–160 BPM, Intervals: 160–180 BPM, Cooldown: 80–100 BPM).
3. System retrieves the user’s **recent listening history**, prioritizing tracks previously played during workouts (if such data exists).
4. AI ranks tracks based on:
   - BPM proximity to phase intensity
   - Energy/danceability scores (from Spotify audio features)
   - Whether the track has previously been played during similar phases
   - User engagement signals (e.g., skipped vs listened fully)
   - Recency and variety (avoid excessive repetition)
5. If track coverage is insufficient for a phase, Spotify recommendations are used as fallback, guided by BPM, top artists, and preferred genres.
6. A custom playlist is generated, saved to the user’s Spotify account (private or public based on preference), and optionally named using session metadata (e.g., “Leg Day Power Mix”).
7. In-app playback controls are enabled (Play / Pause / Next / Device selection).
8. User interactions (skip/complete/like) may be logged to refine future AI scoring.

**APIs & Data:**  
- `GET /music/recently-played` (fetches history for candidate songs)  
- `GET /music/audio-features?ids=...` (to evaluate BPM/energy)  
- `GET /music/devices`  
- `POST /music/create-playlist`  
- `POST /music/play`, `POST /music/pause`  
- `POST /music/feedback` (store skip/like/complete for ranking model)  
- Internal logs stored in `MusicPreferences` and/or `SessionPlaylists`

**Success Outcome:**  
✅ A personalized playlist is generated that feels familiar, energizing, and phase-aligned with the specific workout intensity, improving user motivation and flow.

**Failure / Fallback:**  
❌ User does not have Spotify Premium → playback unavailable; playlist may still be saved to their library.  
❌ No matching tracks found → fallback curated BPM-based pool is used.  
❌ No available playback device → user is prompted to open Spotify on a device.


### ✅ Flow 12 – Sync Wearable & Health Data (Strava / Google Fit / Apple Health / Health Connect)

**Trigger:**  
Occurs automatically in the background at intervals defined in Settings, or manually when the user taps **“Sync Now”** under **Settings → Health & Wearables**.

**Steps:**  
1. System checks which integrations are currently enabled:
   - Cloud-based: Strava, Google Fit, Fitbit, Garmin, Polar  
   - Local device-based (iOS): Apple Health (via HealthKit)  
   - Local device-based (Android): Samsung Health / Google Fit via Health Connect  
2. For cloud-based platforms (Strava, Fit, Garmin, etc.):  
   - System requests new workouts and metrics since the last sync.  
3. For Apple Health (HealthKit):  
   - iOS companion app triggers background delivery or scheduled sync using anchored queries.  
4. Health data (workouts, HR, HRV, sleep, calories) is normalized and mapped to internal schema.  
5. Workouts are merged into `WorkoutSync` and linked to planned sessions when applicable.  
6. HR/HRV/Sleep metrics are stored (e.g., in `AppleHealthSamples` or equivalent tables).
7. AI planning engine incorporates new recovery and training load data (e.g., reduce next day’s volume after poor sleep/HRV).

**APIs & Data:**  
- `POST /wearables/sync` (Strava / Google Fit / Fitbit / Garmin / Polar / Health Connect)  
- `POST /apple-health/sync/upload` (HealthKit batched sync)  
- Database tables updated:
  - `WorkoutSync` (workout sessions)
  - `AppleHealthSamples` (raw HR/HRV/sleep)
  - `AppleHealthSyncAnchors` (HealthKit sync anchor states)

**Success Outcome:**  
✅ Dashboard and AI-planned workouts reflect the latest activity load and recovery status, enhancing personalization.

**Failure / Fallback:**  
❌ Platform-specific rate limit → sync is rescheduled or queued.  
❌ Offline or connectivity loss → sync is retried when connection is restored.  
❌ Workout misalignment or duplicate detection issues → flagged for user review or manual correction (see Flow 13).


---

### ✅ Flow 13 – Edit Synced or Completed Workout

**Trigger:**  
User opens a synced workout (from Strava/Apple Health) or a completed session from the history view and selects “Edit”.

**Steps:**  
1. User reviews workout details (type, duration, intensity, HR data).  
2. User may correct exercise names, reps, sets, or RPE.  
3. User confirms or discards edits.  
4. System versions the workout log (keeps both original + edited version).  
5. Updated values contribute to future AI adaptation.

**APIs & Data:**  
- `PATCH /workouts/:id`  
- Versioning strategy: append revision to `WorkoutLogs` or `WorkoutVersions`

**Success Outcome:**  
✅ Final workout reflects corrected details and impacts future AI plans.

**Failure / Fallback:**  
❌ Conflict (sync triggers during edit) → user prompted to merge.

---

### ✅ Flow 14 – View Dashboard & Weekly Review

**Trigger:**  
User opens Dashboard or navigates to the “Weekly Summary” section.

**Steps:**  
1. Dashboard displays key stats: total volume, average intensity, streak count, HR load.  
2. Recent workouts (manual + synced) are shown with quick insights.  
3. HRV trends and sleep quality are optionally displayed (if wearable data available).  
4. Weekly chart provides progress insights (e.g., volume vs recovery).  
5. Based on trends, system may suggest plan adjustment (“Consider a deload”).

**APIs & Data:**  
- `GET /wearables/workouts`  
- Local aggregated views in database or cached API responses  
- Data from `WorkoutLogs`, `AppleHealthSamples`

**Success Outcome:**  
✅ User understands progress, adherence, and readiness for next plan.

**Failure / Fallback:**  
❌ No data → show motivational empty states or onboarding tips.

---

### ✅ Flow 15 – Export Data (GDPR Compliance)

**Trigger:**  
User navigates to Settings → Privacy & Account → Export Data.

**Steps:**  
1. User requests export of personal training and health data.  
2. System queues an export job.  
3. Backend compiles summary: workouts, wearable metrics, HRV trends, session feedback.  
4. File is generated (JSON/CSV) and hosted securely (expiring link).  
5. User receives link via in-app notification or email.

**APIs & Data:**  
- `GET /context`, `GET /wearables/workouts`, `GET /apple-health/export` (if applied)  
- Export stored temporarily in S3/Supabase storage

**Success Outcome:**  
✅ User can download full dataset in machine-readable format.

**Failure / Fallback:**  
❌ Export generation fails → user notified, retry suggested.

---

### ✅ Flow 16 – Delete Account (Full GDPR Removal)

**Trigger:**  
User selects “Delete Account” in Privacy & Account settings.

**Steps:**  
1. System displays warning about permanent data removal.  
2. User confirms twice (to prevent accidental deletion).  
3. All personal data is removed or anonymized (as required by GDPR).  
4. Linked integrations (Spotify, Strava, HealthKit) are revoked.  
5. Account credentials are deprovisioned.  
6. User is logged out and shown completion screen.

**APIs & Data:**  
- `DELETE /auth/user` (if supported by Supabase)  
- Cascade deletes: `Users`, `Goals`, `Logs`, `Integrations`, `AppleHealthSamples`, etc.

**Success Outcome:**  
✅ Account fully removed; user cannot log back in without creating a new account.

**Failure / Fallback:**  
❌ Failure to delete certain data (e.g., third-party constraints) → flagged for admin intervention.

---

### ✅ Flow 17 – Toggle Offline Mode & Resume Sync

**Trigger:**  
User enables Offline Mode in Settings or loses internet connection automatically.

**Steps:**  
1. When offline mode is enabled or connection is lost, app switches to cached mode.  
2. User can still view today’s plan (if preloaded), log workout sets, and track time.  
3. Logs and BLE HR data (if connected) are cached locally.  
4. When internet is restored, app prompts “Sync available changes?”.  
5. Cached logs are synced to backend; plan updates and wearable data can be requested.

**APIs & Data:**  
- Local storage (IndexedDB / AsyncStorage)  
- Pending logs sent via `POST /logs` when back online  
- Optional conflict checks on sync

**Success Outcome:**  
✅ User completes sessions even without a network; data syncs smoothly when reconnected.

**Failure / Fallback:**  
❌ Sync conflicts → user prompted to review differences manually.

---

### ✅ Flow 18 – Change Settings (General, Health, Playback & Privacy)

**Trigger:**  
User navigates to Settings and updates preferences.

**Steps:**  
1. User modifies language, theme, units, HR source (Auto/BLE), Apple Health sync (On/Off), etc.  
2. App applies UI-related changes instantly.  
3. Sync-related changes may require confirmation (e.g., “Disable Apple Health syncing?”).  
4. Updated preferences are saved and applied for all future sessions.  
5. If user changes Broadcast Timeout or Sync frequency → these are reflected in next BLE or HealthKit session.

**APIs & Data:**  
- Updates to `Users` (units, language, appearance)  
- `Integrations` for toggling wearable sources  
- Possibly `PATCH /settings/user/{id}`

**Success Outcome:**  
✅ Preferences are persisted and influence future app behavior, AI prompts, and data processing.

**Failure / Fallback:**  
❌ Invalid setting combination → UI message prevents save until resolved.

---

### ✅ End of User Flows Section

These flows collectively describe the complete end-to-end user experience across onboarding, daily usage, AI-based workout generation, live guidance with wearable integration, data synchronization, and long-term retention, while also covering offline handling, personalization, privacy compliance, and account lifecycle management.

---

## 📊 Success Metrics

| Metric | Target |
|--------|--------|
| Onboarding completion | ≥ 80% under 3 min |
| AI plan latency | ≤ 10 s |
| Sessions logged / week | ≥ 60% log 3+ sessions |
| Dashboard accuracy | ±1% |
| Spotify connection | ≥ 40% |
| Playback success | ≥ 95% |
| Wearable sync | ≥ 90% |
| Context usage | ≥ 50% weekly |
| Playlist relevance | ≥ 4/5 |
| AI uptime | 99% |

---

## 🚦 Development Phases

To ensure a focused and achievable delivery, the project is divided into two main phases:

### ✅ Phase 1 — Web-First MVP (with Health & BLE Support)
**Objective:** Deliver a fully functional web-based AI training assistant with essential integrations and live physiological feedback.

Included:
- Web app (Next.js + FastAPI backend)
- AI workout plan generation
- Workout Player (sets/reps/RPE logging)
- Progress Dashboard (volume, streaks, basic stats)
- Context Window (mood/energy input → AI adaptation)
- Spotify integration (Session Mix based on BPM and listening history)
- **Apple Health sync (via HealthKit companion app)**
- **Samsung Health sync (via Health Connect on Android)**
- **Live Heart Rate via BLE (optional AI pace cues during workouts)**
- GDPR account deletion, privacy preferences
- Basic caching for daily workouts

---

### 📱 Phase 2 — Native Expansion & Advanced Wearable Ecosystem
**Objective:** Extend the platform into a full mobile experience with deeper automation, notifications, native performance, and full wearable coverage.

Planned additions:
- Native iOS & Android apps (React Native or Swift + Kotlin)
- Push notifications (daily plan reminders, habit nudges)
- Full offline workout mode (with local sync + recovery when back online)
- Deep device integrations (Garmin, Fitbit, Polar, Strava, Google Fit cloud sync)
- AI readiness scoring based on weekly HRV, sleep, recovery trends
- Automatic workout detection and post-session analysis
- Advanced Session Mix evolution (emotion/adrenaline curve mapping)
- Apple Watch / Wear OS mini workout controller (start, pause, HR display)
- Background HR streaming + time-in-zone tracking
- Sleep and load analysis with adaptive deload recommendations

---

## 🗓️ Phase 1 – Web-First MVP (6 Weeks)

| Week | Milestones |
|------|------------|
| **1** | Architecture, repository setup, database schema, authentication (Google/Email/Apple), onboarding draft |
| **2** | Full onboarding (goals, equipment, unit system, injuries) + AI workout plan generation pipeline |
| **3** | Workout Player (web) with sets/reps/RPE logging + Context Window integration |
| **4** | Progress Dashboard (volume, intensity, streaks) + Spotify OAuth + Session Mix v1 (BPM-based) |
| **5** | ✅ Apple HealthKit sync (iOS companion MVP) – enables sleep/HRV-driven adaptation |
| **6** | AI adaptive logic validation (using Apple Health or simulated HRV/sleep data, T13) + GDPR account deletion + basic offline caching (plan + logs) + QA & demo |

✅ **Outcome:** A functional web-based AI training assistant with adaptive AI (informed by Apple Health or simulated HRV), music-driven motivation, progress tracking, and offline-safe workout logging.


---

## 📱 Phase 2 – Native App & Advanced Wearable Ecosystem (6–8 Weeks)

| Week | Milestones | Key Deliverables |
|------|------------|------------------|
| **1** | Native mobile app foundation (React Native or Swift/Kotlin) | Auth integration + navigation + offline storage layer |
| **2** | Full offline workout mode | Local plan storage + log syncing with reconciliation |
| **3** | 📡 Live Heart Rate via BLE (Web + Native) | Real-time HR streaming + AI threshold cues |
| **4** | Deep wearable sync | Samsung Health (Health Connect), Garmin, Fitbit, Polar, Strava, Google Fit cloud integrations |
| **5** | AI readiness & recovery intelligence | Load/HRV/sleep-based adjustment of next plans |
| **6** | Apple Watch / Wear OS mini workout companion | Start/pause + HR display + optional HR broadcast fallback |
| **7** *(Optional)* | Performance trends & habit reinforcement | Recovery trends, progression curves, streak reinforcement |
| **8** *(Buffer)* | QA, final polish, App Store / Play Store submission, release candidate |

✅ **Outcome:** Full mobile-first experience with live HR coaching, advanced wearable ecosystem coverage, readiness-based AI adjustments, push-driven engagement, and deep offline capability.

---

### ✅ Phase 1 Acceptance (Web MVP)

T1 – Auth works  
T2 – AI returns valid JSON < 10 s  
T3 – Logs are stored correctly  
T4 – Dashboard shows accurate data  
T5 – Offline mode works (plan + logs cached)  
T6 – Spotify connect OK  
T7 – Playlist per phase (≥95% success)  
T8 – Apple Health sync works (initial + delta) *(or simulated HRV/sleep for fallback validation)*  
T9 – Music analysis works (BPM classification + scoring)  
T10 – Context Window affects plan and music  
T11 – AI adapts based on HRV/sleep signals (validated with Apple Health or simulated data)  

✅ *Passing Phase 1 requires a complete adaptive loop: user context + HRV/sleep → AI-adjusted plan.*

---

### 📱 Phase 2 Acceptance (Native & Wearable Expansion)

T12 – BLE HR connection stable ≥1 Hz for full session  
T13 – Real-time AI cues triggered from live HR thresholds  
T14 – Deep wearable cloud sync works (Garmin / Fitbit / Polar / Strava / Samsung Health)  
T15 – Offline mode fully supported in native apps (sync reconciliation works)  
T16 – Push notifications delivered reliably  
T17 – Mini watch companion app interacts with session state  
T18 – AI readiness score varies based on real wearable trends (HRV/sleep/load-based)  

---

### 🛡️ Resilience & Fallback Strategy (BMAD – Method Compliance)

The system follows an “always runnable” principle: the user must never be blocked from training even if one or more services fail.

For external integrations (AI, Spotify, wearables, BLE, syncing, etc.), we apply this fallback structure:

| Level | Action | Example |
|------|--------|---------|
| 1️⃣ Retry + Timeout | One quick retry within a strict max wait | Fetch AI plan, 8s timeout + 1 retry |
| 2️⃣ Cache | Serve last known-good data (≤24h) | Show yesterday’s plan |
| 3️⃣ Local substitute | Simple rule-based or manual alternative | Default strength session based on user goal |
| 4️⃣ Graceful degrade | Temporarily disable the feature, keep session viable | Music or HR hidden, logging still works |
| 5️⃣ UX information | Mild, non-blocking user notice | “Couldn’t reach the coach — using a safe session instead.” |

This model is applied consistently to all “outer” components:
- 🤖 AI generation → cache → simple rule-based plan  
- 🎵 Spotify → playlist creation only → user controls playback manually  
- 📡 BLE HR → auto-reconnect attempt → continue without HR (RPE-based coaching)  
- ❤️ Health sync → retry → “Sync now” button → plan generated without wearable data  
- 📶 Network → offline queue for logs → auto-sync when back online  
- 🔑 OAuth failure → offline mode + cached data where safe  

**Goal:** The user can *always* train, log, and progress — even when AI, music, or health integrations fail.


---

## ⚠️ Risks & Mitigation

| Risk | Mitigation |
|------|-------------|
| Spotify rate limits | Cache and limit polling |
| API differences | Use adapters, manual fallback |
| LLM parsing errors | JSON schema + validation |
| AI cost / downtime | 24h cache, static templates |
| Privacy | Encryption, consent, deletion |
| Timeline pressure | Scrum, feature freeze week 5 |
| Connectivity | Local cache, optimistic UI |
| iOS background delivery limitations | Use anchored queries + fallback manual sync |
| BLE compatibility | Fallback to plan without live HR coaching |

---

### 🔒 Privacy Notes (Music)
- Only store minimal per-track metadata needed for personalization (track_id, timestamps, audio features, in-session feedback).  
- Allow users to **clear music history** in Settings → Music & Playback.  
- Respect Spotify scopes and token revocation; stop collecting history when disconnected.

---

## 🌟 Expected Outcome
A mobile-friendly AI training assistant that:
- Generates adaptive workouts  
- Syncs training and music data  
- Learns user music preferences  
- Lets the user guide AI through context  
- Offers theme customization (light/dark mode)  
- Works offline and protects privacy  
- Optionally leverages Apple Health and live heart rate streaming for deeper personalization.

