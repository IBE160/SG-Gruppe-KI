# Story 4.4: General & Appearance Settings

## 1. Story Summary
As a user, I want to customize general application preferences like language and appearance (theme, accent color, font size), so that I can personalize my app experience.

## 2. Acceptance Criteria
- Given I am in the "General" settings sub-screen (Flow 18, Screen 2)
- When I select a different language or toggle notification preferences
- Then the changes are applied to the app.
- Given I am in the "Appearance" settings sub-screen (Flow 18, Screen 3)
- When I select a theme (light/dark/system), accent color, or adjust font size
- Then these changes are immediately reflected in a live preview and applied to the app's UI.

## 3. Story Context
*   **Frontend:** This is a frontend-only story, involving UI components for various settings (dropdowns, toggles, color pickers, sliders). It requires implementing logic to apply these preferences to the app's styling and potentially to its internationalization.
*   **Backend:** No new backend development is required. User preferences will be stored client-side or within existing user profile data.
*   **Data:** User preferences will be stored in local storage, cookies, or within the `Users` table in Supabase.
*   **UX:** Real-time visual feedback for appearance changes is crucial for a good user experience. The settings UI should be intuitive and allow for easy customization.

## 4. Dependencies
*   **Story 4.1 (Main Settings Menu):** Requires the settings menu and navigation to access this sub-screen.

## 5. Risks & Assumptions
*   **Risk:** Implementing theme and accent color changes across the entire application can be complex and error-prone if the styling system is not robust. Mitigation: Leverage CSS variables and a well-defined theming system (e.g., with Tailwind CSS and CSS-in-JS solutions).
*   **Risk:** Language changes require a fully implemented internationalization (i18n) system. This story assumes a basic i18n setup is available or will focus only on changing the preference, not the full translation.
*   **Assumption:** The UI/UX designs for the General and Appearance settings (Flow 18, Screens 2 & 3) are finalized.

## 6. Definition of Ready
- [x] Story is defined with summary and acceptance criteria.
- [x] Dependency (Story 4.1) is complete.
- [ ] Story has been estimated by the development team.
- [x] UX designs for the general and appearance settings are available.
- [ ] A basic internationalization framework is in place (if language changes are in scope).

## 7. Definition of Done
- [ ] All acceptance criteria are met.
- [ ] General settings (e.g., language, notifications) can be configured and applied.
- [ ] Appearance settings (theme, accent color, font size) can be customized with live preview.
- [ ] Frontend tests are written and passing for all settings components.
- [ ] Code has been peer-reviewed and approved.
- [ ] Code is merged into the main development branch.
- [ ] The `sprint-status.yaml` is updated to reflect the story's new status.
