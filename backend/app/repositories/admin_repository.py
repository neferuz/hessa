from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..models.admin import Admin

class AdminRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_username(self, username: str):
        result = await self.db.execute(select(Admin).filter(Admin.username == username))
        return result.scalars().first()

    async def create(self, admin: Admin):
        self.db.add(admin)
        await self.db.commit()
        await self.db.refresh(admin)
        return admin
