from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from datetime import datetime
import uuid

class ChatSession(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_profile_id: Optional[str] = None
    start_time: datetime = Field(default_factory=datetime.utcnow)
    end_time: Optional[datetime] = None
    message_count: int = 0
    current_urgency_level: str = "low"
    status: str = "active"  # active, completed, abandoned
    context_summary: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ChatSessionCreate(BaseModel):
    user_profile_id: Optional[str] = None

class ChatSessionUpdate(BaseModel):
    end_time: Optional[datetime] = None
    message_count: Optional[int] = None
    current_urgency_level: Optional[str] = None
    status: Optional[str] = None
    context_summary: Optional[str] = None

class ChatSessionResponse(BaseModel):
    id: str
    session_id: str
    user_profile_id: Optional[str]
    start_time: datetime
    end_time: Optional[datetime]
    message_count: int
    current_urgency_level: str
    status: str
    context_summary: Optional[str]