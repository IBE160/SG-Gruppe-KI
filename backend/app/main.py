from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.v1 import auth, users  # ← viktig: punktum foran api

app = FastAPI(
    title="AI Personal Training Advisor Backend",
    description="API for managing users, workouts, AI plans, and integrations.",
    version="1.0.0",
)

# CORS Middleware
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(users.router, prefix="/api/v1/users", tags=["Users"])


@app.get("/")
async def root():
    return {"message": "Welcome to the AI Personal Training Advisor Backend!"}


@app.get("/health")
async def health_check():
    return {"status": "ok"}
