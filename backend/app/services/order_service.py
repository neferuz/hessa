from sqlalchemy.ext.asyncio import AsyncSession
from ..repositories.order_repository import OrderRepository
from ..schemas.order import OrderCreate, OrderUpdate
from ..models.order import Order
import uuid
from datetime import datetime

class OrderService:
    def __init__(self, db: AsyncSession):
        self.repository = OrderRepository(db)

    async def create_order(self, order_data: OrderCreate):
        db_order = Order(
            user_id=order_data.user_id,
            order_number=order_data.order_number or f"ORD-{uuid.uuid4().hex[:8].upper()}",
            status=order_data.status,
            payment_status=order_data.payment_status,
            payment_method=order_data.payment_method,
            region=order_data.region,
            address=order_data.address,
            products=order_data.products,
            total_amount=order_data.total_amount,
            duration=order_data.duration,
        )
        return await self.repository.create(db_order)

    async def get_order(self, order_id: int):
        return await self.repository.get_by_id(order_id)

    async def get_user_orders(self, user_id: int):
        return await self.repository.get_by_user_id(user_id)

    async def update_order(self, order_id: int, order_data: OrderUpdate):
        update_dict = order_data.model_dump(exclude_unset=True)
        return await self.repository.update(order_id, update_dict)
