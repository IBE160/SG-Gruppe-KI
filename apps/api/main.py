from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from app.api.auth import router as auth_router
from app.api.onboarding import router as onboarding_router # Import the new onboarding router
from app.api.user import router as user_router # Import the new user router

app = FastAPI()

app.include_router(auth_router, prefix="/api/v1")
app.include_router(onboarding_router, prefix="/api/v1") # Include the new onboarding router
app.include_router(user_router, prefix="/api/v1") # Include the new user router

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": exc.errors(), "body": exc.body},
    )

@app.get("/")
async def root():
    return {"message": "Hello FastAPI from apps/api!"}
