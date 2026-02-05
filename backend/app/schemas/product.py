from pydantic import BaseModel
from typing import List, Optional

# --- Category Schemas ---
class CategoryBase(BaseModel):
    name: str
    image: Optional[str] = None
    description_short: Optional[str] = None
    description: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    image: Optional[str] = None
    description_short: Optional[str] = None
    description: Optional[str] = None

class CategoryRead(CategoryBase):
    id: int
    products_count: int = 0
    
    class Config:
        from_attributes = True

# --- Product Schemas ---
class ProductBase(BaseModel):
    name: str
    sku: str
    stock: int = 0
    category_id: int
    
    # Content
    description_short: Optional[str] = None
    description_full: Optional[str] = None
    images: Optional[List[str]] = []
    
    # Details
    size_volume: Optional[str] = None
    details: Optional[str] = None
    usage: Optional[str] = None
    delivery_info: Optional[str] = None
    
    # Economics
    cost_price: float = 0.0
    customs_percent: float = 0.0
    tax_percent: float = 0.0
    sale_price: float = 0.0
    composition: Optional[dict] = None
    plans: Optional[List[dict]] = []

class ProductCreate(ProductBase):
    pass

class ProductUpdate(ProductBase):
    name: Optional[str] = None
    sku: Optional[str] = None
    category_id: Optional[int] = None
    # All other fields optional for update... 
    # For simplicity in this iteration, we might just require full object or use generic update logic.
    # Let's keep it simple for now and expect full updates or specific patches.

class ProductRead(ProductBase):
    id: int
    category: Optional[CategoryRead] = None

    class Config:
        from_attributes = True
