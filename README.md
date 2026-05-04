# Observability Intelligence Agent

> AI-агент для анализа production-систем: коррелирует метрики Prometheus, трейсы Jaeger и логи, объясняет на человеческом языке что происходит и почему.

## Stack

- **Backend:** Python, FastAPI
- **AI:** Groq API (Llama 3.3), Tool Use
- **Observability:** Prometheus, Jaeger / OpenTelemetry
- **Database:** PostgreSQL, asyncpg
- **Infra:** Docker Compose, GitHub Actions

## Architecture
```
User → POST /analyze → ObservabilityAgent
                           ↓ tool_calls
                    PrometheusTool → Prometheus HTTP API
                    JaegerTool     → Jaeger HTTP API
                           ↓ results
                    Groq LLM (Llama 3.3) → analysis text
                           ↓
                    PostgreSQL (save + return id)
```
## Observability

- Metrics: http://localhost:8000/metrics (Prometheus format)
- Prometheus UI: http://localhost:9090
- Jaeger UI: http://localhost:16686

## Quick Start

```bash
cp .env.example .env
# заполни .env
docker-compose up
```

API доступен на `http://localhost:8000`
Swagger UI: `http://localhost:8000/docs`

## Endpoints

- `POST /analyze` — анализ сервиса

## Author

Royal17x — https://github.com/Royal17x