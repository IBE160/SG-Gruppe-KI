from pydantic import BaseModel, Field
from typing import List, Optional

# Re-using interfaces for consistency
class GoalProgress(BaseModel):
    name: str
    current: float
    target: float
    unit: str

class WorkoutStreak(BaseModel):
    days: int

class WeeklyVolume(BaseModel):
    total: float
    unit: str
    chart_data_url: str

class TodaysContext(BaseModel):
    message: str

class RecentWorkout(BaseModel):
    name: str
    date: str

class WeeklyReviewVolume(BaseModel):
    value: str
    trend: str # "up" or "down"
    percentage_change: str
    chart_svg: str

class WeeklyReviewIntensity(BaseModel):
    value: str
    trend: str # "up" or "down"
    percentage_change: str
    chart_svg: str

class ConsistencyChartData(BaseModel):
    day: str
    height_percentage: str
    trained: bool

class WeeklyReviewConsistency(BaseModel):
    value: str
    trend: str # "up" or "down"
    percentage_change: str
    chart_data: List[ConsistencyChartData]

class CoachCorner(BaseModel):
    message: str
    suggestion: str

class WeeklyReview(BaseModel):
    volume: WeeklyReviewVolume
    intensity: WeeklyReviewIntensity
    consistency: WeeklyReviewConsistency
    coach_corner: CoachCorner

class DashboardMetrics(BaseModel):
    goal_progress: GoalProgress
    workout_streak: WorkoutStreak
    weekly_volume: WeeklyVolume
    todays_context: TodaysContext
    recent_workouts: List[RecentWorkout]
    weekly_review: WeeklyReview

    class Config:
        from_attributes = True
