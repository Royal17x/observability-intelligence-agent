import asyncpg
from app.config.config import settings


async def get_connection():
    return await asyncpg.connect(settings.database_url)


async def create_tables():
    conn = await get_connection()
    try:
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS analyses (
            id UUID PRIMARY KEY,
            service_name TEXT NOT NULL,
            question TEXT NOT NULL,
            result TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT NOW()
            )                           
        """)
    finally:
        await conn.close()
