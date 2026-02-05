import asyncio
from sqlalchemy import text
from app.core.database import engine

async def migrate():
    async with engine.begin() as conn:
        print("Adding composition column to products table...")
        try:
            await conn.execute(text("ALTER TABLE products ADD COLUMN composition JSON"))
            print("Successfully added composition column.")
        except Exception as e:
            if "duplicate column name" in str(e).lower():
                print("Column composition already exists.")
            else:
                print(f"Error adding column: {e}")

        print("Adding missing categories...")
        categories = [
            (5, "Женское здоровье", "/sets/female_set.png", "Ayollar salomatligi"),
            (6, "Мужской набор", "/sets/male_set.png", "Erkaklar salomatligi"),
            (7, "Фигура и метаболизм", "/sets/weight_set.png", "Metabolizm")
        ]
        for cid, name, img, name_uz in categories:
            try:
                await conn.execute(text(
                    "INSERT INTO categories (id, name, image, name_uz) VALUES (:id, :name, :image, :name_uz)"
                ), {"id": cid, "name": name, "image": img, "name_uz": name_uz})
                print(f"Added category: {name}")
            except Exception as e:
                print(f"Category {cid} already exists or error: {e}")

if __name__ == "__main__":
    asyncio.run(migrate())
