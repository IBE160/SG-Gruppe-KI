from typing import Optional
from datetime import datetime
from pydantic import BaseModel

class MusicFeedbackRequest(BaseModel):
    session_id: str
    track_id: str
    feedback_type: str # e.g., "skip", "completion", "like", "dislike"
    timestamp: datetime
    context: Optional[dict] = None # Additional context like BPM at the time of feedback
