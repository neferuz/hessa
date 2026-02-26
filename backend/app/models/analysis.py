from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Integer, ForeignKey, DateTime, Text
from sqlalchemy.sql import func
from ..core.database import Base
from typing import Optional
from datetime import datetime

class AnalysisRequest(Base):
    __tablename__ = "analysis_requests"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    
    # Request details
    address: Mapped[Optional[str]] = mapped_column(String(500), nullable=True) # Defaults to user address or provided
    status: Mapped[str] = mapped_column(String(50), default="pending")  # pending, scheduled, completed, cancelled
    
    # Scheduled visit (could be set by admin or user, we'll leave it simple for now)
    scheduled_date: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    
    # Results
    result_file_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True) # PDF or image URL saved to static
    doctor_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True) # Notes added by admin
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    
    # Relationship
    user = relationship("User")
