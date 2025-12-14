# Story 2.5: Progress Dashboard Display

## 1. Story Summary
As a user, I want to view a personalized dashboard with key metrics, progress visualizations, and a weekly review summary, so that I can monitor my performance and understand my progress over time.

## 2. Acceptance Criteria
- Given I have completed at least one workout and logged data (via Story 2.4)
- When I navigate to the Dashboard (Flow 14, Screen 1)
- Then I can see key stats like total volume, intensity, and workout streaks
- And I can see a "Celebrate Your Wins" section for PRs and milestones
- And I can access a "Weekly Review" (Flow 14, Screen 2) showing trends and AI-generated insights.
- And all displayed data accurately reflects my `WorkoutLogs`.

## 3. Story Context
*   **Frontend:** This story involves creating the main dashboard UI, which will be the primary landing page for returning users. It will feature data visualizations (charts, graphs) and summary statistics.
*   **Backend:** New backend endpoints are required to provide aggregated data from `WorkoutLogs`. Calculating stats like total volume, streaks, and PRs on the backend will be more efficient than doing it on the client. An endpoint for the AI-driven "Weekly Review" will also be needed.
*   **Data:** This story is read-heavy. The backend will query and aggregate data from the `WorkoutLogs` table. No new data is written.
*   **UX:** The dashboard must be motivating and easy to understand at a glance. Data visualization is key to making the information digestible and engaging for the user.

## 4. Dependencies
*   **Story 2.4 (Workout Player):** Requires workout data to be logged in the `WorkoutLogs` table to have anything to display.

## 5. Risks & Assumptions
*   **Risk:** Database queries for aggregating dashboard stats could be slow, leading to a long load time for the dashboard. Mitigation: Use proper database indexing and efficient queries. Consider caching aggregated results if necessary.
*   **Risk:** The logic for calculating PRs and streaks can be complex. Mitigation: Write clear business logic and comprehensive tests for these calculations.
*   **Assumption:** The data stored in `WorkoutLogs` is sufficient and structured correctly to calculate all the required metrics for the dashboard.
*   **Assumption:** A chart/graph library (e.g., Recharts, Chart.js) has been chosen for the frontend.

## 6. Definition of Ready
- [x] Story is defined with summary and acceptance criteria.
- [x] Dependency (Story 2.4) is complete.
- [ ] Backend contract for the dashboard data endpoints is defined.
- [ ] Story has been estimated by the development team.
- [x] UX designs for the Dashboard and Weekly Review are available.

## 7. Definition of Done
- [ ] All acceptance criteria are met.
- [ ] The Dashboard UI is created and functional.
- [ ] Backend endpoints for dashboard data are created and functional.
- [ ] Data is accurately fetched and displayed in the UI.
- [ ] The frontend and backend code is fully tested.
- [ ] Code has been peer-reviewed and approved.
- [ ] Code is merged into the main development branch.
- [ ] The `sprint-status.yaml` is updated to reflect the story's new status.
