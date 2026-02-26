import json
import os

def generate_quiz():
    questions = []
    
    # 0. Gender (Foundation for others)
    questions.append({
        "id": "gender",
        "section": "Личные данные", "section_uz": "Shaxsiy ma'lumotlar", "section_en": "Personal Data",
        "label": "Ваш пол:", "label_uz": "Jinsingiz:", "label_en": "Your gender:",
        "type": "options", "gender": "both", "order": 0,
        "options": [
            {"id": "female", "text": "Женщина", "text_uz": "Ayol", "text_en": "Woman"},
            {"id": "male", "text": "Мужчина", "text_uz": "Erkak", "text_en": "Man"}
        ]
    })

    # 1. Priorities (Step 1)
    common_options_prio = [
        {"id": "energy", "text": "Энергия и бодрость на весь день", "text_uz": "Kun bo'yi energiya va tetiklik", "text_en": "Energy and vitality all day"},
        {"id": "stress", "text": "Спокойствие и устойчивость к стрессу", "text_uz": "Xotirjamlik va stressga chidamlilik", "text_en": "Calmness and stress resistance"},
        {"id": "sleep", "text": "Глубокий восстанавливающий сон", "text_uz": "Chuqur tiklovchi uyqu", "text_en": "Deep restorative sleep"},
        {"id": "immunity", "text": "Укрепление защитных сил организма", "text_uz": "Organizm himoya kuchlarini mustahkamlash", "text_en": "Strengthening immune system"},
        {"id": "beauty", "text": "Красота кожи, сияние волос, крепкие ногти", "text_uz": "Teri go'zalligi, sochlar jilosi, tirnoqlar mustahkamligi", "text_en": "Beauty of skin, hair, and nails"},
        {"id": "weight", "text": "Гармония веса и обмена веществ", "text_uz": "Vazn va moddalar almashinuvi garmoniyasi", "text_en": "Weight and metabolism harmony"},
        {"id": "focus", "text": "Ясный ум и фокус внимания", "text_uz": "Tiniq aql va diqqatni jamlash", "text_en": "Clear mind and focus"},
        {"id": "joints", "text": "Здоровье опорно-двигательной системы", "text_uz": "Tayanch-harakat tizimi salomatligi", "text_en": "Musculoskeletal health"}
    ]

    # Women priorities
    questions.append({
        "id": "priorities_f",
        "section": "🎯 ШАГ 1: ПРИОРИТЕТЫ", "section_uz": "🎯 1-QADAM: USTUVORLIKLAR", "section_en": "🎯 STEP 1: PRIORITIES",
        "label": "Отметьте до 3-х направлений, которые для вас наиболее важны сейчас:",
        "label_uz": "Hozirda siz uchun eng muhim bo'lgan 3 tagacha yo'nalishni belgilang:",
        "label_en": "Mark up to 3 areas that are most important to you now:",
        "type": "options", "gender": "female", "multiple": True, "order": 1,
        "options": common_options_prio + [{"id": "female_health", "text": "Баланс женского здоровья", "text_uz": "Ayollar salomatligi balansi", "text_en": "Women's health balance"}]
    })

    # Men priorities (Goals)
    questions.append({
        "id": "priorities_m",
        "section": "🎯 ШАГ 1: ЦЕЛИ", "section_uz": "🎯 1-QADAM: MAQSADLAR", "section_en": "🎯 STEP 1: GOALS",
        "label": "Выберите до 3-х приоритетных направлений:",
        "label_uz": "3 tagacha ustuvor yo'nalishni tanlang:",
        "label_en": "Select up to 3 priority areas:",
        "type": "options", "gender": "male", "multiple": True, "order": 1,
        "options": [
            {"id": "energy", "text": "Энергия и выносливость", "text_uz": "Energiya va chidamlilik", "text_en": "Energy and endurance"},
            {"id": "focus", "text": "Умственная работоспособность", "text_uz": "Aqliy ish qobiliyati", "text_en": "Mental performance"},
            {"id": "muscle", "text": "Набор мышечной массы и силы", "text_uz": "Mushak massasi va kuchini oshirish", "text_en": "Muscle mass and strength gain"},
            {"id": "immunity", "text": "Крепкий иммунитет", "text_uz": "Kuchli immunitet", "text_en": "Strong immunity"},
            {"id": "sleep", "text": "Качественный сон и восстановление", "text_uz": "Sifatli uyqu va tiklanish", "text_en": "Quality sleep and recovery"},
            {"id": "weight", "text": "Метаболизм и контроль веса", "text_uz": "Metabolizm va vazn nazorati", "text_en": "Metabolism and weight control"},
            {"id": "stress", "text": "Управление стрессом", "text_uz": "Stressni boshqarish", "text_en": "Stress management"},
            {"id": "joints", "text": "Здоровье суставов и связок", "text_uz": "Bo'g'imlar va boylamlar salomatligi", "text_en": "Joint and ligament health"},
            {"id": "heart", "text": "Сердечно-сосудистая система", "text_uz": "Yurak-qon tomir tizimi", "text_en": "Cardiovascular system"},
            {"id": "potency", "text": "Мужская сила и потенция", "text_uz": "Erkaklik kuchi va potentsiya", "text_en": "Male strength and potency"}
        ]
    })

    # 2. Age (Step 2)
    questions.append({
        "id": "age",
        "section": "📋 ШАГ 2: О СЕБЕ", "section_uz": "📋 2-QADAM: O'ZINGIZ HAQINGIZDA", "section_en": "📋 STEP 2: ABOUT YOU",
        "label": "Сколько вам лет?", "label_uz": "Yoshingiz nechada?", "label_en": "How old are you?",
        "type": "options", "gender": "both", "order": 2,
        "options": [
            {"id": "18-25", "text": "18-25", "text_uz": "18-25", "text_en": "18-25"},
            {"id": "26-35", "text": "26-35", "text_uz": "26-35", "text_en": "26-35"},
            {"id": "36-45", "text": "36-45", "text_uz": "36-45", "text_en": "36-45"},
            {"id": "46-55", "text": "46-55", "text_uz": "46-55", "text_en": "46-55"},
            {"id": "56+", "text": "56 и старше", "text_uz": "56 va undan katta", "text_en": "56 and older"}
        ]
    })

    # 3. Height
    questions.append({
        "id": "height",
        "section": "📋 ШАГ 2: О СЕБЕ", "section_uz": "📋 2-QADAM: O'ZINGIZ HAQINGIZDA", "section_en": "📋 STEP 2: ABOUT YOU",
        "label": "Ваш рост (см):", "label_uz": "Bo'yingiz (sm):", "label_en": "Your height (cm):",
        "type": "input", "gender": "both", "order": 3, "placeholder": "170", "placeholder_uz": "170", "placeholder_en": "170"
    })

    # 4. Weight
    questions.append({
        "id": "weight",
        "section": "📋 ШАГ 2: О СЕБЕ", "section_uz": "📋 2-QADAM: O'ZINGIZ HAQINGIZDA", "section_en": "📋 STEP 2: ABOUT YOU",
        "label": "Ваш вес (кг):", "label_uz": "Vazningiz (kg):", "label_en": "Your weight (kg):",
        "type": "input", "gender": "both", "order": 4, "placeholder": "70", "placeholder_uz": "70", "placeholder_en": "70"
    })

    # 5. Allergies (Step 3)
    questions.append({
        "id": "allergies",
        "section": "🍴 ШАГ 3: ПИТАНИЕ", "section_uz": "🍴 3-QADAM: OVQATLANISH", "section_en": "🍴 STEP 3: NUTRITION",
        "label": "Какие продукты вызывают у вас аллергическую реакцию?", "label_uz": "Qaysi mahsulotlar sizda allergiya chaqiradi?", "label_en": "Which products cause an allergic reaction?",
        "type": "options", "gender": "both", "multiple": True, "order": 5,
        "options": [
            {"id": "none", "text": "Аллергий нет", "text_uz": "Allergiya yo'q", "text_en": "No allergies"},
            {"id": "milk", "text": "Молоко и его производные", "text_uz": "Sut va sut mahsulotlari", "text_en": "Milk and derivatives"},
            {"id": "gluten", "text": "Продукты с глютеном", "text_uz": "Glyutenli mahsulotlar", "text_en": "Gluten products"},
            {"id": "citrus", "text": "Цитрусовые и ягоды", "text_uz": "Sitrus va rezavorlar", "text_en": "Citrus and berries"},
            {"id": "veggies", "text": "Некоторые овощи", "text_uz": "Ba'zi sabzavotlar", "text_en": "Some vegetables"},
            {"id": "meat", "text": "Мясные изделия", "text_uz": "Go'sht mahsulotlari", "text_en": "Meat products"},
            {"id": "seafood", "text": "Дары моря", "text_uz": "Dengiz mahsulotlari", "text_en": "Seafood"},
            {"id": "cacao", "text": "Какао-продукты", "text_uz": "Kakao mahsulotlari", "text_en": "Cacao products"},
            {"id": "honey", "text": "Продукты пчеловодства", "text_uz": "Asalari mahsulotlari", "text_en": "Bee products"},
            {"id": "egg", "text": "Яичные продукты", "text_uz": "Tuxum mahsulotlari", "text_en": "Egg products"},
            {"id": "nuts", "text": "Орехи и семена", "text_uz": "Yong'oq va urug'lar", "text_en": "Nuts and seeds"},
            {"id": "soy", "text": "Соевые продукты", "text_uz": "Soya mahsulotlari", "text_en": "Soy products"},
            {"id": "mushrooms", "text": "Грибы", "text_uz": "Qo'ziqorinlar", "text_en": "Mushrooms"}
        ]
    })

    # 6. Diet System
    questions.append({
        "id": "diet_system",
        "section": "🍴 ШАГ 3: ПИТАНИЕ", "section_uz": "🍴 3-QADAM: OVQATLANISH", "section_en": "🍴 STEP 3: NUTRITION",
        "label": "Следуете ли вы определенной системе питания?", "label_uz": "Muayyan ovqatlanish tizimiga amal qilasizmi?", "label_en": "Do you follow a certain diet system?",
        "type": "options", "gender": "both", "order": 6,
        "options": [
            {"id": "regular", "text": "Придерживаюсь обычного рациона", "text_uz": "Oddiy ratsion", "text_en": "Regular diet"},
            {"id": "vegetarian", "text": "Растительное питание (допускаю молочное)", "text_uz": "O'simlikka asoslangan (sut mahsulotlari bilan)", "text_en": "Plant-based (with dairy)"},
            {"id": "vegan", "text": "Строгое растительное питание", "text_uz": "Qat'iy o'simlik ratsioni (vegan)", "text_en": "Strict plant-based (vegan)"},
            {"id": "halal", "text": "Следую религиозным предписаниям (халяль)", "text_uz": "Diniy amallar (halol)", "text_en": "Religious (Halal)"},
            {"id": "keto", "text": "Низкоуглеводный рацион", "text_uz": "Kichik uglevodli ratsion", "text_en": "Low-carb diet"},
            {"id": "fasting", "text": "Практикую пищевые окна", "text_uz": "Interval ochlik", "text_en": "Intermittent fasting"}
        ]
    })

    # Step 3: Frequencies
    def freq_q(id, label, label_uz, label_en, order):
        return {
            "id": id,
            "section": "🍴 РАЦИОН", "section_uz": "🍴 RATSIYON", "section_en": "🍴 DIET DETAILS",
            "label": label, "label_uz": label_uz, "label_en": label_en,
            "type": "options", "gender": "both", "order": order,
            "options": [
                {"id": "regular", "text": "Регулярно (3+ раза в неделю)", "text_uz": "Muntazam (haftasiga 3+ marta)", "text_en": "Regularly (3+ times a week)"},
                {"id": "seldom", "text": "Изредка (раз в неделю)", "text_uz": "Ba'zi-ba'zida (haftada bir)", "text_en": "Occasionally (once a week)"},
                {"id": "never", "text": "Исключаю из рациона", "text_uz": "Ratsiondan chiqarilgan", "text_en": "Exclude from diet"}
            ]
        }

    questions.append(freq_q("seafood_freq", "Дары моря (рыба, морепродукты):", "Dengiz mahsulotlari:", "Seafood:", 7))
    
    questions.append({
        "id": "meat_freq",
        "section": "🍴 РАЦИОН", "section_uz": "🍴 RATSIYON", "section_en": "🍴 DIET DETAILS",
        "label": "Мясная продукция:", "label_uz": "Go'sht mahsulotlari:", "label_en": "Meat products:",
        "type": "options", "gender": "both", "order": 8,
        "options": [
            {"id": "daily", "text": "Каждый день", "text_uz": "Har kuni", "text_en": "Every day"},
            {"id": "often", "text": "Несколько раз в неделю", "text_uz": "Haftada bir necha marta", "text_en": "Several times a week"},
            {"id": "never", "text": "Не употребляю", "text_uz": "Istemol qilmayman", "text_en": "Do not consume"}
        ]
    })

    # Simplified frequency template
    def simple_freq(id, label, label_uz, label_en, order):
        return {
            "id": id, "section": "🍴 РАЦИОН", "section_uz": "🍴 RATSIYON", "section_en": "🍴 DIET DETAILS",
            "label": label, "label_uz": label_uz, "label_en": label_en,
            "type": "options", "gender": "both", "order": order,
            "options": [
                {"id": "daily", "text": "Ежедневно", "text_uz": "Har kuni", "text_en": "Daily"},
                {"id": "period", "text": "Периодически", "text_uz": "Vaqti-vaqti bilan", "text_en": "Periodically"},
                {"id": "rare", "text": "Редко или никогда", "text_uz": "Kamdan-kam yoki hech qachon", "text_en": "Rarely or never"}
            ]
        }

    questions.append(simple_freq("veggies_freq", "Свежие овощи:", "Yangi sabzavotlar:", "Fresh vegetables:", 9))
    questions.append(simple_freq("fruits_freq", "Фрукты:", "Mevalar:", "Fruits:", 10))
    
    questions.append({
        "id": "dairy_freq",
        "section": "🍴 РАЦИОН", "section_uz": "🍴 RATSIYON", "section_en": "🍴 DIET DETAILS",
        "label": "Молочная продукция:", "label_uz": "Sut mahsulotlari:", "label_en": "Dairy products:",
        "type": "options", "gender": "both", "order": 11,
        "options": [
            {"id": "const", "text": "В рационе постоянно", "text_uz": "Doimratsionda", "text_en": "Constantly in diet"},
            {"id": "some", "text": "Употребляю иногда", "text_uz": "Ba'zida iste'mol qilaman", "text_en": "Consume sometimes"},
            {"id": "never", "text": "Избегаю", "text_uz": "Parchayman/Yemayman", "text_en": "Avoid"}
        ]
    })

    questions.append({
        "id": "nuts_freq",
        "section": "🍴 РАЦИОН", "section_uz": "🍴 RATSIYON", "section_en": "🍴 DIET DETAILS",
        "label": "Орехи и семена:", "label_uz": "Yong'oq va urug'lar:", "label_en": "Nuts and seeds:",
        "type": "options", "gender": "both", "order": 12,
        "options": [
            {"id": "reg", "text": "Регулярная часть рациона", "text_uz": "Ratsionning muntazam qismi", "text_en": "Regular part of diet"},
            {"id": "rare", "text": "Ем нечасто", "text_uz": "Kamdan-kam yeyman", "text_en": "Eat infrequently"},
            {"id": "never", "text": "Не включаю в меню", "text_uz": "Menyuga kiritmayman", "text_en": "Do not include in menu"}
        ]
    })

    questions.append({
        "id": "sweets_freq",
        "section": "🍴 РАЦИОН", "section_uz": "🍴 RATSIYON", "section_en": "🍴 DIET DETAILS",
        "label": "Сладкое:", "label_uz": "Shirinliklar:", "label_en": "Sweets:",
        "type": "options", "gender": "both", "order": 13,
        "options": [
            {"id": "daily", "text": "Каждодневная привычка", "text_uz": "Kundalik odat", "text_en": "Daily habit"},
            {"id": "some", "text": "Позволяю себе время от времени", "text_uz": "Vaqti-vaqti bilan ruxsat beraman", "text_en": "Allow sometimes"},
            {"id": "never", "text": "Стараюсь избегать", "text_uz": "Qochishga harakat qilaman", "text_en": "Try to avoid"}
        ]
    })

    # Step 4: Movement and Habits
    questions.append({
        "id": "activity_level",
        "section": "💪 ШАГ 4: ДВИЖЕНИЕ", "section_uz": "💪 4-QADAM: HARAKAT", "section_en": "💪 STEP 4: MOVEMENT",
        "label": "Опишите ваш уровень подвижности в течение дня:", "label_uz": "Kun davomida harakat darajangizni tavsiflang:", "label_en": "Describe your activity level during the day:",
        "type": "options", "gender": "both", "order": 14,
        "options": [
            {"id": "intense", "text": "Интенсивные тренировки, активная работа", "text_uz": "Intensiv mashg'ulotlar, faol ish", "text_en": "Intense training, active work"},
            {"id": "mod", "text": "Умеренная нагрузка, регулярные прогулки", "text_uz": "O'rtacha yuklama, muntazam sayrlar", "text_en": "Moderate load, regular walks"},
            {"id": "sed", "text": "Преимущественно сидячий образ жизни", "text_uz": "Asosan o'tirgan hayot tarzi", "text_en": "Mostly sedentary lifestyle"},
            {"id": "limit", "text": "Есть физические ограничения", "text_uz": "Jismoniy cheklovlar bor", "text_en": "There are physical limitations"}
        ]
    })

    questions.append({
        "id": "water_norm",
        "section": "💪 ШАГ 4: ДВИЖЕНИЕ", "section_uz": "💪 4-QADAM: HARAKAT", "section_en": "💪 STEP 4: MOVEMENT",
        "label": "Соблюдаете ли норму чистой воды (около 2л)?", "label_uz": "Toza suv normasiga rioya qilasizmi (taxminan 2L)?", "label_en": "Do you follow the daily water norm (about 2L)?",
        "type": "options", "gender": "both", "order": 15,
        "options": [
            {"id": "yes", "text": "Да, пью достаточно", "text_uz": "Ha, yetarli suv ichaman", "text_en": "Yes, I drink enough"},
            {"id": "no", "text": "Нет, не добираю норму", "text_uz": "Yo'q, normaga yetmaydi", "text_en": "No, I don't reach the norm"},
            {"id": "not_track", "text": "Не отслеживаю регулярно", "text_uz": "Muntazam kuzatib bormayman", "text_en": "Do not track regularly"}
        ]
    })

    questions.append({
        "id": "caffeine",
        "section": "☕ ПРИВЫЧКИ", "section_uz": "☕ ODATLAR", "section_en": "☕ HABITS",
        "label": "Ваши отношения с кофеином:", "label_uz": "Kofein bilan munosabatingiz:", "label_en": "Your relation with caffeine:",
        "type": "options", "gender": "both", "order": 16,
        "options": [
            {"id": "many", "text": "Несколько порций кофе ежедневно", "text_uz": "Har kuni bir necha marta kofe", "text_en": "Several cups of coffee daily"},
            {"id": "one", "text": "Одна чашка в день", "text_uz": "Kuniga bir finjon", "text_en": "One cup a day"},
            {"id": "rare", "text": "Пью нечасто", "text_uz": "Kamdan-kam ichaman", "text_en": "Drink infrequently"},
            {"id": "none", "text": "Обхожусь без кофе", "text_uz": "Kofesiz ham bo'ladi", "text_en": "Go without coffee"}
        ]
    })

    questions.append({
        "id": "smoking",
        "section": "🚬 ПРИВЫЧКИ", "section_uz": "🚬 ODATLAR", "section_en": "🚬 HABITS",
        "label": "Курите ли вы? (вкл. электронные устройства)", "label_uz": "Chekasizmi? (elektron moslamalar bilan)", "label_en": "Do you smoke? (incl. electronic devices)",
        "type": "options", "gender": "both", "order": 17,
        "options": [
            {"id": "yes", "text": "Да", "text_uz": "Ha", "text_en": "Yes"},
            {"id": "no", "text": "Нет", "text_uz": "Yo'q", "text_en": "No"},
            {"id": "rare", "text": "Крайне редко", "text_uz": "Juda kamdan-kam", "text_en": "Extremely rarely"}
        ]
    })

    questions.append({
        "id": "alcohol",
        "section": "🍷 ПРИВЫЧКИ", "section_uz": "🍷 ODATLAR", "section_en": "🍷 HABITS",
        "label": "Как часто употребляете спиртное?", "label_uz": "Spirtli ichimliklarni qanchalik tez-tez iste'mol qilasiz?", "label_en": "How often do you consume alcohol?",
        "type": "options", "gender": "both", "order": 18,
        "options": [
            {"id": "daily", "text": "Почти ежедневно", "text_uz": "Deyarli har kuni", "text_en": "Almost daily"},
            {"id": "weekly", "text": "Несколько раз за неделю", "text_uz": "Haftada bir necha marta", "text_en": "Several times a week"},
            {"id": "monthly", "text": "Несколько раз за месяц", "text_uz": "Oyiga bir necha marta", "text_en": "Several times a month"},
            {"id": "none", "text": "Не пью вообще", "text_uz": "Umuman ichmayman", "text_en": "Do not drink at all"}
        ]
    })

    # Screen / Digital
    questions.append({
        "id": "screen_time",
        "section": "📱 ЦИФРОВАЯ НАГРУЗКА", "section_uz": "📱 RAQAMLI YUKLAMA", "section_en": "📱 DIGITAL LOAD",
        "label": "Сколько часов в день вы перед экранами?", "label_uz": "Kunda necha soat ekran qarshisida bo'lasiz?", "label_en": "How many hours a day are you in front of screens?",
        "type": "options", "gender": "both", "order": 19,
        "options": [
            {"id": "most", "text": "Большую часть дня (работа)", "text_uz": "Kunning katta qismi (ish)", "text_en": "Most of the day (work)"},
            {"id": "sig", "text": "Значительно (4-6 часов)", "text_uz": "Sezilarli darajada (4-6 soat)", "text_en": "Significant (4-6 hours)"},
            {"id": "min", "text": "Минимально", "text_uz": "Minimal darajada", "text_en": "Minimal"}
        ]
    })

    questions.append({
        "id": "eye_fatigue",
        "section": "📱 ЦИФРОВАЯ НАГРУЗКА", "section_uz": "📱 RAQAMLI YUKLAMA", "section_en": "📱 DIGITAL LOAD",
        "label": "Замечаете ли утомление глаз?", "label_uz": "Ko'z toliqishini sezasizmi?", "label_en": "Do you notice eye fatigue?",
        "type": "options", "gender": "both", "order": 20,
        "options": [
            {"id": "always", "text": "Постоянно беспокоит", "text_uz": "Doimiy ravishda bezovta qiladi", "text_en": "Constantly bothers me"},
            {"id": "period", "text": "Бывает периодически", "text_uz": "Vaqti-vaqti bilan bo'ladi", "text_en": "Happens periodically"},
            {"id": "ok", "text": "Глаза в порядке", "text_uz": "Ko'zlar joyida", "text_en": "Eyes are fine"}
        ]
    })

    # Sport
    questions.append({
        "id": "sport",
        "section": "💪 СПОРТ", "section_uz": "💪 SPORT", "section_en": "💪 SPORT",
        "label": "Занимаетесь ли спортом?", "label_uz": "Sport bilan shug'ullanasizmi?", "label_en": "Do you go in for sports?",
        "type": "options", "gender": "both", "order": 21,
        "options": [
            {"id": "yes", "text": "Да, на регулярной основе", "text_uz": "Ha, muntazam ravishda", "text_en": "Yes, on a regular basis"},
            {"id": "no", "text": "Нет", "text_uz": "Yo'q", "text_en": "No"},
            {"id": "plan", "text": "Планирую начать", "text_uz": "Boshlashni rejalashtiryapman", "text_en": "Planning to start"}
        ]
    })

    questions.append({
        "id": "weight_goal",
        "section": "💪 СПОРТ", "section_uz": "💪 SPORT", "section_en": "💪 SPORT",
        "label": "Хотите ли скорректировать вес?", "label_uz": "Vazningizni to'g'irlashni xohlaysizmi?", "label_en": "Do you want to adjust your weight?",
        "type": "options", "gender": "both", "order": 22,
        "options": [
            {"id": "ok", "text": "Устраивает текущий", "text_uz": "Hozirgisi mos keladi", "text_en": "Satisfied with current"},
            {"id": "lose", "text": "Хочу уменьшить", "text_uz": "Kamaytirmoqchiman", "text_en": "Want to lose"},
            {"id": "gain", "text": "Планирую набрать мышечную массу", "text_uz": "Mushak massasini oshirmoqchiman", "text_en": "Plan to gain muscle mass"},
            {"id": "relief", "text": "Нужен рельеф без потери массы", "text_uz": "Vazn yo'qotmasdan relyef kerak", "text_en": "Need relief without mass loss"}
        ]
    })

    # Step 5: Energy
    questions.append({
        "id": "fatigue",
        "section": "😴 ШАГ 5: ЭНЕРГИЯ", "section_uz": "😴 5-QADAM: ENERGIYA", "section_en": "😴 STEP 5: ENERGY",
        "label": "Чувствуете ли хроническую усталость?", "label_uz": "Surunkali charchoqni his qilasizmi?", "label_en": "Do you feel chronic fatigue?",
        "type": "options", "gender": "both", "order": 23,
        "options": [
            {"id": "no", "text": "Нет, чувствую себя бодрым весь день", "text_uz": "Yo'q, kun bo'yi o'zimni tetik his qilaman", "text_en": "No, feel energetic all day"},
            {"id": "morning", "text": "Да, утром уже нет сил", "text_uz": "Ha, eartalabdanoq kuch yo'q", "text_en": "Yes, no strength in the morning"},
            {"id": "afternoon", "text": "Да, энергия падает после обеда", "text_uz": "Ha, tushlikdan keyin energiya pasayadi", "text_en": "Yes, energy drops after lunch"}
        ]
    })

    questions.append({
        "id": "sleep_quality",
        "section": "😴 ШАГ 5: ЭНЕРГИЯ", "section_uz": "😴 5-QADAM: ENERGIYA", "section_en": "😴 STEP 5: ENERGY",
        "label": "Как обстоят дела со сном?", "label_uz": "Uyquingiz qanday?", "label_en": "How is your sleep?",
        "type": "options", "gender": "both", "order": 24,
        "options": [
            {"id": "good", "text": "Сплю крепко и хорошо", "text_uz": "Yaxshi va xotirjam uxlayman", "text_en": "Sleep soundly and well"},
            {"id": "some_diff", "text": "Иногда бывают сложности", "text_uz": "Ba'zida qiyinchiliklar bo'ladi", "text_en": "Sometimes have difficulties"},
            {"id": "onset", "text": "Долго не могу уснуть", "text_uz": "Uzoq vaqt uxlay olmayman", "text_en": "Can't fall asleep for long"},
            {"id": "insomnia", "text": "Страдаю бессонницей", "text_uz": "Uyqusizlikdan azob chekaman", "text_en": "Suffer from insomnia"}
        ]
    })

    # Step 6: Emotional
    questions.append({
        "id": "stress_freq",
        "section": "🧘 ШАГ 6: ЭМОЦИИ", "section_uz": "🧘 6-QADAM: HISLAR", "section_en": "🧘 STEP 6: EMOTIONS",
        "label": "Как часто вы находитесь в состоянии напряжения?", "label_uz": "Qanchalik tez-tez kuchlanish holatida bo'lasiz?", "label_en": "How often are you in a state of tension?",
        "type": "options", "gender": "both", "order": 25,
        "options": [
            {"id": "const", "text": "Стресс присутствует постоянно", "text_uz": "Stress doimiy ravishda mavjud", "text_en": "Stress is constantly present"},
            {"id": "period", "text": "Периодически возникает", "text_uz": "Vaqti-vaqti bilan paydo bo'ladi", "text_en": "Occurs periodically"},
            {"id": "rare", "text": "Редкое явление", "text_uz": "Kamdan-kam uchraydi", "text_en": "Rare occurrence"},
            {"id": "none", "text": "Практически не испытываю", "text_uz": "Deyarli his qilmayman", "text_en": "Practically don't experience"}
        ]
    })

    # Step 7: Immunity
    questions.append({
        "id": "cold_freq",
        "section": "🛡️ ШАГ 7: ИММУНИТЕТ", "section_uz": "🛡️ 7-QADAM: IMMUNITET", "section_en": "🛡️ STEP 7: IMMUNITY",
        "label": "Сколько раз за год вы болеете простудными заболеваниями?", "label_uz": "Yilda necha marta shamollash bilan bog'liq kasalliklar bilan og'riysiz?", "label_en": "How many times a year do you get colds?",
        "type": "options", "gender": "both", "order": 26,
        "options": [
            {"id": "3plus", "text": "Более трёх раз", "text_uz": "3 martadan ko'proq", "text_en": "More than three times"},
            {"id": "2-3", "text": "Два-три раза", "text_uz": "Ikki-uch marta", "text_en": "Two-three times"},
            {"id": "0-1", "text": "Раз или вообще не болею", "text_uz": "Bir marta yoki umuman og'rimayman", "text_en": "Once or not at all"},
            {"id": "vrare", "text": "Очень редко простужаюсь", "text_uz": "Juda kamdan-kam shamollayman", "text_en": "Very rarely get cold"}
        ]
    })

    # Step 8: Beauty
    questions.append({
        "id": "beauty_issues",
        "section": "✨ ШАГ 8: ВНЕШНИЙ ВИД", "section_uz": "✨ 8-QADAM: TASHQI KO'RINISH", "section_en": "✨ STEP 8: APPEARANCE",
        "label": "Какие проблемы с кожей, волосами или ногтями вас беспокоят?", "label_uz": "Teri, soch yoki tirnoqlar bilan bog'liq qaysi muammolardan xavotirdasiz?", "label_en": "What skin, hair, or nail problems bother you?",
        "type": "options", "gender": "both", "multiple": True, "order": 27,
        "options": [
            {"id": "none", "text": "Проблем нет", "text_uz": "Muammolar yo'q", "text_en": "No problems"},
            {"id": "dry_skin", "text": "Сухость кожи", "text_uz": "Teri quruqligi", "text_en": "Dry skin"},
            {"id": "elasticity", "text": "Потеря упругости кожи", "text_uz": "Teri elastikligini yo'qotishi", "text_en": "Loss of skin elasticity"},
            {"id": "wrinkles", "text": "Морщины", "text_uz": "Ajinlar", "text_en": "Wrinkles"},
            {"id": "acne", "text": "Угревая сыпь / акне", "text_uz": "Husnbuzarlar / akne", "text_en": "Acne"},
            {"id": "hair_loss", "text": "Выпадение волос", "text_uz": "Soch to'kilishi", "text_en": "Hair loss"},
            {"id": "brittle_hair", "text": "Сухие / ломкие волосы", "text_uz": "Quruq / sinuvchan sochlar", "text_en": "Dry / brittle hair"},
            {"id": "dandruff", "text": "Перхоть", "text_uz": "Qazg'oq", "text_en": "Dandruff"},
            {"id": "brittle_nails", "text": "Ломкие ногти", "text_uz": "Sinuvchan tirnoqlar", "text_en": "Brittle nails"}
        ]
    })

    # Step 9: Women health
    questions.append({
        "id": "cycle_regularity",
        "section": "🌸 ШАГ 9: ЖЕНСКОЕ ЗДОРОВЬЕ", "section_uz": "🌸 9-QADAM: AYOLLAR SALOMATLIGI", "section_en": "🌸 STEP 9: WOMEN'S HEALTH",
        "label": "Насколько регулярен ваш цикл?", "label_uz": "Sizning siklingiz qanchalik muntazam?", "label_en": "How regular is your cycle?",
        "type": "options", "gender": "female", "order": 28,
        "options": [
            {"id": "stable", "text": "Стабильный и предсказуемый", "text_uz": "Barqaror va bashorat qilinadigan", "text_en": "Stable and predictable"},
            {"id": "irreg", "text": "Нерегулярный", "text_uz": "Nomuntazam", "text_en": "Irregular"},
            {"id": "menopause", "text": "Период менопаузы", "text_uz": "Menopauza davri", "text_en": "Menopause period"},
            {"id": "climacteric", "text": "Климактерический период", "text_uz": "Klimakterik davr", "text_en": "Climacteric period"},
            {"id": "pregnant", "text": "Беременность (цикла нет)", "text_uz": "Homiladorlik (sikl yo'q)", "text_en": "Pregnancy (no cycle)"}
        ]
    })

    questions.append({
        "id": "cycle_flow",
        "section": "🌸 ШАГ 9: ЖЕНСКОЕ ЗДОРОВЬЕ", "section_uz": "🌸 9-QADAM: AYOLLAR SALOMATLIGI", "section_en": "🌸 STEP 9: WOMEN'S HEALTH",
        "label": "Характер менструальных выделений:", "label_uz": "Hayz ko'rish xususiyati:", "label_en": "Menstrual flow character:",
        "type": "options", "gender": "female", "order": 29,
        "options": [
            {"id": "heavy", "text": "Обильные", "text_uz": "Ko'p", "text_en": "Heavy"},
            {"id": "mod", "text": "Умеренные", "text_uz": "O'rtacha", "text_en": "Moderate"},
            {"id": "scanty", "text": "Скудные", "text_uz": "Kam", "text_en": "Scanty"}
        ]
    })

    questions.append({
        "id": "contraception",
        "section": "🌸 ШАГ 9: КОНТРАЦЕПЦИЯ", "section_uz": "🌸 9-QADAM: KONTRATSEPTSIYA", "section_en": "🌸 STEP 9: CONTRACEPTION",
        "label": "Используете ли гормональную контрацепцию?", "label_uz": "Gormonal kontratseptsiyadan foydalanasizmi?", "label_en": "Do you use hormonal contraception?",
        "type": "options", "gender": "female", "order": 30,
        "options": [
            {"id": "const", "text": "Да, регулярно", "text_uz": "Ha, muntazam", "text_en": "Yes, regularly"},
            {"id": "no", "text": "Нет", "text_uz": "Yo'q", "text_en": "No"},
            {"id": "period", "text": "Периодически", "text_uz": "Vaqti-vaqti bilan", "text_en": "Periodically"}
        ]
    })

    questions.append({
        "id": "has_children",
        "section": "🌸 ШАГ 9: МАТЕРИНСТВО", "section_uz": "🌸 9-QADAM: ONALIK", "section_en": "🌸 STEP 9: MOTHERHOOD",
        "label": "Есть ли у вас дети?", "label_uz": "Farzandlaringiz bormi?", "label_en": "Do you have children?",
        "type": "options", "gender": "female", "order": 31,
        "options": [
            {"id": "yes", "text": "Да", "text_uz": "Ha", "text_en": "Yes"},
            {"id": "no", "text": "Нет", "text_uz": "Yo'q", "text_en": "No"}
        ]
    })

    # Step 10: Medical
    questions.append({
        "id": "blood_tests",
        "section": "🏥 ШАГ 10: ЗДОРОВЬЕ", "section_uz": "🏥 10-QADAM: SALOMATLIK", "section_en": "🏥 STEP 10: HEALTH",
        "label": "Есть ли у вас свежие анализы крови (за последние полгода)?", "label_uz": "Yaqinda qon tahlillari topshirdingizmi (oxirgi 6 oy)?", "label_en": "Do you have recent blood tests (last 6 months)?",
        "type": "options", "gender": "both", "order": 32,
        "options": [
            {"id": "yes", "text": "Да, готова предоставить данные", "text_uz": "Ha, ma'lumotlarni berishga tayyorman", "text_en": "Yes, ready to provide data"},
            {"id": "later", "text": "Есть, но предоставлю позже", "text_uz": "Bor, lekin keyinroq beraman", "text_en": "Yes, but provide later"},
            {"id": "no", "text": "Анализов нет", "text_uz": "Tahlillar yo'q", "text_en": "No tests"}
        ]
    })

    questions.append({
        "id": "chronic",
        "section": "🏥 ШАГ 10: ЗДОРОВЬЕ", "section_uz": "🏥 10-QADAM: SALOMATLIK", "section_en": "🏥 STEP 10: HEALTH",
        "label": "Имеются ли хронические диагнозы?", "label_uz": "Surunkali kasalliklaringiz bormi?", "label_en": "Do you have chronic diagnoses?",
        "type": "options", "gender": "both", "order": 33,
        "options": [
            {"id": "yes", "text": "Да", "text_uz": "Ha", "text_en": "Yes"},
            {"id": "no", "text": "Нет", "text_uz": "Yo'q", "text_en": "No"},
            {"id": "not_sure", "text": "Затрудняюсь ответить", "text_uz": "Javob berishga qiynalaman", "text_en": "Not sure"}
        ]
    })

    questions.append({
        "id": "digestive",
        "section": "🏥 ШАГ 10: ЖКТ", "section_uz": "🏥 10-QADAM: OSHQOZON-ICHAK", "section_en": "🏥 STEP 10: GI TRACT",
        "label": "Диагностированы ли заболевания ЖКТ?", "label_uz": "Oshqozon-ichak kasalliklari tashxisi qo'yilganmi?", "label_en": "Have GI tract diseases been diagnosed?",
        "type": "options", "gender": "both", "multiple": True, "order": 34,
        "options": [
            {"id": "none", "text": "Нет диагнозов", "text_uz": "Tashxislar yo'q", "text_en": "No diagnoses"},
            {"id": "ulcer", "text": "Язвенная болезнь", "text_uz": "Oshqozon yarasi", "text_en": "Ulcer"},
            {"id": "gastritis", "text": "Гастрит", "text_uz": "Gastrit", "text_en": "Gastritis"},
            {"id": "gallbladder", "text": "Проблемы с желчевыводящими путями", "text_uz": "O't yo'llari bilan bog'liq muammolar", "text_en": "Gallbladder problems"},
            {"id": "stones", "text": "Камни в желчном пузыре", "text_uz": "O't pufagidagi toshlar", "text_en": "Gallstones"},
            {"id": "pancreatitis", "text": "Панкреатит", "text_uz": "Pankreatit", "text_en": "Pancreatitis"},
            {"id": "cholecystitis", "text": "Холецистит", "text_uz": "Xolestistit", "text_en": "Cholecystitis"},
            {"id": "diarrhea", "text": "Частая диарея", "text_uz": "Tez-tez diareya", "text_en": "Frequent diarrhea"},
            {"id": "constipation", "text": "Склонность к запорам", "text_uz": "Qabziyatga moyillik", "text_en": "Constipation tendency"}
        ]
    })

    questions.append({
        "id": "meds",
        "section": "🏥 ШАГ 10: ЗДОРОВЬЕ", "section_uz": "🏥 10-QADAM: SALOMATLIK", "section_en": "🏥 STEP 10: HEALTH",
        "label": "Принимаете ли медикаменты постоянно?", "label_uz": "Doimiy ravishda dori-darmonlar qabul qilasizmi?", "label_en": "Do you take medications constantly?",
        "type": "options", "gender": "both", "order": 35,
        "options": [
            {"id": "yes", "text": "Да", "text_uz": "Ha", "text_en": "Yes"},
            {"id": "no", "text": "Нет", "text_uz": "Yo'q", "text_en": "No"}
        ]
    })

    questions.append({
        "id": "blood_pressure",
        "section": "🏥 ШАГ 10: ЗДОРОВЬЕ", "section_uz": "🏥 10-QADAM: SALOMATLIK", "section_en": "🏥 STEP 10: HEALTH",
        "label": "Каковы обычные показатели вашего давления?", "label_uz": "Qon bosimingizning odatiy ko'rsatkichlari qanday?", "label_en": "What are your typical blood pressure readings?",
        "type": "options", "gender": "both", "order": 36,
        "options": [
            {"id": "norm", "text": "В пределах нормы", "text_uz": "Norma darajasida", "text_en": "Within norm"},
            {"id": "high", "text": "Выше нормы", "text_uz": "Normadan yuqori", "text_en": "Above norm"},
            {"id": "low", "text": "Ниже нормы", "text_uz": "Normadan past", "text_en": "Below norm"},
            {"id": "none", "text": "Не измеряю", "text_uz": "O'lchamayman", "text_en": "Don't measure"}
        ]
    })

    # Step 11: Supplements
    questions.append({
        "id": "supplements_exp",
        "section": "💊 ШАГ 11: Опыт", "section_uz": "💊 11-QADAM: Tajriba", "section_en": "💊 STEP 11: Experience",
        "label": "Каков ваш опыт использования витаминов и БАДов?", "label_uz": "Vitamin va BFQlardan foydalanish tajribangiz qanday?", "label_en": "What is your experience with vitamins and supplements?",
        "type": "options", "gender": "both", "order": 37,
        "options": [
            {"id": "none", "text": "Никогда не принимала", "text_uz": "Hech qachon qabul qilmaganman", "text_en": "Never taken"},
            {"id": "trying", "text": "Пробовала, но без системы", "text_uz": "Sinab ko'rganman, lekin muntazam emas", "text_en": "Tried, but without system"},
            {"id": "seasonal", "text": "Пью курсами или по сезонам", "text_uz": "Kurs yoki mavsumiy qabul qilaman", "text_en": "Take in courses or seasonally"},
            {"id": "const", "text": "Принимаю постоянно длительное время", "text_uz": "Uzoq vaqtdan beri doimiy qabul qilaman", "text_en": "Take constantly for a long time"}
        ]
    })

    # Step 12: Source
    questions.append({
        "id": "source",
        "section": "📢 ШАГ 12: ИСТОЧНИКИ", "section_uz": "📢 12-QADAM: MANBALAR", "section_en": "📢 STEP 12: SOURCES",
        "label": "Откуда вы узнали о HESSA?", "label_uz": "HESSA haqida qayerdan bildingiz?", "label_en": "Where did you hear about HESSA?",
        "type": "options", "gender": "both", "order": 38,
        "options": [
            {"id": "friend", "text": "Порекомендовал близкий человек", "text_uz": "Yaqin insonim tavsiya qildi", "text_en": "Recommended by a close person"},
            {"id": "spec", "text": "Совет специалиста", "text_uz": "Mutaxassis maslahati", "text_en": "Specialist's advice"},
            {"id": "tv", "text": "Увидела по ТВ", "text_uz": "Televizorda ko'rdim", "text_en": "Saw on TV"},
            {"id": "internet", "text": "Нашла в интернете", "text_uz": "Internetdan topdim", "text_en": "Found on the Internet"},
            {"id": "unknown", "text": "Не помню источник", "text_uz": "Manba esimda yo'q", "text_en": "Don't remember the source"}
        ]
    })

    # Step 13: Phone
    questions.append({
        "id": "phone",
        "section": "📱 ШАГ 13: КОНТАКТ", "section_uz": "📱 13-QADAM: ALOQA", "section_en": "📱 STEP 13: CONTACT",
        "label": "Ваш номер телефона:", "label_uz": "Telefon raqamingiz:", "label_en": "Your phone number:",
        "type": "input", "gender": "both", "order": 39, "placeholder": "+998", "placeholder_uz": "+998", "placeholder_en": "+998"
    })

    data = {"questions": questions}
    print(json.dumps(data, indent=4, ensure_ascii=False))

if __name__ == "__main__":
    generate_quiz()
