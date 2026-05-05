import aiohttp
import yaml
from pathlib import Path


def load_metrics_config() -> dict:
    config_path = Path(__file__).parent.parent.parent / "metrics_config.yaml"
    with open(config_path) as f:
        return yaml.safe_load(f)


METRICS_CONFIG = load_metrics_config()


class PrometheusTool:
    def __init__(self, base_url: str):
        self.base_url = base_url

    async def _query(self, promql: str) -> float | None:
        try:
            url = f"{self.base_url}/api/v1/query?query={promql}"
            async with aiohttp.ClientSession() as session:
                async with session.get(url) as response:
                    data = await response.json()
                    result = data["data"]["result"]
                    if not result:
                        return None
                    return float(result[0]["value"][1])
        except Exception as e:
            print(f"PROMETHEUS ERROR: {e}")
            return None

    async def get_metrics(self, service_name: str, time_range_minutes: int) -> dict:
        range_str = f"{max(time_range_minutes, 5)}m"

        service_config = METRICS_CONFIG["services"].get(
            service_name,
            METRICS_CONFIG["services"]["default"]
        )

        rps_query = service_config["rps"].format(service=service_name, range=range_str)
        p99_query = service_config["p99"].format(service=service_name, range=range_str)
        errors_query = service_config["errors"].format(service=service_name, range=range_str)

        rps = await self._query(rps_query)
        p99 = await self._query(p99_query)
        error_rate = await self._query(errors_query)

        return {
            "rps": rps,
            "p99_latency": p99,
            "error_rate": error_rate,
            "status": "ok" if any([rps, p99, error_rate]) else "no_data"
        }

    async def get_services(self) -> list[str]:
        try:
            url = f"{self.base_url}/api/v1/targets"
            async with aiohttp.ClientSession() as session:
                async with session.get(url) as response:
                    data = await response.json()
                    targets = data["data"]["activeTargets"]
                    return [t["labels"]["job"] for t in targets]
        except Exception:
            return []