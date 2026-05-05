import uuid
import asyncpg


async def save_analysis(conn: asyncpg.Connection, service_name: str, question: str, result: str) -> str:
    analysis_id = str(uuid.uuid4())
    await conn.execute(
        "INSERT INTO analyses (id, service_name, question, result) VALUES ($1, $2, $3, $4)",
        analysis_id, service_name, question, result
    )

    return analysis_id


async def get_analyses(conn: asyncpg.Connection, limit: int = 10) -> list[dict]:
    rows = await conn.fetch(
        "SELECT * FROM analyses "
        "ORDER BY created_at DESC "
        "LIMIT $1", limit
    )
    analyses = [dict(row) for row in rows]
    return analyses
