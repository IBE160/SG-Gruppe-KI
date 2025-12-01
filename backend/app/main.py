from fastapi import FastAPI
from app.api.v1 import auth, users

app = FastAPI(
    title="AI Personal Training Advisor Backend",
    description="API for managing users, workouts, AI plans, and integrations.",
    version="1.0.0",
)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(users.router, prefix="/api/v1/users", tags=["Users"])

@app.get("/")
async def root():
    return {"message": "Welcome to the AI Personal Training Advisor Backend!"}
