import httpx


class JaegerTool:
    def __init__(self, base_url: str):
        self.base_url = base_url

    def _has_error(self, trace: dict) -> bool:
        for span in trace["spans"]:
            for tag in span["tags"]:
                if tag["key"] == "error" and tag["value"] == True:
                    return True
        return False

    async def get_traces_summary(self, service_name: str, limit: int = 20) -> dict:
        try:
            async with httpx.AsyncClient() as client:
                url = f"{self.base_url}/api/traces?service={service_name}&limit={limit}"
                response = await client.get(url)
                response.raise_for_status()
                data = response.json()
                traces = data["data"]
            total_traces = len(traces)

            error_traces = len(
                [trace for trace in traces if self._has_error(trace)])

            durations = [trace["spans"][0]
                         ["duration"] / 1000 for trace in traces]

            avg_duration_ms = sum(durations) / \
                len(durations) if durations else 0.0

            slow_operations = [span["operationName"]
                               for trace in traces
                               for span in trace["spans"]
                               if span["duration"] / 1000 > 1000]
            return {
                "total_traces": total_traces,
                "error_traces": error_traces,
                "avg_duration_ms": avg_duration_ms,
                "slow_operations": slow_operations,
                "status": "ok" if traces else "no_data"
            }
        except Exception:
            return {
                "total_traces": 0,
                "error_traces": 0,
                "avg_duration_ms": 0.0,
                "slow_operations": [],
                "status": "error"
            }
