from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List

from ...core.database import get_db
from ...models.product import Product, Category
from ...schemas import product as schemas

router = APIRouter(tags=["products"])

# --- Categories ---

@router.post("/categories", response_model=schemas.CategoryRead)
async def create_category(category: schemas.CategoryCreate, db: AsyncSession = Depends(get_db)):
    # Check if exists
    stmt = select(Category).where(Category.name == category.name)
    result = await db.execute(stmt)
    if result.scalar_one_or_none():
         raise HTTPException(status_code=400, detail="Category already exists")
    
    db_category = Category(**category.model_dump())
    db.add(db_category)
    await db.commit()
    await db.refresh(db_category)
    return db_category

@router.get("/categories", response_model=List[schemas.CategoryRead])
async def read_categories(db: AsyncSession = Depends(get_db)):
    stmt = select(Category).options(selectinload(Category.products))
    result = await db.execute(stmt)
    categories = result.scalars().all()
    # Manually populate count (or use hybrid_property, but this is quick)
    for cat in categories:
        cat.products_count = len(cat.products)
    return categories

@router.put("/categories/{category_id}", response_model=schemas.CategoryRead)
async def update_category(category_id: int, category_data: schemas.CategoryUpdate, db: AsyncSession = Depends(get_db)):
    db_category = await db.get(Category, category_id)
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    for key, value in category_data.model_dump(exclude_unset=True).items():
        setattr(db_category, key, value)
    
    await db.commit()
    await db.refresh(db_category)
    return db_category

@router.delete("/categories/{category_id}")
async def delete_category(category_id: int, db: AsyncSession = Depends(get_db)):
    db_category = await db.get(Category, category_id)
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    await db.delete(db_category)
    await db.commit()
    return {"message": "Category deleted"}

# --- Products ---

@router.post("/products", response_model=schemas.ProductRead)
async def create_product(product: schemas.ProductCreate, db: AsyncSession = Depends(get_db)):
    # Check category exists
    category = await db.get(Category, product.category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    # Check SKU uniqueness
    stmt = select(Product).where(Product.sku == product.sku)
    result = await db.execute(stmt)
    if result.scalar_one_or_none():
         raise HTTPException(status_code=400, detail="Product with this SKU already exists")

    db_product = Product(**product.model_dump())
    db.add(db_product)
    await db.commit()
    
    # Reload with category relationship for response
    stmt = select(Product).options(selectinload(Product.category)).where(Product.id == db_product.id)
    result = await db.execute(stmt)
    return result.scalar_one()

@router.get("/products", response_model=List[schemas.ProductRead])
async def read_products(category_id: int = None, db: AsyncSession = Depends(get_db)):
    stmt = select(Product).options(selectinload(Product.category))
    if category_id:
        stmt = stmt.where(Product.category_id == category_id)
    result = await db.execute(stmt)
    return result.scalars().all()

@router.get("/products/{product_id}", response_model=schemas.ProductRead)
async def read_product(product_id: int, db: AsyncSession = Depends(get_db)):
    stmt = select(Product).options(selectinload(Product.category)).where(Product.id == product_id)
    result = await db.execute(stmt)
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.put("/products/{product_id}", response_model=schemas.ProductRead)
async def update_product(product_id: int, product_data: schemas.ProductUpdate, db: AsyncSession = Depends(get_db)):
    db_product = await db.get(Product, product_id)
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    update_data = product_data.model_dump(exclude_unset=True)
    
    # If category_id is being updated, check if it exists
    if "category_id" in update_data:
        category = await db.get(Category, update_data["category_id"])
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")
            
    for key, value in update_data.items():
        setattr(db_product, key, value)
        
    await db.commit()
    
    # Reload with transitions
    stmt = select(Product).options(selectinload(Product.category)).where(Product.id == product_id)
    result = await db.execute(stmt)
    return result.scalar_one()

@router.delete("/products/{product_id}")
async def delete_product(product_id: int, db: AsyncSession = Depends(get_db)):
    product = await db.get(Product, product_id)
    if not product:
         raise HTTPException(status_code=404, detail="Product not found")
    
    await db.delete(product)
    await db.commit()
    return {"ok": True}
