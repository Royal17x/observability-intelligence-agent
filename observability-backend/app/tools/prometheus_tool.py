from urllib.parse import quote

import aiohttp


class PrometheusTool:
    def __init__(self, base_url: str):
        self.base_url = base_url

    async def _query(self, promql: str) -> float | None:
        try:
            url = f"{self.base_url}/api/v1/query?query={promql}"
            async with aiohttp.ClientSession() as session:
                async with session.get(url) as response:
                    print(f"STATUS: {response.status}, URL: {url[:80]}")
                    data = await response.json()
                    result = data["data"]["result"]
                    if not result:
                        return None
                    return float(result[0]["value"][1])
        except Exception as e:
            print(f"ERROR: {e}")
            return None

    async def get_metrics(self, service_name: str, time_range_minutes: int) -> dict:
        range_str = f"{max(time_range_minutes, 5)}m"

        rps = await self._query(
            f'rate(flagr_http_requests_total{{job="{service_name}"}}[{range_str}])'
        )
        p99 = await self._query(
            f'histogram_quantile(0.99, rate(flagr_http_request_duration_seconds_bucket{{job="{service_name}"}}[{range_str}]))'
        )
        error_rate = await self._query(
            f'rate(flagr_http_requests_total{{job="{service_name}",status=~"5.."}}[{range_str}])'
        )
        return {
            "rps": rps,
            "p99_latency": p99,
            "error_rate": error_rate,
            "status": "ok" if any([rps, p99, error_rate]) else "no_data"
        }
