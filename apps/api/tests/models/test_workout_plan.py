from datetime import date
from app.models.workout_plan import Exercise, WorkoutDay, WorkoutPlanModel, PlanGenerationContext, PlanGenerationRequest, PlanGenerationResponse
import pytest
from pydantic import ValidationError

def test_exercise_model():
    exercise = Exercise(name="Squat", sets=3, reps="8-10", rpe=8, weight="100kg")
    assert exercise.name == "Squat"
    assert exercise.sets == 3
    assert exercise.reps == "8-10"
    assert exercise.rpe == 8
    assert exercise.weight == "100kg"

def test_workout_day_model():
    exercise = Exercise(name="Deadlift", sets=1, reps="5", weight="150kg")
    workout_day = WorkoutDay(day_name="Wednesday", exercises=[exercise])
    assert workout_day.day_name == "Wednesday"
    assert len(workout_day.exercises) == 1
    assert workout_day.exercises[0].name == "Deadlift"

def test_workout_plan_model():
    exercise = Exercise(name="Bench Press", sets=3, reps="5", weight="80kg")
    workout_day = WorkoutDay(day_name="Tuesday", exercises=[exercise])
    workout_plan = WorkoutPlanModel(
        user_id="user123",
        plan_date=date(2025, 12, 13),
        workout_days=[workout_day],
        ai_explanation="Focus on strength."
    )
    assert workout_plan.user_id == "user123"
    assert workout_plan.plan_date == date(2025, 12, 13)
    assert len(workout_plan.workout_days) == 1
    assert workout_plan.ai_explanation == "Focus on strength."

def test_plan_generation_context_model():
    context = PlanGenerationContext(
        mood="motivated",
        energy="high",
        soreness="none",
        recovery_bias="none",
        simulated_hrv=60.5,
        simulated_sleep=7.2
    )
    assert context.mood == "motivated"
    assert context.simulated_hrv == 60.5

def test_plan_generation_request_model():
    context = PlanGenerationContext(mood="tired")
    request = PlanGenerationRequest(context=context)
    assert request.context.mood == "tired"

def test_plan_generation_response_model():
    exercise = Exercise(name="Overhead Press", sets=3, reps="5")
    workout_day = WorkoutDay(day_name="Thursday", exercises=[exercise])
    workout_plan = WorkoutPlanModel(
        user_id="user456",
        plan_date=date(2025, 12, 14),
        workout_days=[workout_day]
    )
    response = PlanGenerationResponse(data=workout_plan)
    assert response.data.user_id == "user456"
    assert response.message == "Workout plan generated successfully"

def test_exercise_optional_fields():
    exercise = Exercise(name="Plank", sets=3, reps="60s")
    assert exercise.rpe is None
    assert exercise.weight is None
    assert exercise.name == "Plank"

def test_workout_plan_model_minimal():
    workout_plan = WorkoutPlanModel(
        user_id="user789",
        plan_date=date(2025, 12, 15),
        workout_days=[]
    )
    assert workout_plan.ai_explanation is None
    assert len(workout_plan.workout_days) == 0

def test_plan_generation_request_validation():
    with pytest.raises(ValidationError):
        PlanGenerationRequest(context="this is not a valid context") # context must be a PlanGenerationContext object

def test_workout_day_empty_exercises():
    workout_day = WorkoutDay(day_name="Rest Day", exercises=[])
    assert workout_day.day_name == "Rest Day"
    assert len(workout_day.exercises) == 0
