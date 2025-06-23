from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid

class Message(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    message_type: str  # "user" or "assistant"
    content: str
    urgency_level: Optional[str] = None
    next_questions: Optional[List[str]] = []
    metadata: Optional[Dict[str, Any]] = {}
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class MessageCreate(BaseModel):
    content: str
    message_type: str = "user"

class MessageResponse(BaseModel):
    id: str
    session_id: str
    message_type: str
    content: str
    urgency_level: Optional[str]
    next_questions: Optional[List[str]]
    metadata: Optional[Dict[str, Any]]
    timestamp: datetime

class ChatRequest(BaseModel):
    session_id: str
    message: str

class ChatResponse(BaseModel):
    session_id: str
    user_message: MessageResponse
    assistant_message: MessageResponse
    session_status: str