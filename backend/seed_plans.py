import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db, engine
from app.models.plan import Plan

async def seed_plans():
    async with AsyncSession(engine) as db:
        # Create sample plans
        plans_data = [
            {
                "title": "1 месяц",
                "duration": "30 дней",
                "price": 150000,
                "old_price": 200000,
                "items": "1 баночка витаминов, персональная консультация",
                "is_recommended": False,
                "is_active": True
            },
            {
                "title": "3 месяца",
                "duration": "90 дней",
                "price": 400000,
                "old_price": 550000,
                "items": "3 баночки витаминов, бесплатная доставка, персональная консультация",
                "is_recommended": True,
                "is_active": True
            },
            {
                "title": "6 месяцев",
                "duration": "180 дней",
                "price": 700000,
                "old_price": 1000000,
                "items": "6 баночек витаминов, бесплатная доставка, приоритетная поддержка, персональный план питания",
                "is_recommended": False,
                "is_active": True
            }
        ]

        for plan_data in plans_data:
            plan = Plan(**plan_data)
            db.add(plan)
        
        await db.commit()
        print("✅ Successfully seeded 3 plans!")

if __name__ == "__main__":
    asyncio.run(seed_plans())
