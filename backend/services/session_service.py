import logging
from typing import List, Optional, Dict
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorDatabase
from models.chat_session import ChatSession, ChatSessionCreate, ChatSessionUpdate
from models.user_profile import UserProfile, UserProfileCreate
from models.message import Message, MessageCreate

logger = logging.getLogger(__name__)

class SessionService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.sessions_collection = db.chat_sessions
        self.profiles_collection = db.user_profiles
        self.messages_collection = db.messages

    async def create_session(self, session_data: ChatSessionCreate) -> ChatSession:
        """Crea una nuova sessione di chat"""
        try:
            session = ChatSession(**session_data.dict())
            session_dict = session.dict()
            
            result = await self.sessions_collection.insert_one(session_dict)
            session_dict["_id"] = result.inserted_id
            
            logger.info(f"Sessione creata: {session.session_id}")
            return session
        except Exception as e:
            logger.error(f"Errore creazione sessione: {e}")
            raise

    async def get_session(self, session_id: str) -> Optional[ChatSession]:
        """Recupera una sessione per session_id"""
        try:
            session_data = await self.sessions_collection.find_one({"session_id": session_id})
            if session_data:
                session_data.pop("_id", None)
                return ChatSession(**session_data)
            return None
        except Exception as e:
            logger.error(f"Errore recupero sessione {session_id}: {e}")
            return None

    async def update_session(self, session_id: str, update_data: ChatSessionUpdate) -> Optional[ChatSession]:
        """Aggiorna una sessione esistente"""
        try:
            # Aggiorna timestamp
            update_dict = update_data.dict(exclude_unset=True)
            update_dict["updated_at"] = datetime.utcnow()
            
            result = await self.sessions_collection.update_one(
                {"session_id": session_id},
                {"$set": update_dict}
            )
            
            if result.modified_count > 0:
                return await self.get_session(session_id)
            return None
        except Exception as e:
            logger.error(f"Errore aggiornamento sessione {session_id}: {e}")
            return None

    async def create_user_profile(self, session_id: str, profile_data: UserProfileCreate) -> UserProfile:
        """Crea o aggiorna il profilo utente per una sessione"""
        try:
            # Controlla se esiste già un profilo per questa sessione
            existing_profile = await self.profiles_collection.find_one({"session_id": session_id})
            
            if existing_profile:
                # Aggiorna profilo esistente
                update_dict = profile_data.dict(exclude_unset=True)
                update_dict["updated_at"] = datetime.utcnow()
                
                await self.profiles_collection.update_one(
                    {"session_id": session_id},
                    {"$set": update_dict}
                )
                
                updated_profile = await self.profiles_collection.find_one({"session_id": session_id})
                updated_profile.pop("_id", None)
                return UserProfile(**updated_profile)
            else:
                # Crea nuovo profilo
                profile = UserProfile(session_id=session_id, **profile_data.dict())
                profile_dict = profile.dict()
                
                result = await self.profiles_collection.insert_one(profile_dict)
                profile_dict["_id"] = result.inserted_id
                
                logger.info(f"Profilo utente creato per sessione: {session_id}")
                return profile
        except Exception as e:
            logger.error(f"Errore gestione profilo utente: {e}")
            raise

    async def get_user_profile(self, session_id: str) -> Optional[UserProfile]:
        """Recupera il profilo utente per una sessione"""
        try:
            profile_data = await self.profiles_collection.find_one({"session_id": session_id})
            if profile_data:
                profile_data.pop("_id", None)
                return UserProfile(**profile_data)
            return None
        except Exception as e:
            logger.error(f"Errore recupero profilo utente {session_id}: {e}")
            return None

    async def save_message(self, session_id: str, message_data: MessageCreate, 
                          urgency_level: Optional[str] = None, 
                          next_questions: Optional[List[str]] = None,
                          metadata: Optional[Dict] = None) -> Message:
        """Salva un messaggio nella conversazione"""
        try:
            message = Message(
                session_id=session_id,
                content=message_data.content,
                message_type=message_data.message_type,
                urgency_level=urgency_level,
                next_questions=next_questions or [],
                metadata=metadata or {}
            )
            
            message_dict = message.dict()
            result = await self.messages_collection.insert_one(message_dict)
            message_dict["_id"] = result.inserted_id
            
            # Aggiorna il contatore messaggi nella sessione
            await self.sessions_collection.update_one(
                {"session_id": session_id},
                {
                    "$inc": {"message_count": 1},
                    "$set": {"updated_at": datetime.utcnow()}
                }
            )
            
            return message
        except Exception as e:
            logger.error(f"Errore salvataggio messaggio: {e}")
            raise

    async def get_conversation_history(self, session_id: str, limit: int = 50) -> List[Message]:
        """Recupera la storia della conversazione per una sessione"""
        try:
            cursor = self.messages_collection.find(
                {"session_id": session_id}
            ).sort("timestamp", 1).limit(limit)
            
            messages = []
            async for message_data in cursor:
                message_data.pop("_id", None)
                messages.append(Message(**message_data))
            
            return messages
        except Exception as e:
            logger.error(f"Errore recupero conversazione {session_id}: {e}")
            return []

    async def get_session_summary(self, session_id: str) -> Optional[Dict]:
        """Genera un riassunto della sessione per i risultati"""
        try:
            session = await self.get_session(session_id)
            if not session:
                return None
            
            profile = await self.get_user_profile(session_id)
            messages = await self.get_conversation_history(session_id)
            
            # Analizza i messaggi per estrarre informazioni
            user_messages = [msg for msg in messages if msg.message_type == "user"]
            assistant_messages = [msg for msg in messages if msg.message_type == "assistant"]
            
            # Trova il livello di urgenza più alto
            urgency_levels = [msg.urgency_level for msg in assistant_messages if msg.urgency_level]
            max_urgency = "low"
            if "high" in urgency_levels:
                max_urgency = "high"
            elif "medium" in urgency_levels:
                max_urgency = "medium"
            
            # Estrai sintomi menzionati
            symptoms_mentioned = []
            if profile and profile.sintomo_principale:
                symptoms_mentioned.append(profile.sintomo_principale)
            if profile and profile.sintomi_associati:
                symptoms_mentioned.extend(profile.sintomi_associati)
            
            summary = {
                "session_id": session_id,
                "start_time": session.start_time,
                "end_time": session.end_time or datetime.utcnow(),
                "message_count": len(messages),
                "user_profile": profile.dict() if profile else None,
                "symptoms_mentioned": list(set(symptoms_mentioned)),
                "max_urgency_level": max_urgency,
                "conversation_length": len(user_messages),
                "last_message_time": messages[-1].timestamp if messages else session.start_time
            }
            
            return summary
        except Exception as e:
            logger.error(f"Errore generazione riassunto sessione {session_id}: {e}")
            return None

    async def close_session(self, session_id: str) -> bool:
        """Chiude una sessione attiva"""
        try:
            update_result = await self.sessions_collection.update_one(
                {"session_id": session_id},
                {
                    "$set": {
                        "status": "completed",
                        "end_time": datetime.utcnow(),
                        "updated_at": datetime.utcnow()
                    }
                }
            )
            
            return update_result.modified_count > 0
        except Exception as e:
            logger.error(f"Errore chiusura sessione {session_id}: {e}")
            return False

    async def cleanup_old_sessions(self, days_old: int = 30) -> int:
        """Pulisce le sessioni più vecchie di X giorni (per GDPR compliance)"""
        try:
            cutoff_date = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
            cutoff_date = cutoff_date.replace(day=cutoff_date.day - days_old)
            
            # Elimina messaggi vecchi
            messages_result = await self.messages_collection.delete_many({
                "timestamp": {"$lt": cutoff_date}
            })
            
            # Elimina profili vecchi
            profiles_result = await self.profiles_collection.delete_many({
                "created_at": {"$lt": cutoff_date}
            })
            
            # Elimina sessioni vecchie
            sessions_result = await self.sessions_collection.delete_many({
                "created_at": {"$lt": cutoff_date}
            })
            
            total_deleted = (
                messages_result.deleted_count + 
                profiles_result.deleted_count + 
                sessions_result.deleted_count
            )
            
            logger.info(f"Pulizia completata: {total_deleted} documenti eliminati")
            return total_deleted
            
        except Exception as e:
            logger.error(f"Errore pulizia sessioni vecchie: {e}")
            return 0