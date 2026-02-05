import json
import os
from app.schemas.about import AboutData

DATA_FILE = "about_data.json"

DEFAULT_DATA = {
    "hero": {
        "heading": "OUR STORY. <br /> PURE HESSA",
        "heading_uz": "OUR STORY. <br /> PURE HESSA", 
        "heading_en": "OUR STORY. <br /> PURE HESSA",
        "desc_left": "Мы начали с одной простой цели: создать продукты, которые действительно работают, используя только самые чистые и проверенные наукой ингредиенты.",
        "desc_left_uz": "Biz oddiy maqsaddan boshladik: faqat eng toza va ilmiy tasdiqlangan ingredientlardan foydalanib, haqiqatan ham ishlaydigan mahsulotlar yaratish.",
        "desc_left_en": "We started with one simple goal: to create products that truly work, using only the cleanest and scientifically proven ingredients.",
        "desc_right": "Сегодня Hessa — это сообщество людей, стремящихся к лучшему качеству жизни. Мы верим в прозрачность, честность и результат.",
        "desc_right_uz": "Bugungi kunda Hessa — bu hayot sifatini yaxshilashga intilayotgan odamlar hamjamiyati. Biz shaffoflik, halollik va natijaga ishonamiz.",
        "desc_right_en": "Today Hessa is a community of people striving for a better quality of life. We believe in transparency, honesty, and results.",
        "image": "/about_philosophy_lifestyle.png"
    },
    "metrics": [
        {"id": "1", "title": "3+ года", "title_uz": "3+ yil", "title_en": "3+ years", "text": "Своё производство и контроль качества", "text_uz": "O'z ishlab chiqarish va sifat nazorati", "text_en": "Own production and quality control"},
        {"id": "2", "title": "1 млн+", "title_uz": "1 mln+", "title_en": "1 mln+", "text": "Активных клиентов по всему миру", "text_uz": "Dunyo bo'ylab faol mijozlar", "text_en": "Active clients worldwide"},
        {"id": "3", "title": "60+", "title_uz": "60+", "title_en": "60+", "text": "Сертифицированных комплексов", "text_uz": "Sertifikatlangan komplekslar", "text_en": "Certified complexes"},
        {"id": "4", "title": "100%", "title_uz": "100%", "title_en": "100%", "text": "Чистое сырьё. Проверенные ингредиенты из ЕС и США", "text_uz": "Toza xomashyo. Yevropa va AQShdan tasdiqlangan ingredientlar", "text_en": "Pure raw materials. Verified ingredients from EU and USA"}
    ],
    "values": [
        {"id": "1", "title": "Безопасность", "title_uz": "Xavfsizlik", "title_en": "Safety", "desc": "Многоступенчатая проверка каждой партии в независимых лабораториях.", "desc_uz": "Mustaqil laboratoriyalarda har bir partiyani ko'p bosqichli tekshirish.", "desc_en": "Multi-stage verification of each batch in independent laboratories.", "icon": "Shield"},
        {"id": "2", "title": "Наука", "title_uz": "Fan", "title_en": "Science", "desc": "Формулы, разработанные на основе последних клинических исследований.", "desc_uz": "So'nggi klinik tadqiqotlar asosida ishlab chiqilgan formulalar.", "desc_en": "Formulas developed based on the latest clinical studies.", "icon": "Microscope"},
        {"id": "3", "title": "Результат", "title_uz": "Natija", "title_en": "Result", "desc": "Мы фокусируемся на высокой биодоступности для достижения видимого эффекта.", "desc_uz": "Biz ko'zga ko'rinadigan natijaga erishish uchun yuqori bio-moslashuvchanlikka e'tibor qaratamiz.", "desc_en": "We focus on high bioavailability to achieve a visible effect.", "icon": "Zap"}
    ]
}

class AboutRepository:
    def __init__(self):
        self.file_path = DATA_FILE
        self._ensure_file_exists()

    def _ensure_file_exists(self):
        if not os.path.exists(self.file_path):
            with open(self.file_path, "w") as f:
                json.dump(DEFAULT_DATA, f, indent=4)

    def get_data(self) -> AboutData:
        try:
            with open(self.file_path, "r") as f:
                data = json.load(f)
            return AboutData(**data)
        except Exception as e:
            # Fallback if file is corrupted
            return AboutData(**DEFAULT_DATA)

    def update_data(self, data: AboutData) -> AboutData:
        with open(self.file_path, "w") as f:
            json.dump(data.model_dump(), f, indent=4)
        return data

about_repo = AboutRepository()
