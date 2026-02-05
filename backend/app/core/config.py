from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Hessa API"
    DATABASE_URL: str = "sqlite+aiosqlite:///./hessa.lls"

    # SMTP settings for email sending
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM_NAME: str = "HESSA"

    class Config:
        env_file = ".env"

settings = Settings()
