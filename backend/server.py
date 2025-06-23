from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List
import uuid
from datetime import datetime

# Import delle route
from routes.chat_routes import router as chat_router

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="MedAgent API", description="AI-powered Health Assistant API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Define Models (keeping existing for compatibility)
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Legacy routes
@api_router.get("/")
async def root():
    return {"message": "MedAgent API - AI-powered Health Assistant", "version": "1.0.0", "status": "active"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Health check per la nuova API
@api_router.get("/health")
async def health_check():
    """Health check endpoint per verificare lo stato dell'API"""
    try:
        # Test connessione database
        await db.command("ping")
        
        # Test variabili ambiente
        gemini_key = os.environ.get('GEMINI_API_KEY')
        
        return {
            "status": "healthy",
            "database": "connected",
            "ai_service": "configured" if gemini_key else "not_configured",
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e),
            "timestamp": datetime.utcnow().isoformat()
        }

# Include chat routes
api_router.include_router(chat_router)

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Log startup info
logger.info("MedAgent API starting...")
logger.info(f"Database: {os.environ.get('DB_NAME', 'Not configured')}")
logger.info(f"Gemini API: {'Configured' if os.environ.get('GEMINI_API_KEY') else 'Not configured'}")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
    logger.info("MedAgent API shutdown complete")
