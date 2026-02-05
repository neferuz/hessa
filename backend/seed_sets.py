import asyncio
import json
from sqlalchemy import text
from app.core.database import engine

async def seed_products():
    with open("content_data.json", "r") as f:
        data = json.load(f)
    
    products_to_seed = [p for p in data["products"] if p["id"] in [5, 6, 7]]
    
    async with engine.begin() as conn:
        for p in products_to_seed:
            print(f"Seeding product: {p['name']}")
            try:
                # Prepare data
                images_json = json.dumps([p["image"]])
                composition_json = json.dumps(p.get("composition", {}))
                
                await conn.execute(text("""
                    INSERT INTO products (
                        id, category_id, name, sku, stock, 
                        description_short, description_full, images, 
                        size_volume, details, usage, delivery_info, 
                        cost_price, customs_percent, tax_percent, 
                        sale_price, composition
                    ) VALUES (
                        :id, :category_id, :name, :sku, :stock, 
                        :description_short, :description_full, :images, 
                        :size_volume, :details, :usage, :delivery_info, 
                        :cost_price, :customs_percent, :tax_percent, 
                        :sale_price, :composition
                    )
                """), {
                    "id": p["id"],
                    "category_id": p["id"], # IDs match in content_data for simplicity
                    "name": p["name"],
                    "sku": f"SET-{p['id']}",
                    "stock": 50,
                    "description_short": p.get("details", ""),
                    "description_full": p.get("indications", ""),
                    "images": images_json,
                    "size_volume": "1 pack",
                    "details": p.get("details", ""),
                    "usage": "Follow instructions",
                    "delivery_info": "Standard delivery",
                    "cost_price": 100000.0,
                    "customs_percent": 0.0,
                    "tax_percent": 0.0,
                    "sale_price": float(p["price"].replace(" ", "").replace("сум", "")),
                    "composition": composition_json
                })
                print(f"Successfully seeded {p['name']}")
            except Exception as e:
                print(f"Error seeding {p['name']}: {e}")

if __name__ == "__main__":
    asyncio.run(seed_products())
