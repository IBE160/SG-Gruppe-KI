from fastapi import FastAPI
from .app.api.v1.auth import router as auth_router # Import the auth router

app = FastAPI()

app.include_router(auth_router, prefix="/api/v1/auth", tags=["auth"]) # Include the auth router

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/health")
def health_check():
    return {"status": "ok"}
