from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import random
import string
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# ----------------------- Models -----------------------
class Denunciado(BaseModel):
    cargo: str
    turma: Optional[str] = None
    nome: Optional[str] = None


class ReportCreate(BaseModel):
    tipo: str
    localidade: str
    vivencia: str
    tempo: str
    detalhes: str
    denunciados: List[Denunciado] = Field(default_factory=list)


class Report(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    protocolo: str
    tipo: str
    localidade: str
    vivencia: str
    tempo: str
    detalhes: str
    denunciados: List[Denunciado] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


def gerar_protocolo() -> str:
    """Generate an anonymous, human-readable protocol code, e.g. ESC-7X4K-2M9Q."""
    bloco = lambda: ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
    return f"ESC-{bloco()}-{bloco()}"


# ----------------------- Routes -----------------------
@api_router.get("/")
async def root():
    return {"message": "Canal de Escuta Anônima - API"}


@api_router.post("/reports", response_model=Report)
async def create_report(payload: ReportCreate):
    # Ensure unique protocol
    protocolo = gerar_protocolo()
    while await db.reports.find_one({"protocolo": protocolo}):
        protocolo = gerar_protocolo()

    report = Report(protocolo=protocolo, **payload.model_dump())
    doc = report.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.reports.insert_one(doc)
    return report


@api_router.get("/reports", response_model=List[Report])
async def list_reports():
    docs = await db.reports.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for d in docs:
        if isinstance(d.get('created_at'), str):
            d['created_at'] = datetime.fromisoformat(d['created_at'])
    return docs


@api_router.get("/reports/{protocolo}", response_model=Report)
async def get_report(protocolo: str):
    doc = await db.reports.find_one({"protocolo": protocolo.upper()}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Protocolo não encontrado")
    if isinstance(doc.get('created_at'), str):
        doc['created_at'] = datetime.fromisoformat(doc['created_at'])
    return doc


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
