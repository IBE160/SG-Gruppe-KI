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
10. **Context Window**
    - Free-text box for today’s focus, energy, mood, BPM, etc.  
    - Automatically structured and used to guide AI and music selection  

---

### 💡 Nice-to-Have
- Nutrition companion (macros, hydration reminders)  
- Community / chat  
- Camera-based form guidance  
- Event-based periodization  
- Safety prompts for health alerts  

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

---

## 🧠 AI Implementation

- **Prompt Template:** user profile + last 3 sessions  
- **Output:** structured JSON with phases  
- **Adaptive Logic:** adjusts volume ±10% based on RPE  
- **Music Matching:** BPM per phase → AI playlist  
- **Context Fusion:** `profile ⊕ logs ⊕ wearables ⊕ context`  
- **Fallback:** cached plan if AI fails  
- **Cache:** 24 hours per user  

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
| **2** | Onboarding, API integration |
| **3** | AI plan + validation |
| **4** | Workout UI + dashboard |
| **5** | Spotify OAuth + “Recently Played” |
| **6** | Wearable sync + Context Window + GDPR + offline cache |

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

---

## 🌟 Expected Outcome
A mobile-friendly AI training assistant that:
- Generates adaptive workouts  
- Syncs training and music data  
- Learns user music preferences  
- Lets the user guide AI through context  
- Offers theme customization (light/dark mode)  
- Works offline and protects privacy  
