from pydantic import BaseModel, EmailStr
from typing import Optional

class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    region: Optional[str] = None
    address: Optional[str] = None
    full_name: Optional[str] = None

class UserResponse(UserBase):
    id: int
    phone: Optional[str] = None
    region: Optional[str] = None
    address: Optional[str] = None
    full_name: Optional[str] = None
    referral_code: Optional[str] = None
    tokens: int = 0

    class Config:
        from_attributes = True

class UserShort(BaseModel):
    id: int
    username: str
    full_name: Optional[str] = None

    class Config:
        from_attributes = True
