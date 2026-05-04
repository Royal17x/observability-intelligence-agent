from groq import Groq
from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.services.db import create_tables
from app.config.config import settings
from app.models.schemas import AnalysisRequest
from app.tools.prometheus_tool import PrometheusTool
from app.tools.jaeger_tool import JaegerTool
from prometheus_fastapi_instrumentator import Instrumentator
from app.agents.postmortem_agent import ObservabilityAgent
from app.services.analysis_service import save_analysis
from app.services.analysis_service import get_analyses
from app.services.db import get_connection
from app.config.logging import setup_logging


@asynccontextmanager
async def lifespan(app: FastAPI):
    setup_logging()
    await create_tables()
    yield

app = FastAPI(lifespan=lifespan)
Instrumentator().instrument(app).expose(app)

client = Groq(api_key=settings.groq_api_key)
prometheus = PrometheusTool(base_url=settings.prometheus_url)
jaeger = JaegerTool(base_url=settings.jaeger_url)
agent = ObservabilityAgent(client, prometheus, jaeger)


@app.get("/")
def read_root():
    return {"message": "Observability Intelligence Agent"}


@app.post("/analyze")
async def analyze_stat(request: AnalysisRequest):
    result = await agent.analyze(
        request.service_name,
        request.time_range_minutes,
        request.question
    )
    conn = await get_connection()
    try:
        analysis_id = await save_analysis(conn, request.service_name, request.question, result)
    finally:
        await conn.close()
    return {"id": analysis_id, "result": result}


@app.get("/analyses")
async def get_stat():
    conn = await get_connection()
    try:
        analyses = await get_analyses(conn)
    finally:
        await conn.close()
    return {"analyses": analyses}
