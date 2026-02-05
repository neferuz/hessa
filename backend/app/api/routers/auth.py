from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from ...core.database import get_db
from ...schemas.auth import RequestCodePayload, VerifyCodePayload, AuthUserResponse
from ...schemas.admin import AdminLogin, AdminResponse
from ...services.auth_service import AuthService
from ...services.admin_service import AdminService

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/request-code")
async def request_code(payload: RequestCodePayload, db: AsyncSession = Depends(get_db)):
    """
    Запросить 4‑значный код для email.
    Для dev возвращаем код прямо в ответе.
    """
    service = AuthService(db)
    return await service.request_code(payload)


@router.post("/verify-code", response_model=AuthUserResponse)
async def verify_code(payload: VerifyCodePayload, db: AsyncSession = Depends(get_db)):
    """
    Проверить код и вернуть пользователя.
    """
    service = AuthService(db)
    return await service.verify_code(payload)


@router.post("/admin/login", response_model=AdminResponse)
async def admin_login(login_data: AdminLogin, db: AsyncSession = Depends(get_db)):
    """
    Авторизация админа по логину и паролю.
    """
    service = AdminService(db)
    return await service.login(login_data)

