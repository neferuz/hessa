from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from ...core.database import get_db
from ...services.order_service import OrderService
from ...schemas.order import OrderCreate, OrderResponse, OrderUpdate

router = APIRouter(prefix="/orders", tags=["orders"])

@router.post("/", response_model=OrderResponse)
async def create_order(order_in: OrderCreate, db: AsyncSession = Depends(get_db)):
    service = OrderService(db)
    return await service.create_order(order_in)

@router.get("/user/{user_id}", response_model=list[OrderResponse])
async def get_user_orders(user_id: int, db: AsyncSession = Depends(get_db)):
    service = OrderService(db)
    return await service.get_user_orders(user_id)

@router.get("/all/list", response_model=list[OrderResponse])
async def get_all_orders(db: AsyncSession = Depends(get_db)):
    service = OrderService(db)
    return await service.get_all_orders()

@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(order_id: int, db: AsyncSession = Depends(get_db)):
    service = OrderService(db)
    order = await service.get_order(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.put("/{order_id}", response_model=OrderResponse)
async def update_order(order_id: int, order_update: OrderUpdate, db: AsyncSession = Depends(get_db)):
    service = OrderService(db)
    order = await service.update_order(order_id, order_update)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order
