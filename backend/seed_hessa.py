import asyncio
from passlib.context import CryptContext
from app.core.database import SessionLocal
# Import ALL models to ensure relationships are resolved
from app.models.employee import Employee
from app.models.salary_payment import SalaryPayment
from app.models.user import User
from app.models.product import Product
from app.models.order import Order
from app.models.admin import Admin
from sqlalchemy import select

# Configure password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

async def create_initial_employee():
    print("Connecting to DB to seed Hessa admin...")
    async with SessionLocal() as db:
        # Check if admin already exists
        existing = await db.execute(select(Employee).where(Employee.username == "admin"))
        if existing.scalar_one_or_none():
             print("Admin already exists.")
             return

        admin_employee = Employee(
            username="admin",
            full_name="Admin Hessa",
            hashed_password=get_password_hash("admin123"),
            role="admin",
            permissions=["all"],
            salary_rate=10000000,
            salary_currency="UZS",
            payment_day=5,
            is_active=True
        )
        db.add(admin_employee)
        await db.commit()
        print("Initial Hessa (admin) employee created successfully!")

if __name__ == "__main__":
    asyncio.run(create_initial_employee())
