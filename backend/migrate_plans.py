import asyncio
from sqlalchemy import text
from app.core.database import engine

async def migrate():
    async with engine.begin() as conn:
        print("Adding 'plans' column to 'products' table...")
        try:
            await conn.execute(text("ALTER TABLE products ADD COLUMN plans JSON"))
            print("Successfully added 'plans' column.")
        except Exception as e:
            if "duplicate column name" in str(e).lower():
                print("Column 'plans' already exists.")
            else:
                print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(migrate())
