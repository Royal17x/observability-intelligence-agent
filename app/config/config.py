from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    groq_api_key: str
    database_url: str
    prometheus_url: str
    jaeger_url: str

    class Config:
        env_file = ".env"


settings = Settings()
