# Story 3.2: AI-Driven Session Mix Generation

## 1. Story Summary
As a user with a connected Spotify account, I want the AI to generate personalized, phase-aligned workout playlists ("Session Mix"), so that my music enhances my training experience.

## 2. Acceptance Criteria
- Given I have a connected Spotify account (Story 3.1) and an active workout plan
- When I initiate "Generate Session Mix" (Flow 11, Screen 1)
- Then I can select the mix type (e.g., Warm-up only, Full Session)
- And the AI Music Scorer (backend) generates a playlist based on BPM, audio features, listening history, and user feedback
- And I am presented with a "Session Mix Preview & Customization" screen (Flow 11, Screen 2)
- And I can seed the mix with artists/genres, and review/customize individual tracks
- And a custom playlist is created in my Spotify account.

## 3. Story Context
*   **Frontend:** This story requires a new UI flow where the user can initiate the mix generation, set preferences (seeding), and review/customize the generated playlist before confirming.
*   **Backend:** This is a highly complex backend story. It requires a new "AI Music Scorer" service that can:
    1.  Fetch a user's listening history from Spotify.
    2.  Get audio features (BPM, energy, etc.) for tracks.
    3.  Rank tracks based on a scoring model.
    4.  Generate a final playlist matching the user's workout phases.
    5.  Create a new playlist in the user's Spotify account.
*   **Data:** A new `MusicPreferences` table might be needed to store user-seeded artists/genres. The backend will heavily read from the Spotify API.
*   **UX:** The ability to preview and customize the playlist is key to user agency. The AI should feel like a helpful DJ, not a dictator.

## 4. Dependencies
*   **Story 2.1 (AI Daily Plan):** Requires an active workout plan to align the music with workout phases.
*   **Story 3.1 (Spotify OAuth):** Requires valid Spotify API tokens to interact with the user's account.

## 5. Risks & Assumptions
*   **Risk:** The "AI Music Scorer" logic is complex and may not produce good results initially. Mitigation: Start with a simple scoring model (e.g., based only on BPM) and iterate. Make the model's parameters configurable.
*   **Risk:** Making numerous calls to the Spotify API could lead to rate-limiting issues. Mitigation: Implement caching for track audio features and other relatively static data. Use batch API endpoints where available.
*   **Assumption:** The Spotify API provides all the necessary audio features (BPM, energy, danceability) for the scoring model.
*   **Assumption:** We can create a "good enough" V1 of the AI scorer that provides tangible value to the user.

## 6. Definition of Ready
- [x] Story is defined with summary and acceptance criteria.
- [x] Dependencies (2.1, 3.1) are complete.
- [ ] Story has been estimated by the development team.
- [x] UX designs for the Session Mix flow (Flow 11) are available.

## 7. Definition of Done
- [ ] All acceptance criteria are met.
- [ ] The frontend UI for generating and reviewing a Session Mix is complete.
- [ ] The backend AI Music Scorer and playlist generation logic is complete.
- [ ] The system can successfully create a new playlist in the user's Spotify account.
- [ ] The full flow is tested end-to-end.
- [ ] Code has been peer-reviewed and approved.
- [ ] Code is merged into the main development branch.
- [ ] The `sprint-status.yaml` is updated to reflect the story's new status.
