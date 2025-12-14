# Story 3.3: In-Workout Music Playback & Controls

## 1. Story Summary
As a user, I want to control music playback and receive visual feedback on BPM matching during my workout, so that I can maintain focus and optimize my performance.

## 2. Acceptance Criteria
- Given I have an active workout session and a generated Session Mix (Story 3.2)
- When I am in the Workout Player (Story 2.4's UI)
- Then music playback controls (play/pause, skip, volume) are available and functional.
- And I can see visual feedback on BPM matching for the current workout phase (e.g., a gauge or text).
- And user interactions (e.g., skipping a track) are logged to refine future AI scoring.

## 3. Story Context
*   **Frontend:** This story involves augmenting the existing Workout Player UI (from Story 2.4) with new music-related controls and displays. It will require integration with a playback mechanism, likely the Spotify Web Playback SDK.
*   **Backend:** A new endpoint is needed to receive feedback signals from the frontend, such as when a user skips a track. This data will be used to improve the AI Music Scorer in the future.
*   **Data:** The frontend will send music interaction events (e.g., `{ "track_id": "...", "action": "skipped" }`) to the new backend feedback endpoint. The backend will store this feedback.
*   **UX:** The controls must be large, easily accessible, and integrated smoothly into the workout flow without being distracting. The BPM matching feedback should be a subtle, ambient indicator.

## 4. Dependencies
*   **Story 2.4 (Workout Player):** The core Workout Player UI must exist to be augmented with music controls.
*   **Story 3.2 (Session Mix Generation):** A generated playlist is required to be played.
*   **External:** The Spotify Web Playback SDK or a similar library is needed for in-browser playback control.

## 5. Risks & Assumptions
*   **Risk:** The Spotify Web Playback SDK can have browser compatibility issues or require a premium Spotify account for full functionality. Mitigation: Thoroughly test on target browsers and clearly document the premium account requirement to users.
*   **Risk:** Integrating music controls into the already-complex Workout Player UI could make it cluttered. Mitigation: Follow UX designs carefully to ensure a clean and intuitive layout.
*   **Assumption:** The playback SDK provides sufficient events and controls to meet all acceptance criteria.
*   **Assumption:** We can reliably link a "skip" action to a specific track and log it for the feedback loop.

## 6. Definition of Ready
- [x] Story is defined with summary and acceptance criteria.
- [x] Dependencies (2.4, 3.2) are complete.
- [ ] Backend contract for the `/music/feedback` endpoint is defined.
- [ ] Story has been estimated by the development team.
- [x] UX designs for the in-workout music controls are available.

## 7. Definition of Done
- [ ] All acceptance criteria are met.
- [ ] Music controls are successfully integrated into the Workout Player UI.
- [ ] Users can play, pause, and skip tracks from the generated playlist during a workout.
- [ ] Skip actions are successfully logged to the backend.
- [ ] The feature is tested across target browsers.
- [ ] Code has been peer-reviewed and approved.
- [ ] Code is merged into the main development branch.
- [ ] The `sprint-status.yaml` is updated to reflect the story's new status.
