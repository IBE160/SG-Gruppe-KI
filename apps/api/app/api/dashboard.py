from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from uuid import UUID

from apps.api.app.models.dashboard import DashboardMetrics
from apps.api.app.services.dashboard_service import DashboardService
from apps.api.app.core.auth import get_current_user_id

dashboard_router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@dashboard_router.get(
    "/",
    response_model=DashboardMetrics,
    status_code=status.HTTP_200_OK,
    summary="Get user's dashboard metrics and weekly review",
    dependencies=[Depends(get_current_user_id)],
)
async def get_dashboard(
    user_id: UUID = Depends(get_current_user_id),
):
    # This will be implemented in Subtask 4.3 and 4.4
    raise NotImplementedError("Getting dashboard metrics is not yet implemented.")
