import asyncio
from sqlalchemy import text
from app.core.database import engine

async def migrate():
    async with engine.begin() as conn:
        print("Creating 'plans' table...")
        try:
            await conn.execute(text("""
                CREATE TABLE IF NOT EXISTS plans (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title VARCHAR(100) NOT NULL,
                    duration VARCHAR(50) NOT NULL,
                    price FLOAT NOT NULL,
                    old_price FLOAT DEFAULT 0.0,
                    items TEXT,
                    is_recommended BOOLEAN DEFAULT 0,
                    is_active BOOLEAN DEFAULT 1
                )
            """))
            print("Successfully created 'plans' table.")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(migrate())
