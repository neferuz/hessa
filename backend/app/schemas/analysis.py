from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

class AnalysisRequestCreate(BaseModel):
    user_id: int
    address: Optional[str] = None
    scheduled_date: Optional[datetime] = None

class AnalysisRequestUpdate(BaseModel):
    status: Optional[str] = None
    scheduled_date: Optional[datetime] = None
    result_file_url: Optional[str] = None
    doctor_notes: Optional[str] = None

class AnalysisRequestOut(BaseModel):
    id: int
    user_id: int
    address: Optional[str]
    status: str
    scheduled_date: Optional[datetime]
    result_file_url: Optional[str]
    doctor_notes: Optional[str]
    created_at: datetime
    completed_at: Optional[datetime]

    model_config = ConfigDict(from_attributes=True)
