from pydantic import BaseModel
from datetime import datetime
from .user import UserResponse

class QRGenerateResponse(BaseModel):
    token: str
    expires_at: datetime

class QRStatusResponse(BaseModel):
    status: str  # 'pending' | 'authorized' | 'expired'
    user: UserResponse | None = None

class QRAuthorizePayload(BaseModel):
    token: str
    telegram_id: str
    username: str | None = None
    full_name: str | None = None
