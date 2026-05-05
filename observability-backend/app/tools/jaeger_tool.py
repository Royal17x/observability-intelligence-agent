import aiohttp


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
            url = f"{self.base_url}/api/traces?service={service_name}&limit={limit}"
            async with aiohttp.ClientSession() as session:
                async with session.get(url) as response:
                    data = await response.json()
                    traces = data["data"]

            total_traces = len(traces)
            error_traces = len([t for t in traces if self._has_error(t)])
            durations = [t["spans"][0]["duration"] / 1000 for t in traces]
            avg_duration_ms = sum(durations) / \
                len(durations) if durations else 0.0
            slow_operations = [
                span["operationName"]
                for trace in traces
                for span in trace["spans"]
                if span["duration"] / 1000 > 1000
            ]
            return {
                "total_traces": total_traces,
                "error_traces": error_traces,
                "avg_duration_ms": avg_duration_ms,
                "slow_operations": slow_operations,
                "status": "ok" if traces else "no_data"
            }
        except Exception as e:
            print(f"JAEGER ERROR: {e}")
            return {
                "total_traces": 0,
                "error_traces": 0,
                "avg_duration_ms": 0.0,
                "slow_operations": [],
                "status": "error"
            }
