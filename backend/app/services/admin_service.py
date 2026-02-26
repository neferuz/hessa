from sqlalchemy.ext.asyncio import AsyncSession
from ..repositories.admin_repository import AdminRepository
from ..schemas.admin import AdminLogin
from ..models.admin import Admin
import hashlib
import hmac
from datetime import datetime, timedelta
from fastapi import HTTPException
import os
import json
import base64

SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production-hessa-admin-2024")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30 * 24 * 60  # 30 days

class AdminService:
    def __init__(self, db: AsyncSession):
        self.repository = AdminRepository(db)

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        # Простое сравнение хешей для демо (в продакшене использовать bcrypt)
        return hashed_password == self.get_password_hash(plain_password)

    def get_password_hash(self, password: str) -> str:
        # Простое хеширование для демо (в продакшене использовать bcrypt)
        return hashlib.sha256((password + SECRET_KEY).encode()).hexdigest()

    def create_access_token(self, data: dict):
        # Простая реализация токена без JWT библиотеки
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire.isoformat()})
        
        # Создаем простой токен: base64(header.payload.signature)
        header = {"alg": "HS256", "typ": "JWT"}
        payload = to_encode
        
        header_b64 = base64.urlsafe_b64encode(json.dumps(header).encode()).decode().rstrip('=')
        payload_b64 = base64.urlsafe_b64encode(json.dumps(payload).encode()).decode().rstrip('=')
        
        signature = hmac.new(
            SECRET_KEY.encode(),
            f"{header_b64}.{payload_b64}".encode(),
            hashlib.sha256
        ).digest()
        signature_b64 = base64.urlsafe_b64encode(signature).decode().rstrip('=')
        
        return f"{header_b64}.{payload_b64}.{signature_b64}"

    async def login(self, login_data: AdminLogin):
        admin = await self.repository.get_by_username(login_data.username)
        if not admin:
            raise HTTPException(status_code=401, detail="Неверный логин или пароль")
        
        if not self.verify_password(login_data.password, admin.hashed_password):
            raise HTTPException(status_code=401, detail="Неверный логин или пароль")
        
        access_token = self.create_access_token(data={"sub": admin.username, "admin_id": admin.id})
        return {
            "id": admin.id,
            "username": admin.username,
            "token": access_token
        }

    async def create_admin(self, username: str, password: str):
        hashed_password = self.get_password_hash(password)
        admin = Admin(
            username=username,
            hashed_password=hashed_password
        )
        return await self.repository.create(admin)