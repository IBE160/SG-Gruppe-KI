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

A dedicated **Settings page** gives users full control over personal preferences and interface options.

### 🧭 General
- **Language:** English / Norwegian / Spanish / German  
- **Units:** Kilograms (kg) or Pounds (lbs)  
- **Measurement System:** Metric / Imperial  
- **Time Format:** 12-hour / 24-hour clock  

### 🎨 Appearance
- **Theme Mode:** Light / Dark / System Default  
- **Accent Color:** Select from preset palette  
- **Font Size:** Small / Medium / Large  
- **Animations:** Enable / disable UI motion effects  

### ⚡ Performance & Data
- **Data Sync Frequency:** Realtime / Daily / Manual  
- **Offline Mode:** Enable caching of workouts and logs  
- **Clear Local Cache:** Button to reset stored data  
- **Live Heart Rate (BLE):** On/Off  
- **HR Source Preference:** Auto (Wearable) / BLE Broadcast  
- **Broadcast Timeout:** 5–120 min (default 60)
- **Apple Health Sync:** On/Off
- **Data Types:** Workouts / Heart Rate / HRV / Sleep
- **Sync Mode:** Background (recommended) / Manual Pull
- **Backfill Range:** 7 / 30 / 90 days


### 🔒 Privacy & Account
- **Data Export:** Download workout + health data (JSON/CSV)  
- **Revoke Integrations:** Disconnect Spotify, Google Fit, etc.  
- **Delete Account:** Full GDPR-compliant data deletion  
- **Consent Settings:** Manage permissions for AI and analytics  

---

## 🧱 Technology Stack

| Layer | Technology | Notes |
|-------|-------------|-------|
| **Frontend** | Next.js (App Router) + TypeScript + Tailwind CSS | SEO, SSR, RSC, mobile-friendly |
| **Backend** | FastAPI (Python) | REST, async, robust |
| **Database** | PostgreSQL (Supabase) | Users, workouts, integrations |
| **Auth** | Supabase | OAuth 2.0, JWT |
| **AI Engine** | OpenAI API | JSON plan + music seed |
| **Hosting** | Vercel + Fly.io/Render | CDN + autoscaling |
| **Notifications** | OneSignal / Firebase | Push + email |
| **Storage** | Supabase / S3 | Media files and progress photos |
| **Music** | Spotify Web API | Playback, “Recently Played” |
| **Wearables** | Fit/Health/Garmin APIs | Sync training and HR |
| **iOS Client**| Swift + HealthKit (iOS/watchOS)| Reads Health data locally; user-consent|

---

## 🧠 AI Implementation

- **Prompt Template:** user profile + last 3 sessions  
- **Output:** structured JSON with phases  
- **Adaptive Logic:** adjusts volume ±10% based on RPE  
- **Music Matching:** BPM per phase → AI playlist  
- **Context Fusion:** `profile ⊕ logs ⊕ wearables ⊕ context`  
- **Fallback:** cached plan if AI fails  
- **Cache:** 24 hours per user  
- **Additional Signals (Apple Health):** HR variability (SDNN), sleep duration/stages, resting HR; used to bias daily plan (e.g., −10% volume on poor sleep/HRV)
- **(Optional)** Live heart rate events can feed real-time AI coaching prompts when enabled.



---

## 🗂️ Data Model (ERD)

- **Users** – id, name, email, units  
- **Goals** – goal, equipment, injuries  
- **WorkoutPlans** – plan_json, model, cache  
- **WorkoutLogs** – workout data and RPE  
- **Integrations** – Spotify, Google Fit, Garmin, etc.  
- **MusicPreferences** – playlists, BPM profile  
- **ContextEntries** – free text and structured JSON  
- **WorkoutSync** – wearable data  
- **AppleHealthSyncAnchors** – user_id, type, anchor_token, updated_at
- **AppleHealthSamples** – id, user_id, type, start_at, end_at, value_json, source_bundle_id, uuid, created_at


Sensitive data is encrypted (tokens, HRV, photos).

---

## 🔌 API (FastAPI) — Endpoints

```http
POST /auth/verify
POST /plans/generate
GET  /plans/{planId}
POST /logs

POST /music/connect/spotify
GET  /music/devices
POST /music/play
POST /music/pause
GET  /music/recently-played
GET  /music/status

POST /wearables/sync
GET  /wearables/workouts

POST /apple-health/sync/start        # returns per-type anchors & signed session token
POST /apple-health/sync/upload       # receives batches of samples (JSON), updates anchors
POST /apple-health/sync/finish       # finalizes a sync window


POST /context
GET  /context/current
DELETE /context/{id}
```

**BPM Ranges:**  
Warm-up 100–120 BPM • Main 130–160 BPM • Intervals 160–180 BPM • Cooldown 80–100 BPM

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

### ✅ Flow 1 – Account Creation & Authentication

**Trigger:**  
User opens the app for the first time or returns after logging out.

**Steps:**  
1. User selects “Sign In / Continue”.  
2. User chooses login method (Google OAuth or Email & Password).  
3. If new user → system creates a new profile entry in `Users`.  
4. If returning user → existing profile is retrieved.  
5. First-time users are redirected to onboarding; returning users go to Dashboard.

**APIs & Data:**  
- `POST /auth/verify`  
- Inserts/updates in `Users` table: `id`, `email`, `createdAt`, metadata

**Success Outcome:**  
✅ User is authenticated and can proceed to onboarding or dashboard.

**Failure / Fallback:**  
❌ Invalid login → error message displayed.  
❌ Network failure → retry or fallback to cached session (if available).

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

### ✅ Flow 3 – Connect Spotify (Optional)

**Trigger:**  
User clicks “Connect Spotify” during onboarding or in Settings.

**Steps:**  
1. App opens Spotify OAuth (PKCE) screen.  
2. User grants permissions for playback control and listening history.  
3. Backend receives tokens (access + refresh).  
4. Tokens are encrypted and stored in `Integrations`.  
5. App displays “Spotify connected” status.

**APIs & Data:**  
- `POST /music/connect/spotify`  
- Spotify scopes: `user-read-playback-state`, `user-modify-playback-state`, `user-read-recently-played`  
- Stored in `Integrations(spotify_token, refresh_token, expires_at)`

**Success Outcome:**  
✅ Playlist creation, BPM analysis, and playback become available.

**Failure / Fallback:**  
❌ User cancels → music features remain inactive.  
❌ Token expires → app attempts refresh or prompts reconnection.

---

### ✅ Flow 4 – Connect Strava / Google Fit (Optional Wearable Sync)

**Trigger:**  
User clicks “Connect Wearable” during onboarding or in Settings.

**Steps:**  
1. User selects Strava or Google Fit as sync source.  
2. OAuth flow opens respective platform login.  
3. User approves read access to workouts and heart rate (if available).  
4. Backend receives tokens and stores them in `Integrations`.  
5. First-time sync triggered via `POST /wearables/sync`.  
6. Synced workouts appear in dashboard (e.g., as history).

**APIs & Data:**  
- `POST /wearables/sync` (initial sync)  
- `Integrations(strava_token / google_fit_token)`  
- Data merges into `WorkoutSync` or `WorkoutLogs`

**Success Outcome:**  
✅ Past workouts and health metrics begin syncing into the system.

**Failure / Fallback:**  
❌ User skips → app relies on AI-only plans.  
❌ Sync error / rate limit → retry queue engaged.

---

### ✅ Flow 5 – Connect Apple Health (via iOS HealthKit)

**Trigger:**  
User installs the iOS companion app and enables “Sync Apple Health” in Settings or during onboarding.

**Steps:**  
1. User opens the iOS companion app and taps “Enable Apple Health Sync”.  
2. App requests HealthKit permissions (workouts, heart rate, HRV, sleep).  
3. User approves read access.  
4. App calls `POST /apple-health/sync/start` to retrieve sync anchors and session token.  
5. Anchored queries pull initial data (7–90 days based on settings).  
6. Data batches are sent to backend via `POST /apple-health/sync/upload`.  
7. Background delivery triggers automatic syncing when new data is available.

**APIs & Data:**  
- `POST /apple-health/sync/start`, `/upload`, `/finish`  
- Tables: `AppleHealthSyncAnchors`, `AppleHealthSamples`, `WorkoutSync`

**Success Outcome:**  
✅ Apple Health workouts, HR, HRV, and sleep begin syncing and enriching dashboard + AI model.

**Failure / Fallback:**  
❌ User denies permission → Health sync disabled.  
❌ Sync failure → retries are queued; manual pull option available.

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

### ✅ Flow 8 – Optional: Connect Live Heart Rate (BLE)

**Trigger:**  
User taps “Connect Heart Rate” in Workout Player.

**Steps:**  
1. App triggers Web Bluetooth scan for “heart_rate” BLE service.  
2. User selects HR-enabled device (e.g., Garmin watch broadcasting).  
3. Live BPM stream begins (1+ Hz refresh).  
4. Heart rate zones are visualized in real time.  
5. If AI live coaching is enabled → system triggers cues when HR exceeds thresholds for N seconds (e.g., “Reduce pace by 10% for 60s”).  
6. HR data is optionally buffered and linked to session log.

**APIs & Data:**  
- Web Bluetooth (client-side)  
- Optional: `POST /live/hr` batching for session-based HR logging  
- Stored in `WorkoutLogs` or `AppleHealthSamples` equivalent

**Success Outcome:**  
✅ Live heart monitoring enhances workout, optionally driving micro AI feedback.

**Failure / Fallback:**  
❌ BLE not supported → user prompted to continue without HR.  
❌ Connection lost → retry button or auto-reconnect prompt.

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

### ✅ Flow 11 – Create Session Mix (Spotify Playlist)

**Trigger:**  
After AI plan confirmation or post-session, user taps “Generate Session Mix”.

**Steps:**  
1. User selects playlist mode (warm-up / full session / recovery).  
2. App matches workout phases with BPM targets from plan.  
3. System queries Spotify for recommended tracks (based on user history + BPM).  
4. Playlist is generated and stored to user’s Spotify account.  
5. User can control playback (Play/Pause/Next) directly from app.

**APIs & Data:**  
- `GET /music/recently-played`, `GET /music/devices`  
- `POST /music/play`, `POST /music/pause`, playlist creation endpoints  
- Stored in `MusicPreferences` or associated playlist log

**Success Outcome:**  
✅ Personalized workout playlist is ready and usable in the session.

**Failure / Fallback:**  
❌ User lacks Spotify Premium → playback limited; fallback message provided.

---

### ✅ Flow 12 – Sync Wearable Data (Strava / Google Fit / Apple Health)

**Trigger:**  
Happens automatically in background or when “Sync Now” is manually triggered in Settings.

**Steps:**  
1. System checks which external integrations are enabled.  
2. For Strava/Google Fit: fetches new workouts since last sync.  
3. For Apple Health: HealthKit background delivery triggers new delta sync via iOS app.  
4. Fetched sessions are normalized and merged into `WorkoutSync` or matched against planned sessions.  
5. HR/HRV and sleep data are stored separately for AI context.  
6. AI uses new health metrics to adjust future plan suggestions.

**APIs & Data:**  
- `POST /wearables/sync`  
- `POST /apple-health/sync/upload`  
- Tables: `WorkoutSync`, `AppleHealthSamples`, `AppleHealthSyncAnchors`

**Success Outcome:**  
✅ Dashboard and AI planning reflect most recent wearable activity and recovery data.

**Failure / Fallback:**  
❌ Rate limit or offline status → sync is queued for retry.  
❌ Inconsistent data → flagged for user review or manual correction (see Flow 13).

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

## 🗓️ Timeline (6 Weeks)

| Week | Milestones |
|------|-------------|
| **1** | Architecture, repo, auth, DB schema |
| **2** | Onboarding, API integration (Spotify auth, initial Strava placeholder) |
| **3** | AI plan + validation |
| **4** | Workout UI + dashboard |
| **5** | Spotify OAuth + “Recently Played” |
| **6** | Wearable sync (Strava/Google Fit) + Apple HealthKit sync (iOS companion app MVP) + Live BLE Heart Rate connection in Workout Player + GDPR compliance + offline caching & export |

---

## ✅ Testing & Acceptance
T1 – Auth works  
T2 – AI returns valid JSON < 10 s  
T3 – Logs are stored correctly  
T4 – Dashboard shows accurate data  
T5 – Offline mode works  
T6 – Spotify connect OK  
T7 – Playlist per phase (95%)  
T8 – Wearable sync OK  
T9 – Music analysis works  
T10 – Context Window affects plan and music  
T11 – Apple Health sync works (initial + delta)
T12 – BLE HR connection stable ≥1 Hz for full session
T13 – AI adapts based on HRV/sleep signals


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

## 🌟 Expected Outcome
A mobile-friendly AI training assistant that:
- Generates adaptive workouts  
- Syncs training and music data  
- Learns user music preferences  
- Lets the user guide AI through context  
- Offers theme customization (light/dark mode)  
- Works offline and protects privacy  
- Optionally leverages Apple Health and live heart rate streaming for deeper personalization.

