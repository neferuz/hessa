import asyncio
import logging
import os
from aiogram import Bot, Dispatcher, types, F
from aiogram.filters import Command
from aiogram.types import ReplyKeyboardMarkup, KeyboardButton, WebAppInfo, InlineKeyboardMarkup, InlineKeyboardButton
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

TOKEN = os.getenv("BOT_TOKEN")
WEBAPP_URL = os.getenv("WEBAPP_URL", "https://hessa.uz") # Default if not set

if not TOKEN:
    # Use the token provided by user if not in .env
    TOKEN = "8045133629:AAGMUrr51SLiyJ37b74g71AqLVAV9HNBDd4"

# Configure logging
logging.basicConfig(level=logging.INFO)

# Initialize bot and dispatcher
bot = Bot(token=TOKEN)
dp = Dispatcher()

@dp.message(Command("start"))
async def cmd_start(message: types.Message):
    """
    Handle /start command.
    Request phone number from user.
    """
    kb = [
        [
            KeyboardButton(text="Отправить номер телефона 📱", request_contact=True)
        ]
    ]
    keyboard = ReplyKeyboardMarkup(keyboard=kb, resize_keyboard=True, one_time_keyboard=True)
    
    await message.answer(
        "Добро пожаловать в HESSA! 👋\n\n"
        "Для продолжения и персонализации вашего опыта, пожалуйста, поделитесь вашим номером телефона.",
        reply_markup=keyboard
    )

@dp.message(F.contact)
async def handle_contact(message: types.Message):
    """
    Handle shared contact.
    """
    contact = message.contact
    # Here you would typically save the contact to the database
    # For now, just thank the user and show the WebApp button
    
    inline_kb = [
        [
            InlineKeyboardButton(
                text="Заказать витамины 💊", 
                web_app=WebAppInfo(url=WEBAPP_URL)
            )
        ]
    ]
    keyboard = InlineKeyboardMarkup(inline_keyboard=inline_kb)
    
    await message.answer(
        f"Спасибо, {contact.first_name}! Ваша регистрация завершена. ✅\n\n"
        "Теперь вы можете открыть наш магазин и заказать персональные витамины Hessa прямо здесь, в Telegram.",
        reply_markup=keyboard
    )

async def main():
    await dp.start_polling(bot)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except (KeyboardInterrupt, SystemExit):
        logging.info("Bot stopped")
