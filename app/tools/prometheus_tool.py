import httpx


class PrometheusTool:
    def __init__(self, base_url: str):
        self.base_url = base_url

    async def _query(self, promql: str) -> float | None:
        try:

            async with httpx.AsyncClient() as client:
                url = f"{self.base_url}/api/v1/query?query={promql}"
                response = await client.get(url)
                response.raise_for_status()
                data = response.json()
                result = data["data"]["result"]
                if not result:
                    return None
                return float(result[0]["value"][1])

        except Exception:
            return None

    async def get_metrics(self, service_name: str, time_range_minutes: int) -> dict:
        rps = await self._query("rate(http_requests_total[5m])")
        p99 = await self._query(
            "histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))")
        error_rate = await self._query(
            'rate(http_requests_total{status=~"5.."}[5m])')
        return {
            "rps": rps,
            "p99 latency": p99,
            "error_rate": error_rate,
            "status": "ok" if any([rps, p99, error_rate]) else "no_data"
        }
