from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..models.user import User

class UserRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, user_id: int):
        result = await self.db.execute(select(User).filter(User.id == user_id))
        return result.scalars().first()

    async def get_by_username(self, username: str):
        result = await self.db.execute(select(User).filter(User.username == username))
        return result.scalars().first()

    async def get_by_referral_code(self, referral_code: str):
        result = await self.db.execute(select(User).filter(User.referral_code == referral_code))
        return result.scalars().first()

    async def create(self, user: User):
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        return user

    async def update(self, user_id: int, update_data: dict):
        result = await self.db.execute(select(User).filter(User.id == user_id))
        user = result.scalars().first()
        if not user:
            return None
        
        for key, value in update_data.items():
            if value is not None:
                setattr(user, key, value)
        
        await self.db.commit()
        await self.db.refresh(user)
        return user

    async def get_all(self):
        result = await self.db.execute(select(User).order_by(User.id.desc()))
        return result.scalars().all()
