# backend/app/crud/daily_context.py
import sys
from datetime import date
from typing import List, Optional
from uuid import UUID

from supabase import Client
from app.schemas.daily_context import DailyContextCreate, DailyContext

async def create_daily_context(db: Client, user_id: UUID, daily_context_in: DailyContextCreate) -> DailyContext:

    """

    Creates a new daily context entry or updates an existing one for a user.

    """

    # Check if a context for this user and date already exists

    existing_context = await get_daily_context(db, user_id, date.today())

    

    if existing_context:

        # Update existing context

        data = daily_context_in.model_dump(exclude_unset=True)

        response = db.from_("daily_contexts").update(data).eq("user_id", str(user_id)).eq("context_date", str(date.today())).execute()

        

        if response.data:

            # Re-fetch to get the full updated object with all fields and correct types

            updated_context = await get_daily_context(db, user_id, date.today())

            return updated_context

        else:

            # Handle update failure if necessary

            raise Exception("Failed to update daily context")

    else:

        # Create new context

        new_data = {

            "user_id": str(user_id),

            "context_date": str(date.today()),

            **daily_context_in.model_dump()

        }

        response = db.from_("daily_contexts").insert(new_data).execute()



        if response.data:

            # Re-fetch to get the full created object with all fields and correct types

            created_context = await get_daily_context(db, user_id, date.today())

            return created_context

        else:

            # Handle insert failure if necessary

            raise Exception("Failed to create daily context")



async def get_daily_context(db: Client, user_id: UUID, context_date: date) -> Optional[DailyContext]:

    """

    Retrieves a daily context entry for a specific user and date.

    """

    response = db.from_("daily_contexts").select("*").eq("user_id", str(user_id)).eq("context_date", str(context_date)).single().execute()

    

    if response.data:

        return DailyContext(**response.data)

    return None
