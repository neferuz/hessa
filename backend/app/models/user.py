from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String
from typing import Optional, List
from ..core.database import Base

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    email: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    telegram_id: Mapped[Optional[str]] = mapped_column(String(50), unique=True, index=True, nullable=True)
    hashed_password: Mapped[str] = mapped_column(String(255))
    phone: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    region: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    address: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    full_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    referral_code: Mapped[Optional[str]] = mapped_column(String(20), unique=True, index=True, nullable=True)
    tokens: Mapped[int] = mapped_column(default=0)
    
    # Relationship
    orders: Mapped[List["Order"]] = relationship("Order", back_populates="user", cascade="all, delete-orphan")