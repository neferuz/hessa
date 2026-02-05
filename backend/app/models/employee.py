from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Integer, Float, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func
from ..core.database import Base
from typing import List, Optional
from datetime import datetime

class Employee(Base):
    __tablename__ = "employees"

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    full_name: Mapped[str] = mapped_column(String(100))
    hashed_password: Mapped[str] = mapped_column(String(255))
    
    role: Mapped[str] = mapped_column(String(50), default="staff") # manager, content_editor, support, accountant, etc.
    permissions: Mapped[Optional[List[str]]] = mapped_column(JSON, default=[]) # List of permission keys: "orders", "products", "users", "finance"
    
    salary_rate: Mapped[float] = mapped_column(Float, default=0.0)
    salary_currency: Mapped[str] = mapped_column(String(10), default="UZS")
    payment_day: Mapped[int] = mapped_column(Integer, default=15)

    phone: Mapped[Optional[str]] = mapped_column(String(30), nullable=True)
    email: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    telegram: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    note: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)

    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    last_login: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    # Relationships
    salary_payments: Mapped[List["SalaryPayment"]] = relationship("SalaryPayment", back_populates="employee", cascade="all, delete-orphan")
