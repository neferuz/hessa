from sqlalchemy.ext.asyncio import AsyncSession
from ..models.qr_login import QRLogin
from ..models.user import User
from ..repositories.qr_repository import QRLoginRepository
from ..repositories.user_repository import UserRepository
from ..schemas.qr_login import QRGenerateResponse, QRStatusResponse, QRAuthorizePayload
from datetime import datetime, timedelta
from fastapi import HTTPException

class QRService:
    def __init__(self, db: AsyncSession):
        self.qr_repo = QRLoginRepository(db)
        self.user_repo = UserRepository(db)

    async def generate_token(self) -> QRGenerateResponse:
        qr = QRLogin()
        created = await self.qr_repo.create(qr)
        return QRGenerateResponse(
            token=created.token,
            expires_at=created.created_at + timedelta(minutes=5)
        )

    async def get_status(self, token: str) -> QRStatusResponse:
        qr = await self.qr_repo.get_by_token(token)
        if not qr:
            raise HTTPException(status_code=404, detail="Token not found")
        
        if qr.is_expired and qr.status == "pending":
            qr.status = "expired"
            await self.qr_repo.update(qr)

        return QRStatusResponse(
            status=qr.status,
            user=qr.user if qr.status == "authorized" else None
        )

    async def authorize(self, payload: QRAuthorizePayload) -> dict:
        qr = await self.qr_repo.get_by_token(payload.token)
        if not qr:
            raise HTTPException(status_code=404, detail="Token not found")
        
        if qr.is_expired:
            qr.status = "expired"
            await self.qr_repo.update(qr)
            raise HTTPException(status_code=400, detail="Token expired")

        if qr.status != "pending":
            raise HTTPException(status_code=400, detail=f"Token already {qr.status}")

        # Find or create user by telegram_id
        # We need a method in user_repo to get by telegram_id
        # Let's check user_repository.py again or just use a custom query
        from sqlalchemy import select
        result = await self.qr_repo.db.execute(select(User).filter(User.telegram_id == payload.telegram_id))
        user = result.scalars().first()

        if not user:
            # Create user
            user = User(
                username=payload.username or f"tg_{payload.telegram_id}",
                telegram_id=payload.telegram_id,
                full_name=payload.full_name,
                email=f"{payload.telegram_id}@telegram.user", # Placeholder
                hashed_password=""
            )
            self.qr_repo.db.add(user)
            await self.qr_repo.db.commit()
            await self.qr_repo.db.refresh(user)

        qr.user_id = user.id
        qr.status = "authorized"
        await self.qr_repo.update(qr)

        return {"status": "success"}
