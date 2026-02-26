from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..models.qr_login import QRLogin
from datetime import datetime

class QRLoginRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, qr_login: QRLogin) -> QRLogin:
        self.db.add(qr_login)
        await self.db.commit()
        await self.db.refresh(qr_login)
        return qr_login

    async def get_by_token(self, token: str) -> QRLogin | None:
        result = await self.db.execute(select(QRLogin).filter(QRLogin.token == token))
        return result.scalars().first()

    async def update(self, qr_login: QRLogin) -> QRLogin:
        self.db.add(qr_login)
        await self.db.commit()
        await self.db.refresh(qr_login)
        return qr_login

    async def clean_expired(self):
        # Implementation for cleaning old tokens if needed
        pass
