from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum


class Severity(str, Enum):
    critical = "critical"
    high = "high"
    medium = "medium"
    low = "low"


class AnalysisRequest(BaseModel):
    service_name: str
    time_range_minutes: int
    question: str


class Issue(BaseModel):
    severity: Severity
    title: str
    description: str
    metric_source: str


class AnalysisResponse(BaseModel):
    service_name: str
    issues: list[Issue]
    summary: str
    recomendations: list[str]
    analyzed_at: datetime = Field(default_factory=datetime.datetime.utc)
