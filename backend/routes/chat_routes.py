import logging
from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorDatabase

from models.message import MessageCreate, MessageResponse, ChatRequest, ChatResponse
from models.chat_session import ChatSessionCreate, ChatSessionResponse
from models.user_profile import UserProfileCreate, UserProfile
from services.ai_service import AIService
from services.session_service import SessionService

logger = logging.getLogger(__name__)

# Dependency per il database
async def get_database():
    from server import db
    return db

# Dependency per i servizi
async def get_session_service(db: AsyncIOMotorDatabase = Depends(get_database)):
    return SessionService(db)

async def get_ai_service():
    return AIService()

router = APIRouter(prefix="/chat", tags=["chat"])

@router.post("/session", response_model=ChatSessionResponse)
async def create_chat_session(
    session_data: ChatSessionCreate,
    session_service: SessionService = Depends(get_session_service)
):
    """Crea una nuova sessione di chat"""
    try:
        session = await session_service.create_session(session_data)
        return ChatSessionResponse(
            id=session.id,
            session_id=session.session_id,
            user_profile_id=session.user_profile_id,
            start_time=session.start_time,
            end_time=session.end_time,
            message_count=session.message_count,
            current_urgency_level=session.current_urgency_level,
            status=session.status,
            context_summary=session.context_summary
        )
    except Exception as e:
        logger.error(f"Errore creazione sessione: {e}")
        raise HTTPException(status_code=500, detail="Errore interno del server")

@router.get("/session/{session_id}", response_model=ChatSessionResponse)
async def get_chat_session(
    session_id: str,
    session_service: SessionService = Depends(get_session_service)
):
    """Recupera una sessione di chat esistente"""
    try:
        session = await session_service.get_session(session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Sessione non trovata")
        
        return ChatSessionResponse(
            id=session.id,
            session_id=session.session_id,
            user_profile_id=session.user_profile_id,
            start_time=session.start_time,
            end_time=session.end_time,
            message_count=session.message_count,
            current_urgency_level=session.current_urgency_level,
            status=session.status,
            context_summary=session.context_summary
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Errore recupero sessione {session_id}: {e}")
        raise HTTPException(status_code=500, detail="Errore interno del server")

@router.post("/profile/{session_id}", response_model=UserProfile)
async def create_or_update_profile(
    session_id: str,
    profile_data: UserProfileCreate,
    session_service: SessionService = Depends(get_session_service)
):
    """Crea o aggiorna il profilo utente per una sessione"""
    try:
        # Verifica che la sessione esista
        session = await session_service.get_session(session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Sessione non trovata")
        
        profile = await session_service.create_user_profile(session_id, profile_data)
        return profile
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Errore gestione profilo utente: {e}")
        raise HTTPException(status_code=500, detail="Errore interno del server")

@router.get("/profile/{session_id}", response_model=Optional[UserProfile])
async def get_user_profile(
    session_id: str,
    session_service: SessionService = Depends(get_session_service)
):
    """Recupera il profilo utente per una sessione"""
    try:
        profile = await session_service.get_user_profile(session_id)
        return profile
    except Exception as e:
        logger.error(f"Errore recupero profilo {session_id}: {e}")
        raise HTTPException(status_code=500, detail="Errore interno del server")

@router.get("/history/{session_id}", response_model=List[MessageResponse])
async def get_conversation_history(
    session_id: str,
    limit: int = 50,
    session_service: SessionService = Depends(get_session_service)
):
    """Recupera la storia della conversazione"""
    try:
        messages = await session_service.get_conversation_history(session_id, limit)
        return [
            MessageResponse(
                id=msg.id,
                session_id=msg.session_id,
                message_type=msg.message_type,
                content=msg.content,
                urgency_level=msg.urgency_level,
                next_questions=msg.next_questions,
                metadata=msg.metadata,
                timestamp=msg.timestamp
            ) for msg in messages
        ]
    except Exception as e:
        logger.error(f"Errore recupero conversazione {session_id}: {e}")
        raise HTTPException(status_code=500, detail="Errore interno del server")

@router.post("/message", response_model=ChatResponse)
async def send_message(
    chat_request: ChatRequest,
    session_service: SessionService = Depends(get_session_service),
    ai_service: AIService = Depends(get_ai_service)
):
    """Invia un messaggio e ricevi risposta AI"""
    try:
        session_id = chat_request.session_id
        user_message = chat_request.message
        
        # Verifica che la sessione esista
        session = await session_service.get_session(session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Sessione non trovata")
        
        # Recupera profilo utente e storia conversazione
        user_profile = await session_service.get_user_profile(session_id)
        conversation_history = await session_service.get_conversation_history(session_id, limit=10)
        
        # Salva il messaggio utente
        user_msg_create = MessageCreate(content=user_message, message_type="user")
        saved_user_msg = await session_service.save_message(session_id, user_msg_create)
        
        # Genera risposta AI
        ai_response, urgency_level, next_questions = await ai_service.generate_response(
            session_id=session_id,
            user_message=user_message,
            user_profile=user_profile,
            conversation_history=conversation_history
        )
        
        # Salva la risposta AI
        ai_msg_create = MessageCreate(content=ai_response, message_type="assistant")
        saved_ai_msg = await session_service.save_message(
            session_id, 
            ai_msg_create, 
            urgency_level=urgency_level,
            next_questions=next_questions
        )
        
        # Aggiorna urgenza sessione se necessario
        if urgency_level and urgency_level != "low":
            from models.chat_session import ChatSessionUpdate
            update_data = ChatSessionUpdate(current_urgency_level=urgency_level)
            await session_service.update_session(session_id, update_data)
        
        return ChatResponse(
            session_id=session_id,
            user_message=MessageResponse(
                id=saved_user_msg.id,
                session_id=saved_user_msg.session_id,
                message_type=saved_user_msg.message_type,
                content=saved_user_msg.content,
                urgency_level=saved_user_msg.urgency_level,
                next_questions=saved_user_msg.next_questions,
                metadata=saved_user_msg.metadata,
                timestamp=saved_user_msg.timestamp
            ),
            assistant_message=MessageResponse(
                id=saved_ai_msg.id,
                session_id=saved_ai_msg.session_id,
                message_type=saved_ai_msg.message_type,
                content=saved_ai_msg.content,
                urgency_level=saved_ai_msg.urgency_level,
                next_questions=saved_ai_msg.next_questions,
                metadata=saved_ai_msg.metadata,
                timestamp=saved_ai_msg.timestamp
            ),
            session_status=session.status
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Errore invio messaggio: {e}")
        raise HTTPException(status_code=500, detail="Errore interno del server")

@router.post("/welcome/{session_id}", response_model=MessageResponse)
async def get_welcome_message(
    session_id: str,
    session_service: SessionService = Depends(get_session_service),
    ai_service: AIService = Depends(get_ai_service)
):
    """Genera e restituisce il messaggio di benvenuto personalizzato"""
    try:
        # Verifica che la sessione esista
        session = await session_service.get_session(session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Sessione non trovata")
        
        # Recupera profilo utente
        user_profile = await session_service.get_user_profile(session_id)
        
        # Genera messaggio di benvenuto
        welcome_message, urgency_level, next_questions = await ai_service.generate_welcome_message(user_profile)
        
        # Salva il messaggio di benvenuto
        welcome_msg_create = MessageCreate(content=welcome_message, message_type="assistant")
        saved_welcome_msg = await session_service.save_message(
            session_id, 
            welcome_msg_create, 
            urgency_level=urgency_level,
            next_questions=next_questions
        )
        
        return MessageResponse(
            id=saved_welcome_msg.id,
            session_id=saved_welcome_msg.session_id,
            message_type=saved_welcome_msg.message_type,
            content=saved_welcome_msg.content,
            urgency_level=saved_welcome_msg.urgency_level,
            next_questions=saved_welcome_msg.next_questions,
            metadata=saved_welcome_msg.metadata,
            timestamp=saved_welcome_msg.timestamp
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Errore generazione messaggio benvenuto: {e}")
        raise HTTPException(status_code=500, detail="Errore interno del server")

@router.post("/close/{session_id}")
async def close_session(
    session_id: str,
    session_service: SessionService = Depends(get_session_service)
):
    """Chiude una sessione di chat"""
    try:
        success = await session_service.close_session(session_id)
        if not success:
            raise HTTPException(status_code=404, detail="Sessione non trovata")
        
        return {"message": "Sessione chiusa con successo", "session_id": session_id}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Errore chiusura sessione {session_id}: {e}")
        raise HTTPException(status_code=500, detail="Errore interno del server")

@router.get("/summary/{session_id}")
async def get_session_summary(
    session_id: str,
    session_service: SessionService = Depends(get_session_service)
):
    """Ottieni un riassunto completo della sessione per la pagina risultati"""
    try:
        summary = await session_service.get_session_summary(session_id)
        if not summary:
            raise HTTPException(status_code=404, detail="Sessione non trovata")
        
        return summary
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Errore generazione riassunto {session_id}: {e}")
        raise HTTPException(status_code=500, detail="Errore interno del server")