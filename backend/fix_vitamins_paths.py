import asyncio
import json
from sqlalchemy import text
from app.core.database import engine

async def fix_paths():
    async with engine.begin() as conn:
        print("Standardizing image paths in database...")
        # Update products
        img_map = {
            1: json.dumps(["/static/vitamins-1.png"]),
            2: json.dumps(["/static/vitamins-2.png"]),
            3: json.dumps(["/static/vitamins-3.png"]),
            4: json.dumps(["/static/vitamins-1.png"])
        }
        for pid, imgs in img_map.items():
            await conn.execute(text(
                "UPDATE products SET images = :imgs WHERE id = :id"
            ), {"imgs": imgs, "id": pid})
            print(f"Updated product {pid}")

        # Update categories
        cat_map = {
            1: "/static/vitamins-1.png",
            2: "/static/vitamins-2.png",
            3: "/static/vitamins-3.png",
            4: "/static/vitamins-1.png"
        }
        for cid, img in cat_map.items():
            await conn.execute(text(
                "UPDATE categories SET image = :img WHERE id = :id"
            ), {"img": img, "id": cid})
            print(f"Updated category {cid}")

if __name__ == "__main__":
    asyncio.run(fix_paths())
