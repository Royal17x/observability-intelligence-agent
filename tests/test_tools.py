import pytest
from unittest.mock import AsyncMock
from app.tools.prometheus_tool import PrometheusTool
from app.tools.jaeger_tool import JaegerTool
from unittest.mock import AsyncMock, Mock, patch


@pytest.mark.asyncio
async def test_prometheus_returns_no_data_when_empty():
    tool = PrometheusTool(base_url="http://localhost:9090")
    tool._query = AsyncMock(return_value=None)

    result = await tool.get_metrics("test_service", 60)

    assert result["status"] == "no_data"
    assert result["rps"] is None


@pytest.mark.asyncio
async def test_prometheus_returns_ok_when_has_data():
    tool = PrometheusTool(base_url="http://localhost:9090")
    tool._query = AsyncMock(return_value=1.5)

    result = await tool.get_metrics("test_service", 60)

    assert result["rps"] == 1.5
    assert result["status"] == "ok"


@pytest.mark.asyncio
async def test_jaeger_calculates_avg_duration():
    tool = JaegerTool(base_url="http://localhost:16686")

    mock_response = Mock()
    mock_response.json.return_value = {
        "data": [
            {"spans": [{"duration": 2000, "operationName": "op1", "tags": []}]},
            {"spans": [{"duration": 4000, "operationName": "op2", "tags": []}]}
        ]
    }
    mock_response.raise_for_status = Mock()

    mock_client = AsyncMock()
    mock_client.get = AsyncMock(return_value=mock_response)

    with patch("httpx.AsyncClient") as mock_class:
        mock_class.return_value.__aenter__ = AsyncMock(
            return_value=mock_client)
        mock_class.return_value.__aexit__ = AsyncMock(return_value=None)
        result = await tool.get_traces_summary("test")

    assert result["total_traces"] == 2
    assert result["avg_duration_ms"] == 3.0
