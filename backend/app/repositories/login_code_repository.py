from datetime import datetime, timedelta

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from ..models.login_code import LoginCode


class LoginCodeRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_code(self, email: str, code: str, context: str) -> LoginCode:
        # помечаем старые коды как использованные
        await self.db.execute(
            update(LoginCode)
            .where(
                LoginCode.email == email,
                LoginCode.context == context,
                LoginCode.is_used.is_(False),
            )
            .values(is_used=True)
        )

        login_code = LoginCode(email=email, code=code, context=context)
        self.db.add(login_code)
        await self.db.commit()
        await self.db.refresh(login_code)
        return login_code

    async def get_valid_code(self, email: str, code: str, context: str) -> LoginCode | None:
        stmt = (
            select(LoginCode)
            .where(
                LoginCode.email == email,
                LoginCode.code == code,
                LoginCode.context == context,
                LoginCode.is_used.is_(False),
            )
            .order_by(LoginCode.created_at.desc())
        )
        result = await self.db.execute(stmt)
        login_code: LoginCode | None = result.scalars().first()
        if login_code and not login_code.is_expired:
            return login_code
        return None

    async def mark_used(self, login_code: LoginCode) -> None:
        login_code.is_used = True
        await self.db.commit()

