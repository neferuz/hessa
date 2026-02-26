from datetime import datetime, timedelta
import uuid

from sqlalchemy import String, Boolean, DateTime, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..core.database import Base


class QRLogin(Base):
    """
    Модель для сессий QR-авторизации.
    """

    __tablename__ = "qr_logins"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    token: Mapped[str] = mapped_column(String(255), unique=True, index=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("users.id"), nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="pending")  # 'pending' | 'authorized' | 'expired'
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, index=True
    )

    user = relationship("User")

    @property
    def is_expired(self) -> bool:
        # Сессия живёт 5 минут
        return self.created_at < datetime.utcnow() - timedelta(minutes=5)
