from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware # New Import

from app.api.auth import router as auth_router
from app.api.onboarding import router as onboarding_router
from app.api.user import router as user_router
from app.api.plans import router as plans_router
from app.api.music import router as music_router
from app.api.logs import logs_router # Import logs_router
from app.api.export import router as export_router # Import export_router

def create_app() -> FastAPI:
    app = FastAPI()

    origins = [
        "http://localhost:3000", # Allow frontend origin
        "http://localhost:8000", # Allow backend origin itself for testing if needed
    ]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(auth_router, prefix="/api/v1", tags=["auth"])
    app.include_router(onboarding_router, prefix="/api/v1/onboarding", tags=["onboarding"])
    app.include_router(user_router, prefix="/api/v1", tags=["users"])
    app.include_router(plans_router, prefix="/api/v1/plans", tags=["plans"])
    app.include_router(music_router, prefix="/api/v1/music", tags=["music"])
    app.include_router(logs_router, prefix="/api/v1", tags=["logs"]) # Include logs_router
    app.include_router(export_router, prefix="/api/v1", tags=["export"]) # Include export_router

    return app

app = create_app()

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": exc.errors(), "body": exc.body},
    )

@app.get("/")
async def root():
    return {"message": "Hello FastAPI from apps/api!"}