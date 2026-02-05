from pydantic import BaseModel
from typing import Optional

class PlanBase(BaseModel):
    title: str
    duration: str
    price: float
    old_price: float = 0.0
    items: Optional[str] = None
    is_recommended: bool = False
    is_active: bool = True

class PlanCreate(PlanBase):
    pass

class PlanUpdate(BaseModel):
    title: Optional[str] = None
    duration: Optional[str] = None
    price: Optional[float] = None
    old_price: Optional[float] = None
    items: Optional[str] = None
    is_recommended: Optional[bool] = None
    is_active: Optional[bool] = None

class PlanRead(PlanBase):
    id: int

    class Config:
        from_attributes = True
