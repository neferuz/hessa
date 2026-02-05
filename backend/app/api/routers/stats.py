from fastapi import APIRouter, Depends
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.models.user import User
from app.models.employee import Employee
from app.models.product import Product
# from app.models.order import Order # using User for now if Order not fully set

router = APIRouter()

@router.get("/")
async def get_stats(db: AsyncSession = Depends(get_db)):
    # Count Users
    users_result = await db.execute(select(func.count(User.id)))
    users_count = users_result.scalar() or 0
    
    # Count Employees
    employees_result = await db.execute(select(func.count(Employee.id)))
    employees_count = employees_result.scalar() or 0
    
    # Count Products
    products_result = await db.execute(select(func.count(Product.id)))
    products_count = products_result.scalar() or 0
    
    # Mock Revenue (or calc via orders if we had them restored)
    # For now, simplistic
    revenue = 0 
    
    return {
        "users_count": users_count,
        "employees_count": employees_count,
        "products_count": products_count,
        "revenue": 125000000, # Mocked for "Style" demo
        "active_now": 3,
        "trends": {
            "users": "+12%",
            "revenue": "+8%",
            "products": "+4"
        }
    }
