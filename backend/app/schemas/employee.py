from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime

# --- Salary Schemas ---
class SalaryPaymentBase(BaseModel):
    amount: float
    currency: str = "USD"
    note: Optional[str] = None

class SalaryPaymentCreate(SalaryPaymentBase):
    pass

class SalaryPaymentResponse(SalaryPaymentBase):
    id: int
    employee_id: int
    payment_date: datetime
    
    model_config = ConfigDict(from_attributes=True)

# --- Employee Schemas ---
class EmployeeBase(BaseModel):
    username: str
    full_name: str
    role: str = "staff"
    permissions: List[str] = []
    salary_rate: float = 0.0
    salary_currency: str = "UZS"
    payment_day: int = 15
    phone: Optional[str] = None
    email: Optional[str] = None
    telegram: Optional[str] = None
    note: Optional[str] = None
    is_active: bool = True

class EmployeeCreate(EmployeeBase):
    password: str

class EmployeeUpdate(BaseModel):
    full_name: Optional[str] = None
    role: Optional[str] = None
    permissions: Optional[List[str]] = None
    salary_rate: Optional[float] = None
    salary_currency: Optional[str] = None
    payment_day: Optional[int] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    telegram: Optional[str] = None
    note: Optional[str] = None
    is_active: Optional[bool] = None
    password: Optional[str] = None

class EmployeeResponse(EmployeeBase):
    id: int
    created_at: datetime
    last_login: Optional[datetime] = None
    salary_payments: List[SalaryPaymentResponse] = []

    model_config = ConfigDict(from_attributes=True)

class EmployeeLogin(BaseModel):
    username: str
    password: str
