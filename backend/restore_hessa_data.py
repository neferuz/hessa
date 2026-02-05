import asyncio
import json
import re
from sqlalchemy import select
from app.core.database import SessionLocal
# Category is defined in app.models.product
from app.models.product import Category, Product

def parse_price(price_str):
    # "145 000 сум" -> 145000.0
    digits = re.sub(r'[^\d]', '', price_str)
    return float(digits) if digits else 0.0

async def restore_data():
    print("Reading content_data.json...")
    try:
        with open("content_data.json", "r", encoding="utf-8") as f:
            data = json.load(f)
    except FileNotFoundError:
        print("Error: content_data.json not found!")
        return
    
    products_data = data.get("products", [])
    
    async with SessionLocal() as db:
        print("Restoring Categories and Products...")
        
        # 1. Create Categories
        category_map = {} # name -> id
        
        for p in products_data:
            cat_name = p.get("category")
            if not cat_name:
                continue
                
            if cat_name not in category_map:
                # Check DB first
                existing = await db.execute(select(Category).where(Category.name == cat_name))
                cat_obj = existing.scalar_one_or_none()
                
                if not cat_obj:
                    cat_obj = Category(
                        name=cat_name,
                        description_short=p.get("category_uz", ""), # storing UZ name in desc for now
                    )
                    db.add(cat_obj)
                    await db.commit()
                    await db.refresh(cat_obj)
                
                category_map[cat_name] = cat_obj.id
                print(f"Category processed: {cat_name}")
        
        # 2. Create Products
        for p in products_data:
            cat_name = p.get("category")
            if not cat_name or cat_name not in category_map:
                continue
            
            cat_id = category_map[cat_name]
            
            # Check if product exists by SKU or Name
            # Generating SKU based on ID to be consistent
            sku = f"HESSA-{p['id']:03d}"
            
            existing = await db.execute(select(Product).where(Product.sku == sku))
            if existing.scalar_one_or_none():
                # Update existing if needed, or skip
                continue
                
            price = parse_price(p.get("price", "0"))
            
            new_prod = Product(
                category_id=cat_id,
                name=p.get("name"),
                sku=sku,
                stock=100,
                description_short=p.get("name_en", ""),
                description_full=p.get("name_uz", ""),
                images=[p.get("image")] if p.get("image") else [],
                sale_price=price,
                cost_price=price * 0.5, # Dummy cost
                customs_percent=0,
                tax_percent=0,
                size_volume="Standard",
            )
            db.add(new_prod)
            print(f"Product restored: {p.get('name')}")
        
        await db.commit()
        print(f"Restoration Complete! Processed {len(products_data)} items.")

if __name__ == "__main__":
    asyncio.run(restore_data())
