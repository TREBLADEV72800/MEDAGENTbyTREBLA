from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from datetime import datetime
import uuid

class UserProfile(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    eta: Optional[str] = None
    genere: Optional[str] = None
    sintomo_principale: Optional[str] = None
    durata: Optional[str] = None
    intensita: Optional[List[int]] = None
    sintomi_associati: Optional[List[str]] = []
    condizioni_note: Optional[List[str]] = []
    familiarita: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class UserProfileCreate(BaseModel):
    eta: Optional[str] = None
    genere: Optional[str] = None
    sintomo_principale: Optional[str] = None
    durata: Optional[str] = None
    intensita: Optional[List[int]] = None
    sintomi_associati: Optional[List[str]] = []
    condizioni_note: Optional[List[str]] = []
    familiarita: Optional[str] = None

class UserProfileUpdate(BaseModel):
    eta: Optional[str] = None
    genere: Optional[str] = None
    sintomo_principale: Optional[str] = None
    durata: Optional[str] = None
    intensita: Optional[List[int]] = None
    sintomi_associati: Optional[List[str]] = None
    condizioni_note: Optional[List[str]] = None
    familiarita: Optional[str] = None