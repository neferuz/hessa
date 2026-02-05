import asyncio
import json
from sqlalchemy import text
from app.core.database import engine

async def update_images():
    async with engine.begin() as conn:
        print("Updating product images in database...")
        img_map = {
            5: json.dumps(["/static/sets/female_set.png"]),
            6: json.dumps(["/static/sets/male_set.png"]),
            7: json.dumps(["/static/sets/weight_set.png"])
        }
        
        for pid, imgs in img_map.items():
            try:
                await conn.execute(text(
                    "UPDATE products SET images = :imgs WHERE id = :id"
                ), {"imgs": imgs, "id": pid})
                print(f"Updated images for product {pid}")
            except Exception as e:
                print(f"Error updating product {pid}: {e}")

        print("Updating category images...")
        cat_map = {
            5: "/static/sets/female_set.png",
            6: "/static/sets/male_set.png",
            7: "/static/sets/weight_set.png"
        }
        for cid, img in cat_map.items():
            try:
                await conn.execute(text(
                    "UPDATE categories SET image = :img WHERE id = :id"
                ), {"img": img, "id": cid})
                print(f"Updated image for category {cid}")
            except Exception as e:
                print(f"Error updating category {cid}: {e}")

if __name__ == "__main__":
    asyncio.run(update_images())
