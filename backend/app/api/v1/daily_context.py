# backend/app/api/v1/daily_context.py
from fastapi import APIRouter, Depends, HTTPException, status
from typing import Any
from uuid import UUID
from datetime import date

from app.schemas.daily_context import DailyContext, DailyContextCreate
from app.dependencies import get_current_user
from app.db.supabase import get_supabase_client
from app.schemas.user import CurrentUser
from app.crud import daily_context as crud_daily_context
from supabase import Client

router = APIRouter()

@router.post("/daily_context", response_model=DailyContext, status_code=status.HTTP_201_CREATED)
async def create_daily_context(
    daily_context_in: DailyContextCreate,
    current_user: CurrentUser = Depends(get_current_user),
    db: Client = Depends(get_supabase_client)
) -> DailyContext:
    """
    Create or update a daily context entry for the authenticated user.
    """
    try:
        user_uuid = UUID(current_user.id)
        created_context = await crud_daily_context.create_daily_context(db, user_uuid, daily_context_in)
        return created_context
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create or update daily context: {e}"
        )

@router.get(
    "/daily_context/{context_date}",
    response_model=DailyContext,
    responses={
        status.HTTP_404_NOT_FOUND: {"model": dict} # For 404, return a simple dictionary (e.g., {"detail": "..."})
    }
)
async def get_daily_context(
    context_date: date,
    current_user: CurrentUser = Depends(get_current_user),
    db: Client = Depends(get_supabase_client)
) -> DailyContext:
    """
    Retrieve the daily context for a specific date for the authenticated user.
    """
    try:
        user_uuid = UUID(current_user.id)
        daily_ctx = await crud_daily_context.get_daily_context(db, user_uuid, context_date)
        if not daily_ctx:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Daily context not found for this date."
            )
        return daily_ctx
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve daily context: {e}"
        )



