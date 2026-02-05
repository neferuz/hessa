import asyncio
from app.core.database import engine, Base
from app.models import employee, salary_payment, admin
# Import all other models needed for tables
from app.models import category, product, user, order

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Database `hessa.db` recreated successfully!")

if __name__ == "__main__":
    asyncio.run(init_db())
