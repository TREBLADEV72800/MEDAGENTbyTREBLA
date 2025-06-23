import os
import asyncio
import logging
from typing import List, Dict, Optional, Tuple
from emergentintegrations.llm.chat import LlmChat, UserMessage
from models.user_profile import UserProfile
from models.message import Message

logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        self.api_key = os.environ.get('GEMINI_API_KEY')
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY environment variable is required")
        
        # Inizializza il sistema di prompt per MedAgent
        self.system_prompt = self._create_system_prompt()
        
    def _create_system_prompt(self) -> str:
        return """Sei MedAgent, un assistente sanitario AI specializzato nell'orientamento e supporto cognitivo per la salute.

RUOLO E RESPONSABILITÀ:
- Fornisci supporto educativo e orientativo, NON diagnosi mediche
- Aiuti gli utenti a comprendere i loro sintomi in modo empatico e non allarmistico
- Offri raccomandazioni prudenti su quando contattare un medico
- Mantieni sempre un approccio rassicurante ma responsabile

LINEE GUIDA COMPORTAMENTALI:
1. NON formulare mai diagnosi specifiche
2. Suggerisci di contattare un medico per sintomi gravi o persistenti
3. In caso di sintomi di emergenza (dolore toracico grave, difficoltà respiratorie acute, etc.), raccomanda SEMPRE il 118
4. Fornisci spiegazioni educative sui sintomi comuni
5. Usa un linguaggio accessibile e non tecnico per l'utente finale

FORMATO RISPOSTA:
- Rispondi sempre in italiano
- Sii empatico e comprensivo
- Fai domande di follow-up pertinenti
- Classifica l'urgenza come: "low", "medium", "high"
- Suggerisci 2-3 domande di approfondimento quando appropriato

EMERGENZE - Raccomanda IMMEDIATAMENTE di chiamare il 118 per:
- Dolore toracico grave o improvviso
- Difficoltà respiratorie severe
- Perdita di coscienza
- Convulsioni
- Sanguinamento grave
- Traumi cranici
- Sintomi di ictus (parola confusa, debolezza facciale, paralisi)

Ricorda: Il tuo obiettivo è guidare l'utente verso decisioni informate sulla propria salute, non sostituire il parere medico professionale."""

    async def create_chat_session(self, session_id: str) -> LlmChat:
        """Crea una nuova sessione di chat con Gemini"""
        try:
            chat = LlmChat(
                api_key=self.api_key,
                session_id=session_id,
                system_message=self.system_prompt
            ).with_model("gemini", "gemini-2.0-flash").with_max_tokens(1500)
            
            return chat
        except Exception as e:
            logger.error(f"Errore creazione sessione chat: {e}")
            raise

    async def generate_response(
        self, 
        session_id: str, 
        user_message: str, 
        user_profile: Optional[UserProfile] = None,
        conversation_history: Optional[List[Message]] = None
    ) -> Tuple[str, str, List[str]]:
        """Genera una risposta AI basata sul messaggio utente e contesto"""
        
        try:
            # Crea sessione chat
            chat = await self.create_chat_session(session_id)
            
            # Costruisci il contesto se disponibile
            context_message = self._build_context_message(user_profile, conversation_history)
            
            # Prepara il messaggio finale
            if context_message:
                full_message = f"{context_message}\n\nUtente: {user_message}"
            else:
                full_message = user_message
            
            # Crea il messaggio utente
            user_msg = UserMessage(text=full_message)
            
            # Ottieni la risposta da Gemini
            response = await chat.send_message(user_msg)
            
            # Analizza la risposta per estrarre urgenza e domande
            urgency_level, next_questions = self._analyze_response(response, user_message)
            
            return response, urgency_level, next_questions
            
        except Exception as e:
            logger.error(f"Errore generazione risposta AI: {e}")
            # Fallback response
            return (
                "Mi dispiace, sto avendo difficoltà tecniche. Per favore riprova o contatta un medico se hai sintomi preoccupanti.",
                "medium",
                ["Puoi ripetere la tua domanda?", "Hai altri sintomi da riferire?"]
            )

    def _build_context_message(
        self, 
        user_profile: Optional[UserProfile], 
        conversation_history: Optional[List[Message]]
    ) -> str:
        """Costruisce il messaggio di contesto per l'AI"""
        
        context_parts = []
        
        # Aggiungi informazioni profilo utente
        if user_profile:
            profile_info = []
            if user_profile.eta:
                profile_info.append(f"Età: {user_profile.eta}")
            if user_profile.genere:
                profile_info.append(f"Genere: {user_profile.genere}")
            if user_profile.sintomo_principale:
                profile_info.append(f"Sintomo principale: {user_profile.sintomo_principale}")
            if user_profile.durata:
                profile_info.append(f"Durata: {user_profile.durata}")
            if user_profile.intensita:
                profile_info.append(f"Intensità: {user_profile.intensita[0]}/10")
            if user_profile.sintomi_associati:
                profile_info.append(f"Sintomi associati: {', '.join(user_profile.sintomi_associati)}")
            if user_profile.condizioni_note:
                profile_info.append(f"Condizioni note: {', '.join(user_profile.condizioni_note)}")
            
            if profile_info:
                context_parts.append("PROFILO UTENTE:\n" + "\n".join(profile_info))
        
        # Aggiungi storia della conversazione (ultimi 6 messaggi)
        if conversation_history:
            recent_messages = conversation_history[-6:] if len(conversation_history) > 6 else conversation_history
            history_text = []
            for msg in recent_messages:
                speaker = "Utente" if msg.message_type == "user" else "Assistente"
                history_text.append(f"{speaker}: {msg.content}")
            
            if history_text:
                context_parts.append("CONVERSAZIONE PRECEDENTE:\n" + "\n".join(history_text))
        
        return "\n\n".join(context_parts) if context_parts else ""

    def _analyze_response(self, response: str, user_message: str) -> Tuple[str, List[str]]:
        """Analizza la risposta per determinare urgenza e domande suggerite"""
        
        response_lower = response.lower()
        user_message_lower = user_message.lower()
        
        # Determina livello di urgenza
        urgency_level = "low"
        
        # Parole chiave per alta urgenza
        high_urgency_keywords = [
            "118", "emergenza", "pronto soccorso", "immediatamente", "urgente",
            "dolore toracico", "difficoltà respiratorie", "perdita coscienza"
        ]
        
        # Parole chiave per media urgenza  
        medium_urgency_keywords = [
            "medico", "contatta", "febbre alta", "persistente", "preoccupante",
            "valutazione", "controllo medico"
        ]
        
        # Analizza urgenza
        if any(keyword in response_lower for keyword in high_urgency_keywords):
            urgency_level = "high"
        elif any(keyword in response_lower for keyword in medium_urgency_keywords):
            urgency_level = "medium"
        elif any(keyword in user_message_lower for keyword in ["dolore", "febbre", "male"]):
            urgency_level = "medium"
        
        # Genera domande suggerite basate sul contenuto
        next_questions = self._generate_suggested_questions(user_message_lower, response_lower)
        
        return urgency_level, next_questions

    def _generate_suggested_questions(self, user_message: str, response: str) -> List[str]:
        """Genera domande suggerite basate sul contesto"""
        
        questions = []
        
        # Domande basate sui sintomi menzionati
        if "febbre" in user_message:
            questions.extend([
                "Hai misurato la temperatura di recente?",
                "Hai brividi o sudorazione?",
                "Hai preso farmaci per la febbre?"
            ])
        
        if "dolore" in user_message:
            questions.extend([
                "Puoi descrivere meglio il tipo di dolore?",
                "Il dolore è costante o va e viene?",
                "Cosa peggiora o migliora il dolore?"
            ])
        
        if "mal di testa" in user_message:
            questions.extend([
                "Hai sensibilità alla luce?",
                "Il mal di testa è accompagnato da nausea?",
                "Dove è localizzato il dolore?"
            ])
        
        if "tosse" in user_message:
            questions.extend([
                "La tosse è secca o con catarro?",
                "Hai difficoltà a respirare?",
                "Da quanto tempo hai la tosse?"
            ])
        
        # Domande generiche se non match specifici
        if not questions:
            questions.extend([
                "Puoi descrivere altri sintomi?",
                "Come ti senti in generale?",
                "C'è qualcos'altro che ti preoccupa?"
            ])
        
        # Ritorna massimo 3 domande
        return questions[:3]

    async def generate_welcome_message(self, user_profile: Optional[UserProfile] = None) -> Tuple[str, str, List[str]]:
        """Genera il messaggio di benvenuto personalizzato"""
        
        welcome_parts = ["Ciao! Sono MedAgent, il tuo assistente sanitario digitale."]
        
        if user_profile and user_profile.sintomo_principale:
            welcome_parts.append(f"Vedo che hai indicato '{user_profile.sintomo_principale}' come sintomo principale.")
            welcome_parts.append("Sono qui per aiutarti a capire meglio come stai e guidarti verso le decisioni più appropriate.")
        else:
            welcome_parts.append("Sono qui per aiutarti a capire meglio come stai attraverso domande mirate e supporto personalizzato.")
        
        welcome_parts.append("Iniziamo: come ti senti in questo momento?")
        
        welcome_message = " ".join(welcome_parts)
        
        # Domande iniziali
        initial_questions = [
            "Puoi descrivere il tuo sintomo principale?",
            "Da quanto tempo hai questi sintomi?",
            "Come descrivi l'intensità del disturbo?"
        ]
        
        return welcome_message, "low", initial_questions