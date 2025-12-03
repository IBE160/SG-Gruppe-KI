import sys
import os

# --- BEGIN sys.path HACK ---
# This is a workaround for a persistent environment issue where modules are not being found.
# It forcefully adds the local virtual environment's site-packages to the Python path.
try:
    # __file__ is backend/app/main.py
    # Go up 3 levels to the project root, then down to backend/.venv
    project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    site_packages = os.path.join(project_root, 'backend', '.venv', 'Lib', 'site-packages')

    if os.path.exists(site_packages) and site_packages not in sys.path:
        print(f"--- HACK: Prepending '{site_packages}' to sys.path ---")
        sys.path.insert(0, site_packages)
except Exception as e:
    print(f"--- HACK: Failed to modify sys.path: {e} ---")
# --- END sys.path HACK ---

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.v1 import auth, users, daily_context  # ← Add daily_context

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
app.include_router(daily_context.router, prefix="/api/v1", tags=["Daily Context"]) # Include daily_context router


@app.get("/")
async def root():
    return {"message": "Welcome to the AI Personal Training Advisor Backend!"}


@app.get("/health")
async def health_check():
    return {"status": "ok"}
