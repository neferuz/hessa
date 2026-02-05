import asyncio
import json
from sqlalchemy import select, update
from app.core.database import SessionLocal
from app.models.product import Category

async def update_categories_images():
    print("Reading content_data.json...")
    try:
        with open("content_data.json", "r", encoding="utf-8") as f:
            data = json.load(f)
    except FileNotFoundError:
        print("Error: content_data.json not found!")
        return
    
    products_data = data.get("products", [])
    
    async with SessionLocal() as db:
        print("Updating Category Images...")
        
        # We will use a map to store the first image found for each category
        cat_image_map = {}
        
        for p in products_data:
            cat_name = p.get("category")
            img = p.get("image")
            if cat_name and img and cat_name not in cat_image_map:
                cat_image_map[cat_name] = img
        
        # Now update DB
        for cat_name, img_path in cat_image_map.items():
            # Check if category exists
            existing = await db.execute(select(Category).where(Category.name == cat_name))
            cat_obj = existing.scalar_one_or_none()
            
            if cat_obj:
                # Update image
                cat_obj.image = img_path
                db.add(cat_obj)
                print(f"Updated category '{cat_name}' with image '{img_path}'")
            else:
                print(f"Category '{cat_name}' not found in DB")
        
        await db.commit()
        print("Categories updated successfully!")

if __name__ == "__main__":
    asyncio.run(update_categories_images())
