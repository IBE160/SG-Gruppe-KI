from uuid import UUID
from datetime import datetime
from typing import List
from postgrest import APIResponse
from fastapi import HTTPException, status # Explicitly import HTTPException and status

from apps.api.app.models.workout_log import WorkoutLogCreate, WorkoutLogResponse
from apps.api.app.core.supabase import get_supabase_client

class LogService:
    def __init__(self):
        self.supabase = get_supabase_client()

    async def create_log_entry(
        self,
        log_entry: WorkoutLogCreate,
        user_id: UUID
    ) -> WorkoutLogResponse:
        data = log_entry.model_dump()
        data["user_id"] = str(user_id) # Supabase expects string for UUID
        data["completed_at"] = datetime.utcnow().isoformat() # Use UTC datetime

        response: APIResponse = await self.supabase.table("WorkoutLogs").insert(data).execute()

        if response.data:
            # Assuming Supabase returns the inserted data, convert it to WorkoutLogResponse
            # Supabase returns a list of inserted objects
            return WorkoutLogResponse(**response.data[0])
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create workout log entry."
            )

    async def create_bulk_log_entries(
        self,
        log_entries: List[WorkoutLogCreate],
        user_id: UUID
    ) -> List[WorkoutLogResponse]:
        data_to_insert = []
        for log_entry in log_entries:
            data = log_entry.model_dump()
            data["user_id"] = str(user_id)
            data["completed_at"] = datetime.utcnow().isoformat()
            data_to_insert.append(data)

        response: APIResponse = await self.supabase.table("WorkoutLogs").insert(data_to_insert).execute()

        if response.data:
            return [WorkoutLogResponse(**item) for item in response.data]
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create bulk workout log entries."
            )