from groq import Groq
from fastapi import FastAPI
from app.config.config import settings
from app.models.schemas import AnalysisRequest
from app.tools.prometheus_tool import PrometheusTool
from app.tools.jaeger_tool import JaegerTool

app = FastAPI()

client = Groq(api_key=settings.groq_api_key)
prometheus = PrometheusTool(base_url=settings.prometheus_url)
jaeger = JaegerTool(base_url=settings.jaeger_url)


@app.get("/")
def read_root():
    return {"message": "Observability Intelligence Agent"}


@app.post("/analyze")
async def analyze_stat(request: AnalysisRequest):
    metrics = await prometheus.get_metrics(request.service_name, request.time_range_minutes)
    traces = await jaeger.get_traces_summary(request.service_name)
    return {
        "service": request.service_name,
        "question": request.question,
        "prometheus": metrics,
        "jaeger": traces
    }

# chat_completion = client.chat.completions.create(
#     model="llama-3.3-70b-versatile",
#     messages=[
#         {"role": "user", "content": "Hello"}
#     ],
#     max_tokens=1024
# )

# print(chat_completion.choices[0].message.content)
