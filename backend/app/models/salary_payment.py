from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, Float, ForeignKey, String, DateTime
from sqlalchemy.sql import func
from ..core.database import Base
from datetime import datetime

class SalaryPayment(Base):
    __tablename__ = "salary_payments"

    id: Mapped[int] = mapped_column(primary_key=True)
    employee_id: Mapped[int] = mapped_column(ForeignKey("employees.id"), index=True)
    
    amount: Mapped[float] = mapped_column(Float)
    currency: Mapped[str] = mapped_column(String(10), default="USD")
    payment_date: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    note: Mapped[str] = mapped_column(String(255), nullable=True)
    
    # Relationship
    employee: Mapped["Employee"] = relationship("Employee", back_populates="salary_payments")
