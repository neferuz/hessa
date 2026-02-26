import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from sqlalchemy.ext.asyncio import AsyncSession
import asyncio

from ..repositories.user_repository import UserRepository
from ..repositories.login_code_repository import LoginCodeRepository
from ..schemas.auth import RequestCodePayload, VerifyCodePayload, AuthUserResponse
from ..models.user import User
from ..core.config import settings


def _generate_4_digit_code() -> str:
    import random

    return f"{random.randint(0, 9999):04d}"


def _generate_email_html(code: str, context: str) -> str:
    """
    Генерирует красивый HTML шаблон письма в стиле фронтенда HESSA.
    """
    title = "Ваш код для доступа к программе" if context == "quiz" else "Ваш код для входа в аккаунт"
    description = (
        "Используйте этот код для завершения регистрации и получения персональной программы."
        if context == "quiz"
        else "Используйте этот код для входа в ваш аккаунт HESSA."
    )

    return f"""
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Unbounded:wght@600;700;800&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; font-family: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #f5f5f5; line-height: 1.6;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, rgba(73, 122, 155, 0.05) 0%, rgba(73, 122, 155, 0.02) 100%);">
                            <h1 style="margin: 0; font-family: 'Unbounded', sans-serif; font-size: 32px; font-weight: 800; letter-spacing: -0.02em; color: #1a1a1a; text-transform: uppercase;">
                                HESSA
                            </h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 40px 50px;">
                            <h2 style="margin: 0 0 16px; font-family: 'Manrope', sans-serif; font-size: 24px; font-weight: 700; color: #1a1a1a; letter-spacing: -0.01em;">
                                {title}
                            </h2>
                            <p style="margin: 0 0 32px; font-size: 16px; color: #666; line-height: 1.6;">
                                {description}
                            </p>
                            
                            <!-- Code Box -->
                            <div style="background: linear-gradient(135deg, rgba(73, 122, 155, 0.1) 0%, rgba(73, 122, 155, 0.05) 100%); border: 2px solid rgba(73, 122, 155, 0.2); border-radius: 16px; padding: 32px; text-align: center; margin: 32px 0;">
                                <p style="margin: 0 0 12px; font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">
                                    Ваш код
                                </p>
                                <div style="display: inline-block; background-color: #ffffff; border: 2px solid rgba(73, 122, 155, 0.3); border-radius: 12px; padding: 20px 40px; margin: 8px 0;">
                                    <span style="font-family: 'Unbounded', sans-serif; font-size: 36px; font-weight: 800; letter-spacing: 0.2em; color: #497a9b; display: inline-block;">
                                        {code}
                                    </span>
                                </div>
                                <p style="margin: 16px 0 0; font-size: 13px; color: #999;">
                                    Код действителен в течение 10 минут
                                </p>
                            </div>
                            
                            <!-- Info -->
                            <p style="margin: 32px 0 0; font-size: 14px; color: #999; line-height: 1.6;">
                                Если вы не запрашивали этот код, просто проигнорируйте это письмо.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px 40px; background-color: #fafafa; border-top: 1px solid #eeeeee; text-align: center;">
                            <p style="margin: 0 0 8px; font-size: 14px; color: #666; font-weight: 500;">
                                С уважением,<br>
                                <span style="font-family: 'Unbounded', sans-serif; font-weight: 700; color: #1a1a1a;">Команда HESSA</span>
                            </p>
                            <p style="margin: 16px 0 0; font-size: 12px; color: #999;">
                                © 2026 HESSA. Все права защищены.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
"""


async def _send_email_via_smtp(to_email: str, code: str, context: str) -> None:
    """
    Отправляет email с кодом через SMTP (Gmail) с красивым HTML шаблоном.
    """
    if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        # Если SMTP не настроен, просто логируем код (для dev)
        print(f"[DEV] Email code for {to_email}: {code}")
        return

    try:
        # Формируем письмо
        message = MIMEMultipart("alternative")
        message["From"] = f"{settings.SMTP_FROM_NAME} <{settings.SMTP_USER}>"
        message["To"] = to_email
        
        if context == "quiz":
            message["Subject"] = "Ваш код для доступа к программе HESSA"
        else:
            message["Subject"] = "Ваш код для входа в HESSA"

        # Текстовая версия (fallback для старых клиентов)
        if context == "quiz":
            body_text = f"""Здравствуйте!

Ваш код для доступа к программе: {code}

Код действителен в течение 10 минут.

С уважением,
Команда HESSA"""
        else:
            body_text = f"""Здравствуйте!

Ваш код для входа в аккаунт: {code}

Код действителен в течение 10 минут.

С уважением,
Команда HESSA"""

        # HTML версия
        html_body = _generate_email_html(code=code, context=context)

        # Прикрепляем обе версии
        message.attach(MIMEText(body_text, "plain", "utf-8"))
        message.attach(MIMEText(html_body, "html", "utf-8"))

        # Отправляем через SMTP (синхронно в executor, чтобы не блокировать event loop)
        def _send_sync():
            try:
                with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=10) as server:
                    server.starttls()
                    server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
                    server.send_message(message)
                    return True
            except smtplib.SMTPRecipientsRefused as e:
                # Email адрес неверный или не существует
                print(f"[ERROR] Email address rejected: {to_email} - {e}")
                return False
            except smtplib.SMTPException as e:
                print(f"[ERROR] SMTP error sending to {to_email}: {e}")
                return False
            except Exception as e:
                print(f"[ERROR] Unexpected error sending email to {to_email}: {e}")
                return False
        
        success = await asyncio.get_event_loop().run_in_executor(None, _send_sync)
        if not success:
            # Если отправка не удалась, логируем код для dev/debugging
            print(f"[DEV] Email send failed for {to_email}, code was: {code}")
    except Exception as e:
        # Если отправка не удалась, логируем ошибку, но не падаем
        print(f"[ERROR] Failed to send email to {to_email}: {e}")
        # В dev режиме всё равно логируем код
        print(f"[DEV] Email code for {to_email}: {code}")


class AuthService:
    """
    Сервис для email + 4‑значный код с реальной отправкой через SMTP.
    """

    def __init__(self, db: AsyncSession):
        self.users = UserRepository(db)
        self.codes = LoginCodeRepository(db)

    async def request_code(self, payload: RequestCodePayload) -> dict:
        email = payload.email
        context = payload.context or "login"

        # если пользователя нет — создаём "пустого" с username=email
        existing_user = await self.users.get_by_username(email)
        if not existing_user:
            user = User(
                username=email,
                email=email,
                hashed_password="",  # мы не используем пароль
            )
            await self.users.create(user)

        code = _generate_4_digit_code()
        await self.codes.create_code(email=email, code=code, context=context)

        # Отправляем код на email
        await _send_email_via_smtp(to_email=email, code=code, context=context)

        # Возвращаем email и код (для dev)
        return {"email": email, "code": code}

    async def verify_code(self, payload: VerifyCodePayload) -> AuthUserResponse:
        email = payload.email
        code = payload.code
        context = payload.context or "login"

        login_code = await self.codes.get_valid_code(email=email, code=code, context=context)
        if not login_code:
            from fastapi import HTTPException

            raise HTTPException(status_code=400, detail="Неверный или просроченный код")

        # помечаем код использованным
        await self.codes.mark_used(login_code)

        user = await self.users.get_by_username(email)
        if not user:
            # Создаем нового пользователя
            user = User(
                username=email,
                email=email,
                hashed_password="",
                full_name=payload.full_name
            )
            created_user = await self.users.create(user)
            return AuthUserResponse.from_orm(created_user)
        else:
            # Обновляем имя, если передано и отличается
            if payload.full_name and user.full_name != payload.full_name:
                updated_user = await self.users.update(user.id, {"full_name": payload.full_name})
                if updated_user:
                    return AuthUserResponse.from_orm(updated_user)
            
            return AuthUserResponse.from_orm(user)

