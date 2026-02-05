from datetime import datetime, timedelta

from sqlalchemy import String, Boolean, DateTime
from sqlalchemy.orm import Mapped, mapped_column

from ..core.database import Base


class LoginCode(Base):
    """
    Простая модель для хранения одноразовых кодов входа.
    В проде лучше ограничивать по IP/частоте и чистить старые записи кроном.
    """

    __tablename__ = "login_codes"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), index=True)
    code: Mapped[str] = mapped_column(String(10))
    context: Mapped[str] = mapped_column(String(32), default="login")  # 'login' | 'quiz'
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, index=True
    )
    is_used: Mapped[bool] = mapped_column(Boolean, default=False, index=True)

    @property
    def is_expired(self) -> bool:
        # Код живёт 10 минут
        return self.created_at < datetime.utcnow() - timedelta(minutes=10)

