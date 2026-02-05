from pydantic import BaseModel, EmailStr

from .user import UserResponse


class RequestCodePayload(BaseModel):
    email: EmailStr
    context: str | None = "login"  # 'login' | 'quiz'


class VerifyCodePayload(BaseModel):
    email: EmailStr
    code: str
    context: str | None = "login"


class AuthUserResponse(UserResponse):
    """
    Ответ при успешной проверке кода.
    Пока без JWT/куков — фронт сохраняет это в localStorage.
    """

    pass

