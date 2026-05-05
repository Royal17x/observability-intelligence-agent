import asyncpg
from app.config.config import settings

_pool = None

async def get_pool():
    global _pool
    if _pool is None:
        _pool = await asyncpg.create_pool(
            settings.database_url,
            min_size=2,
            max_size=10
        )
    return _pool

async def create_tables():
    pool = await get_pool()
    async with pool.acquire() as conn:
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS analyses (
                id UUID PRIMARY KEY,
                service_name TEXT NOT NULL,
                question TEXT NOT NULL,
                result TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT NOW()
            )
        """)