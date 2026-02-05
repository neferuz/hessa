import { QuestionStep, Product, Duration } from "./types";

export const questions: QuestionStep[] = [
    // --- Block 1 ---
    {
        id: "name",
        section: "Блок 1: Общий профиль",
        label: "Как нам к вам обращаться?",
        type: "input",
        placeholder: "Ваше имя"
    },
    {
        id: "gender",
        section: "Блок 1: Общий профиль",
        label: "Ваш пол:",
        type: "options",
        options: [
            { id: "male", text: "Мужчина" },
            { id: "female", text: "Женщина" }
        ]
    },
    {
        id: "age",
        section: "Блок 1: Общий профиль",
        label: "Укажите ваш возраст:",
        type: "options",
        options: [
            { id: "u25", text: "До 25 лет" },
            { id: "25-45", text: "25–45 лет" },
            { id: "45+", text: "45 лет и старше" }
        ]
    },
    {
        id: "activity",
        section: "Блок 1: Общий профиль",
        label: "Каков ваш типичный уровень физической активности?",
        type: "options",
        options: [
            { id: "low", text: "Низкий (сидячая работа, мало движения)" },
            { id: "mid", text: "Средний (прогулки, 1-2 тренировки в неделю)" },
            { id: "high", text: "Высокий (регулярный спорт, физический труд)" }
        ]
    },
    // --- Block 2 ---
    {
        id: "energy_level",
        section: "Блок 2: Энергия и продуктивность",
        label: "Как бы вы описали свой уровень энергии в течение дня?",
        type: "options",
        options: [
            { id: "high", text: "Энергии хватает на всё" },
            { id: "drops_noon", text: "Устаю уже к обеду" },
            { id: "low_morning", text: "Чувствую разбитость прямо с утра" }
        ]
    },
    {
        id: "brain_fog",
        section: "Блок 2: Энергия и продуктивность",
        label: "Сталкиваетесь ли вы с «туманом в голове» или сложностью сфокусироваться?",
        type: "options",
        options: [
            { id: "rare", text: "Редко, голова всегда ясная" },
            { id: "often", text: "Часто, трудно долго удерживать внимание" },
            { id: "constant", text: "Постоянно чувствую когнитивную усталость" }
        ]
    },
    {
        id: "mood",
        section: "Блок 2: Энергия и продуктивность",
        label: "Бывают ли у вас моменты резкой смены настроения или раздражительности?",
        type: "options",
        options: [
            { id: "never", text: "Почти никогда" },
            { id: "sometime", text: "Иногда бывает" },
            { id: "regular", text: "Регулярно, трудно контролировать эмоции" }
        ]
    },
    // --- Block 3 ---
    {
        id: "stress",
        section: "Блок 3: Стресс и сон",
        label: "Оцените ваш средний уровень стресса за последний месяц:",
        type: "options",
        options: [
            { id: "low", text: "Низкий (всё под контролем)" },
            { id: "mid", text: "Умеренный (бывают авралы и переживания)" },
            { id: "high", text: "Высокий (живу в состоянии постоянного напряжения)" }
        ]
    },
    {
        id: "sleep_onset",
        section: "Блок 3: Стресс и сон",
        label: "Как быстро вы обычно засыпаете?",
        type: "options",
        options: [
            { id: "fast", text: "Мгновенно (в течение 10–15 минут)" },
            { id: "thoughts", text: "Долго кручусь, прокручивая события дня" },
            { id: "insomnia", text: "Часто страдаю от бессонницы" }
        ]
    },
    {
        id: "tension",
        section: "Блок 3: Стресс и сон",
        label: "Чувствуете ли вы мышечное напряжение или мелкие судороги?",
        type: "options",
        options: [
            { id: "no", text: "Нет" },
            { id: "rare", text: "Изредка" },
            { id: "often", text: "Да, довольно часто" }
        ]
    },
    // --- Block 4 ---
    {
        id: "joints",
        section: "Блок 4: Физические показатели",
        label: "Беспокоит ли вас состояние суставов или плотность костной ткани?",
        type: "options",
        options: [
            { id: "fine", text: "Нет, всё отлично" },
            { id: "start", text: "Начинаю замечать дискомфорт" },
            { id: "prio", text: "Да, это мой приоритет" }
        ]
    },
    {
        id: "immunity",
        section: "Блок 4: Физические показатели",
        label: "Как часто вы замечаете у себя признаки снижения иммунитета?",
        type: "options",
        options: [
            { id: "rare", text: "Очень редко" },
            { id: "few", text: "2–3 раза в год" },
            { id: "regular", text: "Регулярно чувствую недомогание" }
        ]
    },
    {
        id: "diet",
        section: "Блок 4: Физические показатели",
        label: "Придерживаетесь ли вы ограничений в питании?",
        type: "options",
        options: [
            { id: "all", text: "Ем всё" },
            { id: "veg", text: "Вегетарианец / Веган" },
            { id: "keto", text: "Кето-диета / Интервальное голодание" }
        ]
    },
    // --- Block 5 ---
    {
        id: "priority_sphere",
        section: "Блок 5: Цели и приоритеты",
        label: "Какая сфера жизни сейчас требует наибольшей поддержки?",
        type: "options",
        options: [
            { id: "career", text: "Карьера и обучение (нужен острый ум)" },
            { id: "psycho", text: "Психологический комфорт (нужно спокойствие)" },
            { id: "body", text: "Физическое здоровье и долголетие" }
        ]
    },
    {
        id: "recovery",
        section: "Блок 5: Цели и приоритеты",
        label: "Важно ли для вас восстановление после работы или тренировок?",
        type: "options",
        options: [
            { id: "important", text: "Да, это очень важно" },
            { id: "desirable", text: "Желательно, но не приоритетно" },
            { id: "no", text: "Нет необходимости" }
        ]
    },
    {
        id: "main_goal",
        section: "Блок 5: Цели и приоритеты",
        label: "Какой главный результат вы хотите получить от HESSA?",
        type: "options",
        options: [
            { id: "prod", text: "Максимум продуктивности и фокуса" },
            { id: "relax", text: "Глубокое расслабление и качественный сон" },
            { id: "health", text: "Базовое здоровье и баланс" }
        ]
    }
];

export const regions = [
    "Ташкент", "Ташкентская обл.", "Андижан", "Бухара", "Фергана",
    "Джизак", "Хорезм", "Наманган", "Навои", "Кашкадарья",
    "Самарканд", "Сырдарья", "Сурхандарья", "Республика Каракалпакстан"
];

export const durations: Duration[] = [
    { id: 1, label: '1 месяц', discount: 0 },
    { id: 2, label: '2 месяца', discount: 0.05 },
    { id: 3, label: '3 месяца', discount: 0.10 }
];

export const trustBlocks = [
    {
        title: "Собственное производство",
        desc: "Контроль качества на каждом этапе",
        color: "#ebe4ff", // Light Purple
        textColor: "#4c1d95"
    },
    {
        title: "Сертифицировано",
        desc: "Продукты сертифицированы Роспотребнадзором",
        color: "#ffe4e6", // Pink
        textColor: "#be123c"
    },
    {
        title: "Формулы врачей",
        desc: "Составы постоянно совершенствуются экспертами",
        color: "#ffedd5", // Orange
        textColor: "#9a3412"
    },
    {
        title: "Умный подбор",
        desc: "Опрос точно учитывает сочетаемость витаминов",
        color: "#dcfce7", // Green
        textColor: "#166534"
    }
];

export const recommendedProducts: Product[] = [
    {
        id: "magnesium",
        name: "Ежедневный Баланс (D3)",
        desc: "Энергия и поддержка иммунитета",
        price: "115 000 сум",
        image: "https://storage.yandexcloud.net/halsa-public/production/media/products/13/%D0%B2%D0%B8%D1%82%D0%B0%D0%BC%D0%B8%D0%BD-D.jpg"
    },
    {
        id: "omega3",
        name: "Омега-3-6-9",
        desc: "Поддержка работы мозга и сердца",
        price: "245 000 сум",
        image: "https://storage.yandexcloud.net/halsa-public/production/media/products/44/%D0%BE%D0%BC%D0%B5%D0%B3%D0%B0-3-6-9.jpg"
    },
    {
        id: "multivit",
        name: "Коллаген + Витамины",
        desc: "Здоровье кожи, волос и суставов",
        price: "185 000 сум",
        image: "https://storage.yandexcloud.net/halsa-public/production/media/products/86/%D0%BA%D0%BE%D0%BB%D0%BB%D0%B0%D0%B3%D0%B5%D0%BD.jpg"
    }
];
