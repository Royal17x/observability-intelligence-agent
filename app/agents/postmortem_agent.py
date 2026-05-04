import json
from groq import Groq
from app.tools.prometheus_tool import PrometheusTool
from app.tools.jaeger_tool import JaegerTool
from app.config.logging import logger

TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "get_prometheus_metrics",
            "description": "Получает метрики сервиса из Prometheus: RPS, latency p99, error rate. Используй когда нужно понять производительность сервиса.",
            "parameters": {
                "type": "object",
                "properties": {
                    "service_name": {
                        "type": "string",
                        "description": "Название сервиса"
                    },
                    "time_range_minutes": {
                        "type": "integer",
                        "description": "Период анализа в минутах"
                    }
                },
                "required": ["service_name", "time_range_minutes"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_jaeger_traces",
            "description": "Получает трейсы сервиса из Jaeger: количество ошибок, среднее время, медленные операции. Используй когда нужно найти где именно тормозит или падает.",
            "parameters": {
                "type": "object",
                "properties": {
                    "service_name": {
                        "type": "string",
                        "description": "Название сервиса"
                    }
                },
                "required": ["service_name"]
            }
        }
    }
]


class ObservabilityAgent:
    def __init__(self, groq_client: Groq, prometheus: PrometheusTool, jaeger: JaegerTool):
        self.client = groq_client
        self.prometheus = prometheus
        self.jaeger = jaeger

    async def _execute_tool(self, function_name: str, arguments: dict) -> dict:
        if function_name == "get_prometheus_metrics":
            return await self.prometheus.get_metrics(
                arguments["service_name"],
                arguments["time_range_minutes"]
            )
        elif function_name == "get_jaeger_traces":
            return await self.jaeger.get_traces_summary(
                arguments["service_name"]
            )
        return {"error": "unknown tool"}

    async def analyze(self, service_name: str, time_range_minutes: int, question: str) -> str:
        logger.info("analysis_started",
                    service=service_name, question=question)
        prompt = f"""Ты — эксперт по анализу production-систем.
Проанализируй сервис '{service_name}' за последние {time_range_minutes} минут.
Вопрос: {question}

Используй инструменты чтобы получить данные. Затем дай анализ:
1. Что сейчас происходит с сервисом
2. Есть ли проблемы и насколько они критичны
3. Конкретные рекомендации
Отвечай на русском языке. Make no mistakes."""

        messages = [{"role": "user", "content": prompt}]

        while True:
            response = self.client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=messages,
                tools=TOOLS,
                max_tokens=1024
            )

            finish_reason = response.choices[0].finish_reason

            if finish_reason == "stop":
                return response.choices[0].message.content

            if finish_reason == "tool_calls":
                messages.append(response.choices[0].message)

                for tool_call in response.choices[0].message.tool_calls:
                    function_name = tool_call.function.name
                    arguments = json.loads(tool_call.function.arguments)
                    logger.info("tool_called", tool=function_name,
                                arguments=arguments)
                    result = await self._execute_tool(function_name, arguments)
                    logger.info("analysis_completed", service=service_name)
                    messages.append({
                        "role": "tool",
                        "tool_call_id": tool_call.id,
                        "content": json.dumps(result)
                    })
