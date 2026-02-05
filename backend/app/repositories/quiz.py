import json
import os
from typing import List
from app.schemas.quiz import QuizData, QuizQuestion, QuizOption

DATA_FILE = "quiz_data.json"

# Данные по умолчанию из frontend-client/app/login/data.ts
DEFAULT_DATA = {
    "questions": [
        {
            "id": "name",
            "section": "Блок 1: Общий профиль",
            "section_uz": "Blok 1: Umumiy profil",
            "section_en": "Block 1: General Profile",
            "label": "Как нам к вам обращаться?",
            "label_uz": "Sizga qanday murojaat qilamiz?",
            "label_en": "How should we address you?",
            "type": "input",
            "placeholder": "Ваше имя",
            "placeholder_uz": "Ismingiz",
            "placeholder_en": "Your name",
            "options": [],
            "order": 0
        },
        {
            "id": "gender",
            "section": "Блок 1: Общий профиль",
            "section_uz": "Blok 1: Umumiy profil",
            "section_en": "Block 1: General Profile",
            "label": "Ваш пол:",
            "label_uz": "Jinsingiz:",
            "label_en": "Your gender:",
            "type": "options",
            "placeholder": "",
            "placeholder_uz": "",
            "placeholder_en": "",
            "options": [
                {"id": "male", "text": "Мужчина", "text_uz": "Erkak", "text_en": "Male"},
                {"id": "female", "text": "Женщина", "text_uz": "Ayol", "text_en": "Female"}
            ],
            "order": 1
        },
        {
            "id": "age",
            "section": "Блок 1: Общий профиль",
            "section_uz": "Blok 1: Umumiy profil",
            "section_en": "Block 1: General Profile",
            "label": "Укажите ваш возраст:",
            "label_uz": "Yoshingizni ko'rsating:",
            "label_en": "Specify your age:",
            "type": "options",
            "placeholder": "",
            "placeholder_uz": "",
            "placeholder_en": "",
            "options": [
                {"id": "u25", "text": "До 25 лет", "text_uz": "25 yoshgacha", "text_en": "Under 25"},
                {"id": "25-45", "text": "25–45 лет", "text_uz": "25–45 yosh", "text_en": "25–45 years"},
                {"id": "45+", "text": "45 лет и старше", "text_uz": "45 yosh va undan yuqori", "text_en": "45 and older"}
            ],
            "order": 2
        },
        {
            "id": "activity",
            "section": "Блок 1: Общий профиль",
            "section_uz": "Blok 1: Umumiy profil",
            "section_en": "Block 1: General Profile",
            "label": "Каков ваш типичный уровень физической активности?",
            "label_uz": "Jismoniy faollik darajangiz qanday?",
            "label_en": "What is your typical level of physical activity?",
            "type": "options",
            "placeholder": "",
            "placeholder_uz": "",
            "placeholder_en": "",
            "options": [
                {"id": "low", "text": "Низкий (сидячая работа, мало движения)", "text_uz": "Past (o'tirgan ish, kam harakat)", "text_en": "Low (sedentary work, little movement)"},
                {"id": "mid", "text": "Средний (прогулки, 1-2 тренировки в неделю)", "text_uz": "O'rtacha (sayrlar, haftasiga 1-2 mashq)", "text_en": "Medium (walks, 1-2 workouts per week)"},
                {"id": "high", "text": "Высокий (регулярный спорт, физический труд)", "text_uz": "Yuqori (muntazam sport, jismoniy mehnat)", "text_en": "High (regular sports, physical labor)"}
            ],
            "order": 3
        },
        {
            "id": "energy_level",
            "section": "Блок 2: Энергия и продуктивность",
            "section_uz": "Blok 2: Energiya va samaradorlik",
            "section_en": "Block 2: Energy and Productivity",
            "label": "Как бы вы описали свой уровень энергии в течение дня?",
            "label_uz": "Kun davomida energiya darajangizni qanday tavsiflay olasiz?",
            "label_en": "How would you describe your energy level throughout the day?",
            "type": "options",
            "placeholder": "",
            "placeholder_uz": "",
            "placeholder_en": "",
            "options": [
                {"id": "high", "text": "Энергии хватает на всё", "text_uz": "Energiya hamma narsaga yetadi", "text_en": "Enough energy for everything"},
                {"id": "drops_noon", "text": "Устаю уже к обеду", "text_uz": "Tushlikka kelib charchayman", "text_en": "Tired by lunch"},
                {"id": "low_morning", "text": "Чувствую разбитость прямо с утра", "text_uz": "Ertalabdan boshlab yomon his qilaman", "text_en": "Feel exhausted right from the morning"}
            ],
            "order": 4
        },
        {
            "id": "brain_fog",
            "section": "Блок 2: Энергия и продуктивность",
            "section_uz": "Blok 2: Energiya va samaradorlik",
            "section_en": "Block 2: Energy and Productivity",
            "label": "Сталкиваетесь ли вы с «туманом в голове» или сложностью сфокусироваться?",
            "label_uz": "«Boshda tuman» yoki diqqatni jamlashda qiyinchilik bormi?",
            "label_en": "Do you experience 'brain fog' or difficulty focusing?",
            "type": "options",
            "placeholder": "",
            "placeholder_uz": "",
            "placeholder_en": "",
            "options": [
                {"id": "rare", "text": "Редко, голова всегда ясная", "text_uz": "Kamdan-kam, bosh doim aniq", "text_en": "Rarely, head is always clear"},
                {"id": "often", "text": "Часто, трудно долго удерживать внимание", "text_uz": "Tez-tez, diqqatni uzoq saqlash qiyin", "text_en": "Often, hard to maintain attention for long"},
                {"id": "constant", "text": "Постоянно чувствую когнитивную усталость", "text_uz": "Doimiy ravishda kognitiv charchoqni his qilaman", "text_en": "Constantly feel cognitive fatigue"}
            ],
            "order": 5
        },
        {
            "id": "mood",
            "section": "Блок 2: Энергия и продуктивность",
            "section_uz": "Blok 2: Energiya va samaradorlik",
            "section_en": "Block 2: Energy and Productivity",
            "label": "Бывают ли у вас моменты резкой смены настроения или раздражительности?",
            "label_uz": "Kayfiyatning keskin o'zgarishi yoki asabiylik paytlari bormi?",
            "label_en": "Do you have moments of sudden mood swings or irritability?",
            "type": "options",
            "placeholder": "",
            "placeholder_uz": "",
            "placeholder_en": "",
            "options": [
                {"id": "never", "text": "Почти никогда", "text_uz": "Deyarli hech qachon", "text_en": "Almost never"},
                {"id": "sometime", "text": "Иногда бывает", "text_uz": "Ba'zida bo'ladi", "text_en": "Sometimes happens"},
                {"id": "regular", "text": "Регулярно, трудно контролировать эмоции", "text_uz": "Muntazam, his-tuyg'ularni nazorat qilish qiyin", "text_en": "Regularly, hard to control emotions"}
            ],
            "order": 6
        },
        {
            "id": "stress",
            "section": "Блок 3: Стресс и сон",
            "section_uz": "Blok 3: Stress va uyqu",
            "section_en": "Block 3: Stress and Sleep",
            "label": "Оцените ваш средний уровень стресса за последний месяц:",
            "label_uz": "O'tgan oy davomida o'rtacha stress darajangizni baholang:",
            "label_en": "Rate your average stress level over the past month:",
            "type": "options",
            "placeholder": "",
            "placeholder_uz": "",
            "placeholder_en": "",
            "options": [
                {"id": "low", "text": "Низкий (всё под контролем)", "text_uz": "Past (hamma narsa nazorat ostida)", "text_en": "Low (everything under control)"},
                {"id": "mid", "text": "Умеренный (бывают авралы и переживания)", "text_uz": "O'rtacha (shoshilinch vaqtlar va tashvishlar bo'ladi)", "text_en": "Moderate (there are rush periods and worries)"},
                {"id": "high", "text": "Высокий (живу в состоянии постоянного напряжения)", "text_uz": "Yuqori (doimiy kuchlanish holatida yashayman)", "text_en": "High (living in constant tension)"}
            ],
            "order": 7
        },
        {
            "id": "sleep_onset",
            "section": "Блок 3: Стресс и сон",
            "section_uz": "Blok 3: Stress va uyqu",
            "section_en": "Block 3: Stress and Sleep",
            "label": "Как быстро вы обычно засыпаете?",
            "label_uz": "Odatda qanchalik tez uxlayapsiz?",
            "label_en": "How quickly do you usually fall asleep?",
            "type": "options",
            "placeholder": "",
            "placeholder_uz": "",
            "placeholder_en": "",
            "options": [
                {"id": "fast", "text": "Мгновенно (в течение 10–15 минут)", "text_uz": "Zudlik bilan (10-15 daqiqa ichida)", "text_en": "Instantly (within 10-15 minutes)"},
                {"id": "thoughts", "text": "Долго кручусь, прокручивая события дня", "text_uz": "Uzoq vaqt aylanib, kun voqealarini takrorlayman", "text_en": "Toss and turn for a long time, replaying the day's events"},
                {"id": "insomnia", "text": "Часто страдаю от бессонницы", "text_uz": "Ko'pincha uyqusizlikdan azob chekaman", "text_en": "Often suffer from insomnia"}
            ],
            "order": 8
        },
        {
            "id": "tension",
            "section": "Блок 3: Стресс и сон",
            "section_uz": "Blok 3: Stress va uyqu",
            "section_en": "Block 3: Stress and Sleep",
            "label": "Чувствуете ли вы мышечное напряжение или мелкие судороги?",
            "label_uz": "Mushak kuchlanishi yoki kichik kramplarni his qilyapsizmi?",
            "label_en": "Do you feel muscle tension or minor cramps?",
            "type": "options",
            "placeholder": "",
            "placeholder_uz": "",
            "placeholder_en": "",
            "options": [
                {"id": "no", "text": "Нет", "text_uz": "Yo'q", "text_en": "No"},
                {"id": "rare", "text": "Изредка", "text_uz": "Kamdan-kam", "text_en": "Rarely"},
                {"id": "often", "text": "Да, довольно часто", "text_uz": "Ha, juda tez-tez", "text_en": "Yes, quite often"}
            ],
            "order": 9
        },
        {
            "id": "joints",
            "section": "Блок 4: Физические показатели",
            "section_uz": "Blok 4: Jismoniy ko'rsatkichlar",
            "section_en": "Block 4: Physical Indicators",
            "label": "Беспокоит ли вас состояние суставов или плотность костной ткани?",
            "label_uz": "Bo'g'imlar holati yoki suyak to'qimasining zichligi sizni bezovta qiladimi?",
            "label_en": "Are you concerned about joint condition or bone density?",
            "type": "options",
            "placeholder": "",
            "placeholder_uz": "",
            "placeholder_en": "",
            "options": [
                {"id": "fine", "text": "Нет, всё отлично", "text_uz": "Yo'q, hamma narsa ajoyib", "text_en": "No, everything is fine"},
                {"id": "start", "text": "Начинаю замечать дискомфорт", "text_uz": "Noqulaylikni seza boshlayman", "text_en": "Starting to notice discomfort"},
                {"id": "prio", "text": "Да, это мой приоритет", "text_uz": "Ha, bu mening ustuvorligim", "text_en": "Yes, this is my priority"}
            ],
            "order": 10
        },
        {
            "id": "immunity",
            "section": "Блок 4: Физические показатели",
            "section_uz": "Blok 4: Jismoniy ko'rsatkichlar",
            "section_en": "Block 4: Physical Indicators",
            "label": "Как часто вы замечаете у себя признаки снижения иммунитета?",
            "label_uz": "Immunitet pasayishi belgilarini qanchalik tez-tez sezasiz?",
            "label_en": "How often do you notice signs of decreased immunity?",
            "type": "options",
            "placeholder": "",
            "placeholder_uz": "",
            "placeholder_en": "",
            "options": [
                {"id": "rare", "text": "Очень редко", "text_uz": "Juda kamdan-kam", "text_en": "Very rarely"},
                {"id": "few", "text": "2–3 раза в год", "text_uz": "Yilda 2-3 marta", "text_en": "2-3 times a year"},
                {"id": "regular", "text": "Регулярно чувствую недомогание", "text_uz": "Muntazam ravishda noto'g'ri his qilaman", "text_en": "Regularly feel unwell"}
            ],
            "order": 11
        },
        {
            "id": "diet",
            "section": "Блок 4: Физические показатели",
            "section_uz": "Blok 4: Jismoniy ko'rsatkichlar",
            "section_en": "Block 4: Physical Indicators",
            "label": "Придерживаетесь ли вы ограничений в питании?",
            "label_uz": "Ovqatlanishda cheklovlarga rioya qilyapsizmi?",
            "label_en": "Do you follow dietary restrictions?",
            "type": "options",
            "placeholder": "",
            "placeholder_uz": "",
            "placeholder_en": "",
            "options": [
                {"id": "all", "text": "Ем всё", "text_uz": "Hamma narsani yeyman", "text_en": "Eat everything"},
                {"id": "veg", "text": "Вегетарианец / Веган", "text_uz": "Vegetarian / Vegan", "text_en": "Vegetarian / Vegan"},
                {"id": "keto", "text": "Кето-диета / Интервальное голодание", "text_uz": "Keto-dieta / Interval ochlik", "text_en": "Keto diet / Intermittent fasting"}
            ],
            "order": 12
        },
        {
            "id": "priority_sphere",
            "section": "Блок 5: Цели и приоритеты",
            "section_uz": "Blok 5: Maqsadlar va ustuvorliklar",
            "section_en": "Block 5: Goals and Priorities",
            "label": "Какая сфера жизни сейчас требует наибольшей поддержки?",
            "label_uz": "Hayotning qaysi sohasi hozir eng ko'p qo'llab-quvvatlashni talab qiladi?",
            "label_en": "Which area of life currently requires the most support?",
            "type": "options",
            "placeholder": "",
            "placeholder_uz": "",
            "placeholder_en": "",
            "options": [
                {"id": "career", "text": "Карьера и обучение (нужен острый ум)", "text_uz": "Karyera va ta'lim (o'tkir aql kerak)", "text_en": "Career and learning (need sharp mind)"},
                {"id": "psycho", "text": "Психологический комфорт (нужно спокойствие)", "text_uz": "Psixologik qulaylik (tinchlik kerak)", "text_en": "Psychological comfort (need calm)"},
                {"id": "body", "text": "Физическое здоровье и долголетие", "text_uz": "Jismoniy salomatlik va uzoq umr", "text_en": "Physical health and longevity"}
            ],
            "order": 13
        },
        {
            "id": "recovery",
            "section": "Блок 5: Цели и приоритеты",
            "section_uz": "Blok 5: Maqsadlar va ustuvorliklar",
            "section_en": "Block 5: Goals and Priorities",
            "label": "Важно ли для вас восстановление после работы или тренировок?",
            "label_uz": "Ish yoki mashqlardan keyin tiklanish siz uchun muhimmi?",
            "label_en": "Is recovery after work or training important to you?",
            "type": "options",
            "placeholder": "",
            "placeholder_uz": "",
            "placeholder_en": "",
            "options": [
                {"id": "important", "text": "Да, это очень важно", "text_uz": "Ha, bu juda muhim", "text_en": "Yes, it's very important"},
                {"id": "desirable", "text": "Желательно, но не приоритетно", "text_uz": "Istisno, lekin ustuvor emas", "text_en": "Desirable, but not a priority"},
                {"id": "no", "text": "Нет необходимости", "text_uz": "Kerak yo'q", "text_en": "Not necessary"}
            ],
            "order": 14
        },
        {
            "id": "main_goal",
            "section": "Блок 5: Цели и приоритеты",
            "section_uz": "Blok 5: Maqsadlar va ustuvorliklar",
            "section_en": "Block 5: Goals and Priorities",
            "label": "Какой главный результат вы хотите получить от HESSA?",
            "label_uz": "HESSA dan qanday asosiy natija olishni xohlaysiz?",
            "label_en": "What main result do you want to get from HESSA?",
            "type": "options",
            "placeholder": "",
            "placeholder_uz": "",
            "placeholder_en": "",
            "options": [
                {"id": "prod", "text": "Максимум продуктивности и фокуса", "text_uz": "Maksimal samaradorlik va diqqat", "text_en": "Maximum productivity and focus"},
                {"id": "relax", "text": "Глубокое расслабление и качественный сон", "text_uz": "Chuqur dam olish va sifatli uyqu", "text_en": "Deep relaxation and quality sleep"},
                {"id": "health", "text": "Базовое здоровье и баланс", "text_uz": "Asosiy salomatlik va muvozanat", "text_en": "Basic health and balance"}
            ],
            "order": 15
        }
    ]
}

class QuizRepository:
    def __init__(self):
        self.file_path = DATA_FILE
        self._ensure_file_exists()

    def _ensure_file_exists(self):
        if not os.path.exists(self.file_path):
            with open(self.file_path, "w", encoding="utf-8") as f:
                json.dump(DEFAULT_DATA, f, indent=4, ensure_ascii=False)

    def get_quiz(self) -> QuizData:
        with open(self.file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        # Сортируем вопросы по порядку
        data["questions"] = sorted(data["questions"], key=lambda x: x.get("order", 0))
        return QuizData(**data)

    def update_quiz(self, data: QuizData) -> QuizData:
        # Сортируем вопросы по порядку перед сохранением
        sorted_questions = sorted(data.questions, key=lambda x: x.order)
        data.questions = sorted_questions
        
        with open(self.file_path, "w", encoding="utf-8") as f:
            json.dump(data.model_dump(), f, indent=4, ensure_ascii=False)
        
        # Возвращаем отсортированные данные
        return data

quiz_repo = QuizRepository()
