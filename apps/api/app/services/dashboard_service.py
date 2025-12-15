from uuid import UUID
from datetime import datetime
from apps.api.app.models.dashboard import DashboardMetrics, GoalProgress, WorkoutStreak, WeeklyVolume, TodaysContext, RecentWorkout, WeeklyReviewVolume, WeeklyReviewIntensity, ConsistencyChartData, WeeklyReviewConsistency, CoachCorner, WeeklyReview

class DashboardService:
    def __init__(self):
        # In a real implementation, this would involve database queries
        pass

    async def get_dashboard_metrics(self, user_id: UUID) -> DashboardMetrics:
        # Mock data for demonstration
        return DashboardMetrics(
            goal_progress=GoalProgress(
                name="Bench Press",
                current=85.0,
                target=100.0,
                unit="kg",
            ),
            workout_streak=WorkoutStreak(
                days=5,
            ),
            weekly_volume=WeeklyVolume(
                total=5450.0,
                unit="lbs",
                chart_data_url="https://lh3.googleusercontent.com/aida-public/AB6AXuDzNjPnJ-GgHG7kXZRQt_FiXCIzXCAuALb6qz2uu10zi7JmVwF2xbv_2U-90Cg0JRY7geQY2-AeqdaDp7gszptq97bYvic8uVDvkqJff8k4hOUiDapwK1k9TCUv_9OqLwZGP4Mp1QpROmaP_HtWlV4jRnR4ksIi4RRKfWh0B5xymw2Uq26DbMqPdtAm-oer-zIzPpCjqFaWQnIcaOCKOl0xDbjJ_B3jtZk7oCBTV_cjdV9izKhC8kmdbAnO0lV_0e_amNrhR63b062F",
            ),
            todays_context=TodaysContext(
                message="You seem rested. Today's a good day for a high-intensity session. Let's aim for a new PR!",
            ),
            recent_workouts=[
                RecentWorkout(name="Push Day - Upper Body", date="Yesterday"),
                RecentWorkout(name="Leg Day - Hypertrophy", date="Mar 15"),
                RecentWorkout(name="Pull Day - Back & Biceps", date="Mar 14"),
            ],
            weekly_review=WeeklyReview(
                volume=WeeklyReviewVolume(
                    value="5,450 lbs",
                    trend="up",
                    percentage_change="15%",
                    chart_svg='<svg fill="none" height="148" preserveAspectRatio="none" viewBox="-3 0 478 150" width="100%" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient gradientUnits="userSpaceOnUse" id="chartGradient" x1="236" x2="236" y1="1" y2="149"><stop stopColor="#13ec5b" stopOpacity="0.3"></stop><stop offset="1" stopColor="#13ec5b" stopOpacity="0"></stop></linearGradient></defs><path d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25" fill="url(#chartGradient)"></path><path d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25" stroke="#13ec5b" strokeLinecap="round" strokeWidth="3"></path></svg>',
                ),
                intensity=WeeklyReviewIntensity(
                    value="85% 1RM",
                    trend="down",
                    percentage_change="2%",
                    chart_svg='<svg fill="none" height="148" preserveAspectRatio="none" viewBox="-3 0 478 150" width="100%" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient gradientUnits="userSpaceOnUse" id="chartGradient2" x1="236" x2="236" y1="1" y2="149"><stop stopColor="#13ec5b" stopOpacity="0.3"></stop><stop offset="1" stopColor="#13ec5b" stopOpacity="0"></stop></linearGradient></defs><path d="M0 25C18.1538 25 18.1538 129 36.3077 129C54.4615 129 54.4615 81 72.6154 81C90.7692 81 90.7692 1 108.923 1C127.077 1 127.077 149 145.231 149C163.385 149 163.385 121 181.538 121C199.692 121 199.692 45 217.846 45C236 45 236 61 254.154 61C272.308 61 272.308 101 290.462 101C308.615 101 308.615 33 326.769 33C344.923 33 344.923 93 363.077 93C381.231 93 381.231 41 399.385 41C417.538 41 417.538 21 435.692 21C453.846 21 453.846 109 472 109V149H0V25Z" fill="url(#chartGradient2)"></path><path d="M0 25C18.1538 25 18.1538 129 36.3077 129C54.4615 129 54.4615 81 72.6154 81C90.7692 81 90.7692 1 108.923 1C127.077 1 127.077 149 145.231 149C163.385 149 163.385 121 181.538 121C199.692 121 199.692 45 217.846 45C236 45 236 61 254.154 61C272.308 61 272.308 101 290.462 101C308.615 101 308.615 33 326.769 33C344.923 33 344.923 93 363.077 93C381.231 93 381.231 41 399.385 41C417.538 41 417.538 21 435.692 21C453.846 21 453.846 109 472 109" stroke="#13ec5b" strokeLinecap="round" strokeWidth="3"></path></svg>',
                ),
                consistency=WeeklyReviewConsistency(
                    value="4/5 Days",
                    trend="up",
                    percentage_change="20%",
                    chart_data=[
                        ConsistencyChartData(day="Mon", height_percentage="75%", trained=True),
                        ConsistencyChartData(day="Tue", height_percentage="100%", trained=False),
                        ConsistencyChartData(day="Wed", height_percentage="80%", trained=True),
                        ConsistencyChartData(day="Thu", height_percentage="90%", trained=True),
                        ConsistencyChartData(day="Fri", height_percentage="100%", trained=False),
                        ConsistencyChartData(day="Sat", height_percentage="60%", trained=True),
                        ConsistencyChartData(day="Sun", height_percentage="100%", trained=False),
                    ],
                ),
                coach_corner=CoachCorner(
                    message="Your intensity has been trending down over the last 3 sessions. To prevent overtraining and promote recovery, consider a deload week.",
                    suggestion="Implement Suggestion",
                ),
            ),
        )