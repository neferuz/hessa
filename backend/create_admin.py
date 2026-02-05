"""
Script to create admin user
"""
import asyncio
import sys
from app.core.database import SessionLocal
from app.services.admin_service import AdminService
from app.models.admin import Admin

async def create_admin():
    async with SessionLocal() as db:
        service = AdminService(db)
        
        # Check if admin already exists
        existing_admin = await service.repository.get_by_username("admin")
        if existing_admin:
            print("Admin user already exists!")
            return
        
        # Create admin user
        admin = await service.create_admin("admin", "123456")
        print(f"Admin user created successfully!")
        print(f"Username: {admin.username}")
        print(f"ID: {admin.id}")

if __name__ == "__main__":
    asyncio.run(create_admin())
