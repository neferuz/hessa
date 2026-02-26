from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import joinedload
from ..models.order import Order

class OrderRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, order_id: int):
        result = await self.db.execute(
            select(Order)
            .options(joinedload(Order.user))
            .filter(Order.id == order_id)
        )
        return result.scalars().first()

    async def get_by_user_id(self, user_id: int):
        result = await self.db.execute(
            select(Order)
            .options(joinedload(Order.user))
            .filter(Order.user_id == user_id)
            .order_by(Order.created_at.desc())
        )
        return result.scalars().all()

    async def create(self, order: Order):
        self.db.add(order)
        await self.db.commit()
        await self.db.refresh(order)
        
        # Reload with joined user to satisfy OrderResponse schema
        result = await self.db.execute(
            select(Order)
            .options(joinedload(Order.user))
            .filter(Order.id == order.id)
        )
        return result.scalars().first()

    async def update(self, order_id: int, update_data: dict):
        result = await self.db.execute(
            select(Order)
            .options(joinedload(Order.user))
            .filter(Order.id == order_id)
        )
        order = result.scalars().first()
        if not order:
            return None
        
        for key, value in update_data.items():
            if value is not None:
                setattr(order, key, value)
        
        await self.db.commit()
        await self.db.refresh(order)
        return order

    async def get_all(self):
        result = await self.db.execute(
            select(Order)
            .options(joinedload(Order.user))
            .order_by(Order.created_at.desc())
        )
        return result.scalars().all()
