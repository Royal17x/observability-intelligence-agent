from groq import Groq
from fastapi import FastAPI
from app.config.config import settings
from app.models.schemas import AnalysisRequest
from app.tools.prometheus_tool import PrometheusTool
from app.tools.jaeger_tool import JaegerTool
from app.agents.postmortem_agent import ObservabilityAgent

app = FastAPI()

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
    return {"result": result}
