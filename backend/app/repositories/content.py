import json
import os
from typing import List
from app.schemas.content import ContentData

DATA_FILE = "content_data.json"

DEFAULT_DATA = {
    "ticker": [
        {"text": "Бесплатная доставка по Узбекистану", "text_uz": "O'zbekiston bo'ylab bepul yetkazib berish", "text_en": "Free shipping across Uzbekistan"},
        {"text": "Оплата долями", "text_uz": "Bo'lib to'lash", "text_en": "Installment payment"},
        {"text": "100% гарантия качества", "text_uz": "100% sifat kafolati", "text_en": "100% quality guarantee"}
    ],
    "benefits": [
        {"title": "3+ года", "title_uz": "3+ yil", "title_en": "3+ years", "text": "Своё производство в Москве", "text_uz": "Moskvada o'z ishlab chiqarish", "text_en": "Own production in Moscow"},
        {"title": "1 млн+", "title_uz": "1 mln+", "title_en": "1 mln+", "text": "Клиентов доверяют Hessa", "text_uz": "Mijozlar Hessa ga ishonadi", "text_en": "Clients trust Hessa"},
        {"title": "Сертификация", "title_uz": "Sertifikatlash", "title_en": "Certification", "text": "Проверенное сырьё", "text_uz": "Tekshirilgan xomashyo", "text_en": "Verified raw materials"},
        {"title": "60+", "title_uz": "60+", "title_en": "60+", "text": "Витаминных комплексов", "text_uz": "Vitamin komplekslari", "text_en": "Vitamin complexes"}
    ],
    "difference": [
        {
            "id": 1,
            "title": "Сияющая кожа", "title_uz": "Yorqin teri", "title_en": "Radiant Skin",
            "desc": "Комплекс с биотином и коллагеном", "desc_uz": "Biotin va kollagenli kompleks", "desc_en": "Complex with biotin and collagen",
            "full_text": "Подробное описание того, как наши витамины улучшают состояние кожи. Биотин способствует укреплению волос и ногтей, а коллаген делает кожу упругой и эластичной.",
            "full_text_uz": "Biotin va kollagen terini qanday yaxshilashi haqida batafsil ma'lumot. Biotin soch va tirnoqlarni mustahkamlaydi, kollagen esa terini elastik qiladi.",
            "full_text_en": "Detailed description of how our vitamins improve skin condition. Biotin strengthens hair and nails, while collagen makes skin elastic and firm.",
            "image": "https://i.pinimg.com/1200x/61/3b/8e/613b8e0a364a7b11aea705cdc1c52cdf.jpg"
        },
        {
            "id": 2,
            "title": "Энергия и фокус", "title_uz": "Energiya va diqqat", "title_en": "Energy & Focus",
            "desc": "Заряд бодрости без кофеина", "desc_uz": "Kofeinsiz tetiklik quvvati", "desc_en": "Energy boost without caffeine",
            "full_text": "Этот комплекс помогает сохранять концентрацию в течение всего дня без резких спадов энергии.",
            "full_text_uz": "Ushbu kompleks kun davomida energiyani keskin yo'qotmasdan diqqatni jamlashga yordam beradi.",
            "full_text_en": "This complex helps maintain concentration throughout the day without energy crashes.",
            "image": "https://i.pinimg.com/736x/4c/d1/59/4cd1593a97579fb2163701e3d701fa95.jpg"
        },
        {
            "id": 3,
            "title": "Крепкий иммунитет", "title_uz": "Mustahkam immunitet", "title_en": "Strong Immunity",
            "desc": "Защита в сезон простуд", "desc_uz": "Shamollash mavsumida himoya", "desc_en": "Protection in cold season",
            "full_text": "Витамин C, D3 и Цинк — мощная тройная защита вашего организма.",
            "full_text_uz": "Vitamin C, D3 va Rux — organizmingiz uchun uch karra kuchli himoya.",
            "full_text_en": "Vitamin C, D3, and Zinc — powerful triple protection for your body.",
            "image": "https://i.pinimg.com/1200x/39/b3/88/39b388b8fcfa39f846d540a4b6f166f4.jpg"
        },
        {
            "id": 4,
            "title": "Здоровый сон", "title_uz": "Sog'lom uyqu", "title_en": "Healthy Sleep",
            "desc": "Восстановление нервной системы", "desc_uz": "Asab tizimini tiklash", "desc_en": "Nervous system recovery",
            "full_text": "Магний и B6 помогают расслабиться и улучшить качество сна.",
            "full_text_uz": "Magniy va B6 tinchlanishga va uyqu sifatini yaxshilashga yordam beradi.",
            "full_text_en": "Magnesium and B6 help relax and improve sleep quality.",
            "image": "https://i.pinimg.com/736x/b9/88/79/b98879cff9c13acf7236db5696489614.jpg"
        },
        {
            "id": 5,
            "title": "Баланс и гармония", "title_uz": "Muvozanat va uyg'unlik", "title_en": "Balance & Harmony",
            "desc": "Поддержка эмоционального фона", "desc_uz": "Hissiy fonni qo'llab-quvvatlash", "desc_en": "Emotional support",
            "full_text": "Комплекс для поддержания стабильного эмоционального фона и борьбы со стрессом.",
            "full_text_uz": "Hissiy barqarorlikni saqlash va stressga qarshi kurashish uchun kompleks.",
            "full_text_en": "Complex for maintaining stable emotional background and fighting stress.",
            "image": "https://i.pinimg.com/1200x/0e/9a/30/0e9a301f572ee577ab4adf8ca2370f3f.jpg"
        },
        {
            "id": 6,
            "title": "Активное долголетие", "title_uz": "Faol uzoq umr", "title_en": "Active Longevity",
            "desc": "Антиоксиданты для молодости", "desc_uz": "Yoshlik uchun antioksidantlar", "desc_en": "Antioxidants for youth",
            "full_text": "Антиоксиданты защищают клетки от старения и окислительного стресса.",
            "full_text_uz": "Antioksidantlar hujayralarni qarish va oksidlovchi stressdan himoya qiladi.",
            "full_text_en": "Antioxidants protect cells from aging and oxidative stress.",
            "image": "https://i.pinimg.com/736x/3b/69/6c/3b696c917be980793b0cf628b4c24f53.jpg",
            "product_ids": [4]
        }
    ],
    "products": [
        {
            "id": 1,
            "name": "Мультивитамины", "name_uz": "Multivitaminlar", "name_en": "Multivitamins",
            "category": "Иммунитет и энергия", "category_uz": "Immunitet va energiya", "category_en": "Immunity & Energy",
            "price": "145 000 сум", "image": "/vitamins-1.png", "isNew": True
        },
        {
            "id": 2,
            "name": "Железо + C", "name_uz": "Temir + C", "name_en": "Iron + C",
            "category": "Здоровье крови", "category_uz": "Qon salomatligi", "category_en": "Blood Health",
            "price": "95 000 сум", "image": "/vitamins-2.png", "isNew": False
        },
        {
            "id": 3,
            "name": "Магний B6", "name_uz": "Magniy B6", "name_en": "Magnesium B6",
            "category": "Нервная система", "category_uz": "Asab tizimi", "category_en": "Nervous System",
            "price": "115 000 сум", "image": "/vitamins-3.png", "isNew": True
        },
        {
            "id": 4,
            "name": "Омега-3", "name_uz": "Omega-3", "name_en": "Omega-3",
            "category": "Сердце и мозг", "category_uz": "Yurak va miya", "category_en": "Heart & Brain",
            "price": "245 000 сум", "image": "/vitamins-1.png", "isNew": False
        }
    ],
    "faq_title": "Частые вопросы",
    "faq_title_uz": "Ko'p beriladigan savollar",
    "faq_title_en": "Frequently Asked Questions",
    "faq_subtitle": "Всё, что вы хотели знать о нашей продукции и сервисе",
    "faq_subtitle_uz": "Mahsulotlarimiz va xizmatimiz haqida bilishni xohlagan hamma narsangiz",
    "faq_subtitle_en": "Everything you wanted to know about our products and service",
    "faq": [
        {
            "question": "Как правильно принимать витамины Hessa?",
            "question_uz": "Hessa vitaminlarini qanday qabul qilish kerak?",
            "question_en": "How to take Hessa vitamins correctly?",
            "answer": "Мы рекомендуем принимать одну капсулу в день во время или сразу после завтрака, запивая стаканом воды. Это обеспечит оптимальное усваивание активных компонентов в течение дня.",
            "answer_uz": "Biz kuniga bir marta nonushta vaqtida yoki undan keyin bir stakan suv bilan qabul qilishni tavsiya qilamiz. Bu kun davomida faol komponentlarning optimal so'rilishini ta'minlaydi.",
            "answer_en": "We recommend taking one capsule per day during or immediately after breakfast with a glass of water. This ensures optimal absorption of active components throughout the day."
        },
        {
            "question": "Через какое время я почувствую эффект?",
            "question_uz": "Effektni qancha vaqtdan keyin his qilaman?",
            "question_en": "How long until I feel the effect?",
            "answer": "Витамины имеют накопительный эффект. Большинство наших клиентов замечают первые изменения в уровне энергии и качестве сна через 14-20 дней регулярного приема. Полный курс обычно рассчитан на 30-60 дней.",
            "answer_uz": "Vitaminlar to'planuvchi ta'sirga ega. Mijozlarimizning aksariyati muntazam qabul qilganidan keyin 14-20 kun ichida energiya darajasi va uyqu sifatidagi birinchi o'zgarishlarni sezadilar. To'liq kurs odatda 30-60 kunga mo'ljallangan.",
            "answer_en": "Vitamins have a cumulative effect. Most of our clients notice the first changes in energy levels and sleep quality after 14-20 days of regular intake. A full course is usually designed for 30-60 days."
        },
        {
            "question": "Вся ли продукция сертифицирована?",
            "question_uz": "Barcha mahsulotlar sertifikatlanganmi?",
            "question_en": "Are all products certified?",
            "answer": "Да, абсолютно вся продукция Hessa проходит строгий лабораторный контроль и имеет государственные сертификаты соответствия. Мы используем только проверенное сырье из Европы и США на собственном производстве в Москве.",
            "answer_uz": "Ha, Hessa-ning mutlaqo barcha mahsulotlari qattiq laboratoriya nazoratidan o'tadi va davlat muvofiqlik sertifikatlariga ega. Biz Moskvadagi o'z ishlab chiqarishimizda faqat Evropa va AQShdan tekshirilgan xom ashyolardan foydalanamiz.",
            "answer_en": "Yes, absolutely all Hessa products undergo strict laboratory control and have state certificates of conformity. We use only verified raw materials from Europe and the USA at our own production in Moscow."
        },
        {
            "question": "Есть ли противопоказания?",
            "question_uz": "Qo'llash mumkin bo'lmagan holatlar bormi?",
            "question_en": "Are there any contraindications?",
            "answer": "Наши комплексы безопасны для большинства людей, однако мы всегда рекомендуем проконсультироваться с врачом перед началом приема, особенно во время беременности, кормления грудью или при наличии хронических заболеваний.",
            "answer_uz": "Bizning komplekslarimiz ko'pchilik uchun xavfsizdir, ammo biz har doim qabul qilishni boshlashdan oldin shifokor bilan maslahatlashishni tavsiya qilamiz, ayniqsa homiladorlik, emizish davrida yoki surunkali kasalliklar mavjud bo'lganda.",
            "answer_en": "Our complexes are safe for most people, but we always recommend consulting a doctor before starting intake, especially during pregnancy, breastfeeding, or in the presence of chronic diseases."
        },
        {
            "question": "Как осуществляется доставка по Узбекистану?",
            "question_uz": "O'zbekiston bo'ylab yetkazib berish qanday amalga oshiriladi?",
            "question_en": "How is delivery carried out in Uzbekistan?",
            "answer": "Мы доставляем заказы по всему Узбекистану через курьерские службы. По Ташкенту доставка занимает от 2 до 6 часов, в другие регионы — от 1 до 3 рабочих дней.",
            "answer_uz": "Biz buyurtmalarni butun O'zbekiston bo'ylab kurerlik xizmatlari orqali yetkazib beramiz. Toshkent bo'ylab yetkazib berish 2 soatdan 6 soatgacha, boshqa viloyatlarga — 1 kundan 3 ish kunigacha davom etadi.",
            "answer_en": "We deliver orders throughout Uzbekistan through courier services. In Tashkent, delivery takes from 2 to 6 hours, to other regions — from 1 to 3 business days."
        }
    ]
}

# Update existing difference IDs for demo links
DEFAULT_DATA["difference"][0]["product_ids"] = [1, 2] # Сияющая кожа
DEFAULT_DATA["difference"][1]["product_ids"] = [1, 3] # Энергия и фокус
DEFAULT_DATA["difference"][2]["product_ids"] = [1]    # Крепкий иммунитет
DEFAULT_DATA["difference"][3]["product_ids"] = [3]    # Здоровый сон
DEFAULT_DATA["difference"][4]["product_ids"] = [3, 4] # Баланс и гармония

DEFAULT_DATA["footer"] = {
    "slogan": "Здоровье — это искусство гармонии с собой и природой каждый день.",
    "slogan_uz": "Salomatlik — har kuni o'zingiz va tabiat bilan uyg'unlik san'atidir.",
    "slogan_en": "Health is the art of harmony with yourself and nature every day.",
    "phone": "+998 (90) 123-4567",
    "email": "hello@hessa.uz",
    "instagram": "https://instagram.com/hessa",
    "telegram": "https://t.me/hessa",
    "location": "Ташкент, Узбекистан",
    "location_uz": "Toshkent, O'zbekiston",
    "location_en": "Tashkent, Uzbekistan",
    "copyright_text": "© 2024 HESSA Inc.",
    "col_1_title": "Коллекции",
    "col_1_title_uz": "To'plamlar",
    "col_1_title_en": "Collections",
    "col_1_links": [
        {"label": "Энергия", "label_uz": "Energiya", "label_en": "Energy", "url": "/catalog"},
        {"label": "Иммунитет", "label_uz": "Immunitet", "label_en": "Immunity", "url": "/catalog"},
        {"label": "Спокойствие", "label_uz": "Xotirjamlik", "label_en": "Calmness", "url": "/catalog"},
        {"label": "Красота", "label_uz": "Go'zallik", "label_en": "Beauty", "url": "/catalog"}
    ],
    "col_2_title": "Сервис",
    "col_2_title_uz": "Xizmat",
    "col_2_title_en": "Service",
    "col_2_links": [
        {"label": "Доставка", "label_uz": "Yetkazib berish", "label_en": "Delivery", "url": "/delivery"},
        {"label": "Возврат", "label_uz": "Qaytarish", "label_en": "Return", "url": "/return"},
        {"label": "FAQ", "label_uz": "FAQ", "label_en": "FAQ", "url": "/faq"},
        {"label": "Отследить", "label_uz": "Kuzatish", "label_en": "Track", "url": "/track"}
    ],
    "col_3_title": "Бренд",
    "col_3_title_uz": "Brend",
    "col_3_title_en": "Brand",
    "col_3_links": [
        {"label": "О нас", "label_uz": "Biz haqimizda", "label_en": "About us", "url": "/about"},
        {"label": "Контакты", "label_uz": "Kontaktlar", "label_en": "Contacts", "url": "/contacts"},
        {"label": "Блог", "label_uz": "Blog", "label_en": "Blog", "url": "/blog"},
        {"label": "Партнерам", "label_uz": "Hamkorlarga", "label_en": "Partners", "url": "/partnership"}
    ],
    "legal_links": [
        {"label": "Политика конфиденциальности", "label_uz": "Maxfiylik siyosati", "label_en": "Privacy Policy", "url": "/privacy"},
        {"label": "Условия использования", "label_uz": "Foydalanish shartlari", "label_en": "Terms of use", "url": "/terms"}
    ]
}

DEFAULT_DATA["companies"] = {
    # Hero
    "hero_badge": "Корпоративная забота",
    "hero_badge_uz": "Korporativ g'amxo'rlik",
    "hero_badge_en": "Corporate Care",
    "hero_title": "Инвестируйте в здоровье своей команды",
    "hero_title_uz": "Jamoangiz salomatligiga sarmoya kiriting",
    "hero_title_en": "Invest in your team's health",
    "hero_desc": "Персонализированные наборы витаминов Hessa для ваших сотрудников и партнеров.",
    "hero_desc_uz": "Xodimlaringiz va hamkorlaringiz uchun Hessa vitaminlarining shaxsiy to'plamlari.",
    "hero_desc_en": "Personalized Hessa vitamin sets for your employees and partners.",
    "hero_image": "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=50&w=1200&auto=format&fit=crop",
    "button_text": "Оставить заявку",
    "button_text_uz": "Ariza qoldirish",
    "button_text_en": "Leave a request",

    # Benefits
    "benefits_title": "Наборы витаминов Hessa это:",
    "benefits_title_uz": "Hessa vitamin to'plamlari bu:",
    "benefits_title_en": "Hessa vitamin sets are:",
    
    "benefit_1_title": "Универсально",
    "benefit_1_title_uz": "Universal",
    "benefit_1_title_en": "Universal",
    "benefit_1_text": "В набор попадают витамины, которые нужны всем — вне зависимости от возраста, пола и особенностей организма.",
    "benefit_1_text_uz": "To'plamga yoshi, jinsi va tana xususiyatlaridan qat'i nazar, barchaga kerak bo'lgan vitaminlar kiradi.",
    "benefit_1_text_en": "The set includes vitamins that everyone needs — regardless of age, gender, and body characteristics.",

    "benefit_2_title": "Безопасно",
    "benefit_2_title_uz": "Xavfsiz",
    "benefit_2_title_en": "Safe",
    "benefit_2_text": "Рассчитываем универсальные, профилактические дозировки и подбираем компоненты по правилам сочетаемости.",
    "benefit_2_text_uz": "Biz universal, profilaktik dozalarni hisoblaymiz va komponentlarni moslik qoidalariga muvofiq tanlaymiz.",
    "benefit_2_text_en": "We calculate universal, prophylactic dosages and select components according to compatibility rules.",

    "benefit_3_title": "Эффективно",
    "benefit_3_title_uz": "Samarali",
    "benefit_3_title_en": "Effective",
    "benefit_3_text": "Систему Hessa разработали практикующие нутрициологи на базе клинических исследований и доказательной медицины.",
    "benefit_3_text_uz": "Hessa tizimi amaliyotchi nutratsiologlar tomonidan klinik tadqiqotlar va dalillarga asoslangan tibbiyot asosida ishlab chiqilgan.",
    "benefit_3_text_en": "The Hessa system was developed by practicing nutritionists based on clinical research and evidence-based medicine.",

    # Case Study
    "case_badge": "Кейс: Онлайн-кинотеатр PREMIER",
    "case_badge_uz": "Keys: PREMIER onlayn kinoteatri",
    "case_badge_en": "Case: PREMIER online cinema",
    "case_title": "Новогодние подарки «Антистресс»",
    "case_title_uz": "«Antistress» yangi yil sovg'alari",
    "case_title_en": "«Antistress» New Year gifts",
    "case_image": "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=40&w=800&auto=format&fit=crop",
    
    "case_step_1_text": "Концепция состава. Выбрали цель «Антистресс». В состав вошли 4 компонента: Витамин D, Магний, Триптофан, Железо.",
    "case_step_1_text_uz": "Tarkib konsepsiyasi. «Antistress» maqsadi tanlandi. Tarkibga 4 ta komponent kirdi: Vitamin D, Magniy, Triptofan, Temir.",
    "case_step_1_text_en": "Composition concept. Chosen goal «Antistress». The composition included 4 components: Vitamin D, Magnesium, Tryptophan, Iron.",
    
    "case_step_2_text": "Дизайн и стиль. Разработали креативную концепцию и фирменный стиль коллаборации в эстетике бренда.",
    "case_step_2_text_uz": "Dizayn va uslub. Brend estetikasida hamkorlikning kreativ konsepsiyasi va korporativ uslubini ishlab chiqdik.",
    "case_step_2_text_en": "Design and style. Developed a creative concept and corporate style of collaboration in the brand aesthetics.",

    "case_step_3_text": "Производство и логистика. Собрали и доставили готовые наборы точно к новогодним праздникам по всем адресам.",
    "case_step_3_text_uz": "Ishlab chiqarish va logistika. Tayyor to'plamlarni yig'dik va barcha manzillarga Yangi yil bayramlariga to'g'ri yetkazib berdik.",
    "case_step_3_text_en": "Production and logistics. Assembled and delivered ready-made sets exactly for the New Year holidays to all addresses.",

    # Product Showcase
    "products_badge": "Разнообразие выбора",
    "products_badge_uz": "Tanlov xilma-xilligi",
    "products_badge_en": "Variety of choice",
    "products_title": "Подберём подходящий набор для конкретной задачи",
    "products_title_uz": "Aniq vazifa uchun mos to'plamni tanlaymiz",
    "products_title_en": "We will select a suitable set for a specific task",

    "product_1_name": "Антистресс-набор",
    "product_1_name_uz": "Antistress-to'plam",
    "product_1_name_en": "Antistress-set",
    "product_1_goal": "Спокойствие и баланс",
    "product_1_goal_uz": "Tinchlik va muvozanat",
    "product_1_goal_en": "Calmness and balance",
    "product_1_image": "/images/antistress.png",

    "product_2_name": "Иммунитет",
    "product_2_name_uz": "Immunitet",
    "product_2_name_en": "Immunity",
    "product_2_goal": "Защита организма",
    "product_2_goal_uz": "Organizmni himoya qilish",
    "product_2_goal_en": "Body protection",
    "product_2_image": "/images/immunity.png",

    "product_3_name": "Красота и энергия",
    "product_3_name_uz": "Go'zallik va energiya",
    "product_3_name_en": "Beauty and energy",
    "product_3_goal": "Сияние и тонус",
    "product_3_goal_uz": "Yorqinlik va tonus",
    "product_3_goal_en": "Radiance and tone",
    "product_3_image": "/images/beauty.png",

    "product_4_name": "Продуктивность",
    "product_4_name_uz": "Samaradorlik",
    "product_4_name_en": "Productivity",
    "product_4_goal": "Фокус и результат",
    "product_4_goal_uz": "Fokus va natija",
    "product_4_goal_en": "Focus and result",
    "product_4_image": "/images/productivity.png",

    # Audience
    "audience_badge": "Для кого",
    "audience_badge_uz": "Kim uchun",
    "audience_badge_en": "For whom",
    "audience_title": "Кому подходит",
    "audience_title_uz": "Kimga mos keladi",
    "audience_title_en": "Who is it suitable for",

    "audience_1_name": "Коллегам",
    "audience_1_name_uz": "Hamkasblarga",
    "audience_1_name_en": "Colleagues",
    "audience_1_goal": "на Новый год",
    "audience_1_goal_uz": "Yangi yilga",
    "audience_1_goal_en": "for New Year",
    "audience_1_image": "/images/audience_colleagues.png",

    "audience_2_name": "К ДМС",
    "audience_2_name_uz": "DMS ga",
    "audience_2_name_en": "To VHI",
    "audience_2_goal": "как дополнение",
    "audience_2_goal_uz": "qo'shimcha sifatida",
    "audience_2_goal_en": "as an addition",
    "audience_2_image": "/images/audience_dms.png",

    "audience_3_name": "Партнерам",
    "audience_3_name_uz": "Hamkorlarga",
    "audience_3_name_en": "Partners",
    "audience_3_goal": "корпоративным",
    "audience_3_goal_uz": "korporativ",
    "audience_3_goal_en": "corporate",
    "audience_3_image": "/images/audience_partners.png",

    "audience_4_name": "На ивенты",
    "audience_4_name_uz": "Tadbirlarga",
    "audience_4_name_en": "For events",
    "audience_4_goal": "как Welcome-pack",
    "audience_4_goal_uz": "Welcome-pack sifatida",
    "audience_4_goal_en": "as a Welcome-pack",
    "audience_4_image": "/images/audience_welcome.png",

    # Process
    "process_badge": "Как мы работаем",
    "process_badge_uz": "Biz qanday ishlaymiz",
    "process_badge_en": "How we work",
    "process_title": "Берём процесс на себя",
    "process_title_uz": "Jarayonni o'z zimmamizga olamiz",
    "process_title_en": "We take the process upon ourselves",
    "process_desc": "Тестовые наборы для вашей команды отправим заранее — за наш счёт",
    "process_desc_uz": "Jamoangiz uchun sinov to'plamlarini oldindan yuboramiz — bizning hisobimizdan",
    "process_desc_en": "Test sets for your team will be sent in advance — at our expense",

    "process_1_title": "Дизайн",
    "process_1_title_uz": "Dizayn",
    "process_1_title_en": "Design",
    "process_1_text": "Оформим наборы с учётом вашего фирменного стиля, вложим инфосет и открытку.",
    "process_1_text_uz": "To'plamlarni sizning korporativ uslubingizni hisobga olgan holda rasmiylashtiramiz.",
    "process_1_text_en": "We will arrange sets taking into account your corporate style.",
    "process_1_image": "/images/process_design.png",

    "process_2_title": "Состав",
    "process_2_title_uz": "Tarkib",
    "process_2_title_en": "Composition",
    "process_2_text": "Вы сможете выбрать конкретную задачу для набора. Состав подготовят наши врачи.",
    "process_2_text_uz": "Siz to'plam uchun aniq vazifani tanlashingiz mumkin. Tarkibni shifokorlarimiz tayyorlaydi.",
    "process_2_text_en": "You can choose a specific task for the set. Our doctors will prepare the composition.",
    "process_2_image": "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=40&w=800&auto=format&fit=crop",

    "process_3_title": "Доставка",
    "process_3_title_uz": "Yetkazib berish",
    "process_3_title_en": "Delivery",
    "process_3_text": "Фасуем и упаковываем с доставкой до офиса или дверей сотрудников.",
    "process_3_text_uz": "Qadoqlaymiz va ofisga yoki xodimlarning eshigigacha yetkazib beramiz.",
    "process_3_text_en": "We pack and deliver to the office or employees' doors.",
    "process_3_image": "https://images.unsplash.com/photo-1549463512-23f29241b212?q=40&w=800&auto=format&fit=crop",

    # Stats
    "stat_1_val": "100+",
    "stat_1_label": "мин. тираж",
    "stat_1_label_uz": "min. tiraj",
    "stat_1_label_en": "min. run",

    "stat_2_val": "14",
    "stat_2_label": "дней (экспресс)",
    "stat_2_label_uz": "kun (ekspress)",
    "stat_2_label_en": "days (express)",

    "stat_3_val": "2 г.",
    "stat_3_label": "срок хранения",
    "stat_3_label_uz": "saqlash muddati",
    "stat_3_label_en": "shelf life",

    "stat_4_val": "Юр.",
    "stat_4_label": "лицо / договор",
    "stat_4_label_uz": "shaxs / shartnoma",
    "stat_4_label_en": "entity / contract",

    # Contact
    "contact_title": "Обсудим ваш проект?",
    "contact_title_uz": "Loyihangizni muhokama qilamizmi?",
    "contact_title_en": "Discuss your project?",
    "contact_desc": "Оставьте заявку, и наш менеджер свяжется с вами, чтобы обсудить детали и рассчитать стоимость.",
    "contact_desc_uz": "Ariza qoldiring va menejerimiz tafsilotlarni muhokama qilish va narxni hisoblash uchun siz bilan bog'lanadi.",
    "contact_desc_en": "Leave a request, and our manager will contact you to discuss details and calculate the cost."
}

DEFAULT_DATA["return_page"] = {
    "title": "Условия возврата",
    "title_uz": "Qaytarish shartlari",
    "title_en": "Return Policy",
    "subtitle": "Мы заботимся о вашем здоровье и готовы решить любые вопросы",
    "subtitle_uz": "Sizning salomatligingiz haqida qayg'uramiz va har qanday savollarni hal qilishga tayyormiz",
    "subtitle_en": "We care about your health and are ready to resolve any issues",
    "sections": [
        {
            "title": "Как вернуть товар?",
            "title_uz": "Mahsulotni qanday qaytarish kerak?",
            "title_en": "How to return a product?",
            "content": "Согласно законодательству Республики Узбекистан, биологически активные добавки к пище надлежащего качества возврату и обмену не подлежат. Однако, если вы получили товар ненадлежащего качества или с истекшим сроком годности, мы обязательно произведем замену или вернем деньги.",
            "content_uz": "O'zbekiston Respublikasi qonunchiligiga ko'ra, tegishli sifatdagi biologik faol qo'shimchalar qaytarilmaydi va almashtirilmaydi. Biroq, agar siz sifatsiz yoki muddati o'tgan mahsulot olgan bo'lsangiz, biz albatta almashtirib beramiz yoki pulingizni qaytaramiz.",
            "content_en": "According to the legislation of the Republic of Uzbekistan, dietary supplements of proper quality are not subject to return and exchange. However, if you received a product of improper quality or with an expired shelf life, we will definitely make a replacement or refund.",
            "image": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop"
        }
    ]
}

DEFAULT_DATA["services_page"] = {
    "title": "Наши услуги",
    "title_uz": "Bizning xizmatlarimiz",
    "title_en": "Our Services",
    "subtitle": "Профессиональный подход к вашему здоровью",
    "subtitle_uz": "Sizning salomatligingizga professional yondashuv",
    "subtitle_en": "A professional approach to your health",
    "sections": []
}

DEFAULT_DATA["contacts_page"] = {
    "title": "Контакты",
    "title_uz": "Kontaktlar",
    "title_en": "Contacts",
    "subtitle": "Свяжитесь с нами любым удобным способом",
    "subtitle_uz": "Biz bilan o'zingizga qulay usulda bog'laning",
    "subtitle_en": "Contact us in any convenient way",
    "sections": []
}

DEFAULT_DATA["faq_page"] = {
    "title": "Часто задаваемые вопросы",
    "title_uz": "Ko'p so'raladigan savollar",
    "title_en": "Frequently Asked Questions",
    "subtitle": "Здесь вы найдете ответы на самые популярные вопросы о нашей продукции и сервисе",
    "subtitle_uz": "Bu yerda bizning mahsulotlarimiz va xizmatlarimiz haqidagi eng ommabop savollarga javob topasiz",
    "subtitle_en": "Here you will find answers to the most popular questions about our products and services",
    "sections": [
        {
            "title": "Как оформить заказ?",
            "title_uz": "Buyurtmani qanday rasmiylashtirish kerak?",
            "title_en": "How to place an order?",
            "content": "Вы можете оформить заказ через наш каталог на сайте или связавшись с нами по телефону.",
            "content_uz": "Siz buyurtmani saytdagi katalog orqali yoki biz bilan telefon orqali bog'lanib rasmiylashtirishingiz mumkin.",
            "content_en": "You can place an order through our catalog on the website or by contacting us by phone.",
            "image": None
        }
    ]
}

DEFAULT_DATA["contacts_info"] = {
    "latitude": 41.2995,
    "longitude": 69.2401,
    "address": "Ташкент, Узбекистан",
    "address_uz": "Toshkent, O'zbekiston",
    "address_en": "Tashkent, Uzbekistan",
    "phone": "+998 90 123 45 67",
    "email": "info@hessa.uz"
}

class ContentRepository:
    def __init__(self):
        self.file_path = DATA_FILE
        self._ensure_file_exists()

    def _ensure_file_exists(self):
        if not os.path.exists(self.file_path):
            with open(self.file_path, "w") as f:
                json.dump(DEFAULT_DATA, f, indent=4)

    def get_content(self) -> ContentData:
        if not os.path.exists(self.file_path):
            self._ensure_file_exists()

        with open(self.file_path, "r") as f:
            data = json.load(f)
        
        # Ensure 'companies' key exists for backward compatibility
        if "companies" not in data:
            data["companies"] = DEFAULT_DATA["companies"]
            
        # Migrate FAQ fields
        if "faq" not in data:
            data["faq"] = DEFAULT_DATA["faq"]
        if "faq_title" not in data:
            data["faq_title"] = DEFAULT_DATA["faq_title"]
        if "faq_title_uz" not in data:
            data["faq_title_uz"] = DEFAULT_DATA["faq_title_uz"]
        if "faq_title_en" not in data:
            data["faq_title_en"] = DEFAULT_DATA["faq_title_en"]
        if "faq_subtitle" not in data:
            data["faq_subtitle"] = DEFAULT_DATA["faq_subtitle"]
        if "faq_subtitle_uz" not in data:
            data["faq_subtitle_uz"] = DEFAULT_DATA["faq_subtitle_uz"]
        if "faq_subtitle_en" not in data:
            data["faq_subtitle_en"] = DEFAULT_DATA["faq_subtitle_en"]
            
        # Optional: Save back to file if any migration happened
        # with open(self.file_path, "w") as f:
        #     json.dump(data, f, indent=4)
        
        # Migrate Footer fields
        updated = False
        if "footer" in data:
            footer = data["footer"]
            for key, value in DEFAULT_DATA["footer"].items():
                if key not in footer:
                    footer[key] = value
                    updated = True
        else:
            data["footer"] = DEFAULT_DATA["footer"]
            updated = True

        # Migrate Return Page fields
        if "return_page" not in data:
            data["return_page"] = DEFAULT_DATA["return_page"]
            updated = True

        if "services_page" not in data:
            data["services_page"] = DEFAULT_DATA["services_page"]
            updated = True

        if "contacts_page" not in data:
            data["contacts_page"] = DEFAULT_DATA["contacts_page"]
            updated = True

        if "faq_page" not in data:
            data["faq_page"] = DEFAULT_DATA["faq_page"]
            updated = True

        if "contacts_info" not in data:
            data["contacts_info"] = DEFAULT_DATA["contacts_info"]
            updated = True
        
        if updated:
            with open(self.file_path, "w") as f:
                json.dump(data, f, indent=4)
            
        return ContentData(**data)

    def update_content(self, data: ContentData) -> ContentData:
        # Load existing data first
        current_data = {}
        if os.path.exists(self.file_path):
            with open(self.file_path, "r") as f:
                current_data = json.load(f)
        
        # Merge new data (only provided fields)
        new_data = data.model_dump(exclude_unset=True)
        current_data.update(new_data)
        
        with open(self.file_path, "w") as f:
            json.dump(current_data, f, indent=4)
            
        return ContentData(**current_data)

content_repo = ContentRepository()
