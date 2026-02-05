from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List
from datetime import datetime

from ...core.database import get_db
from ...models.employee import Employee
from ...models.salary_payment import SalaryPayment
from ...schemas import employee as schemas

# For password hashing
from passlib.context import CryptContext
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

router = APIRouter(
    prefix="/employees",
    tags=["employees"]
)

def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# --- Employee CRUD ---

@router.get("/", response_model=List[schemas.EmployeeResponse])
async def get_employees(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Employee)
        .options(selectinload(Employee.salary_payments))
        .order_by(Employee.created_at.desc())
    )
    return result.scalars().all()

@router.post("/", response_model=schemas.EmployeeResponse)
async def create_employee(employee: schemas.EmployeeCreate, db: AsyncSession = Depends(get_db)):
    # Check existing user
    existing = await db.execute(select(Employee).filter(Employee.username == employee.username))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Username already registered")
    
    hashed_pwd = get_password_hash(employee.password)
    
    new_employee = Employee(
        username=employee.username,
        full_name=employee.full_name,
        hashed_password=hashed_pwd,
        role=employee.role,
        permissions=employee.permissions,
        salary_rate=employee.salary_rate,
        salary_currency=employee.salary_currency,
        payment_day=employee.payment_day,
        is_active=employee.is_active
    )
    
    db.add(new_employee)
    await db.commit()
    await db.refresh(new_employee)
    
    # Manually validate to avoid lazy load trigger on salary_payments
    resp_data = schemas.EmployeeResponse.model_validate(new_employee, from_attributes=True)
    resp_data.salary_payments = [] # It's new, so empty
    return resp_data

@router.get("/{employee_id}", response_model=schemas.EmployeeResponse)
async def get_employee(employee_id: int, db: AsyncSession = Depends(get_db)):
    query = select(Employee).options(selectinload(Employee.salary_payments)).where(Employee.id == employee_id)
    result = await db.execute(query)
    employee = result.scalar_one_or_none()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    return employee

@router.put("/{employee_id}", response_model=schemas.EmployeeResponse)
async def update_employee(employee_id: int, emp_update: schemas.EmployeeUpdate, db: AsyncSession = Depends(get_db)):
    query = select(Employee).options(selectinload(Employee.salary_payments)).where(Employee.id == employee_id)
    result = await db.execute(query)
    employee = result.scalar_one_or_none()
    
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    update_data = emp_update.model_dump(exclude_unset=True)
    
    if "password" in update_data and update_data["password"]:
        update_data["hashed_password"] = get_password_hash(update_data.pop("password"))
        
    for key, value in update_data.items():
        setattr(employee, key, value)
        
    await db.commit()
    await db.refresh(employee)
    return employee

@router.delete("/{employee_id}")
async def delete_employee(employee_id: int, db: AsyncSession = Depends(get_db)):
    query = select(Employee).where(Employee.id == employee_id)
    result = await db.execute(query)
    employee = result.scalar_one_or_none()
    
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
        
    await db.delete(employee)
    await db.commit()
    return {"message": "Employee deleted"}

# --- Salary Management ---

@router.post("/{employee_id}/pay", response_model=schemas.SalaryPaymentResponse)
async def pay_salary(employee_id: int, payment: schemas.SalaryPaymentCreate, db: AsyncSession = Depends(get_db)):
    query = select(Employee).where(Employee.id == employee_id)
    result = await db.execute(query)
    employee = result.scalar_one_or_none()
    
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
        
    new_payment = SalaryPayment(
        employee_id=employee_id,
        amount=payment.amount,
        currency=payment.currency,
        note=payment.note
    )
    
    db.add(new_payment)
    await db.commit()
    await db.refresh(new_payment)
    return new_payment

# --- Auth ---
@router.post("/login")
async def employee_login(creds: schemas.EmployeeLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Employee).where(Employee.username == creds.username))
    employee = result.scalar_one_or_none()
    
    if not employee or not verify_password(creds.password, employee.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    if not employee.is_active:
        raise HTTPException(status_code=403, detail="Employee account is inactive")
        
    employee.last_login = datetime.now()
    await db.commit()
    
    return {
        "id": employee.id,
        "username": employee.username,
        "full_name": employee.full_name,
        "role": employee.role,
        "permissions": employee.permissions
    }
