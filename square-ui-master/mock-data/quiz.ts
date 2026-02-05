export type QuizQuestion = {
  id: string;
  question: string;
  type: "single" | "multiple";
  options: QuizOption[];
};

export type QuizOption = {
  id: string;
  text: string;
  category?: string; // Для рекомендаций
};

export type QuizAnswer = {
  questionId: string;
  optionIds: string[];
};

export type Recommendation = {
  id: string;
  title: string;
  description: string;
  category: string;
  price: string;
  image?: string;
};

export const mockQuizQuestions: QuizQuestion[] = [
  {
    id: "1",
    question: "Какой тип услуг вас больше всего интересует?",
    type: "single",
    options: [
      { id: "1-1", text: "Консультационные услуги", category: "consulting" },
      { id: "1-2", text: "Техническая поддержка", category: "support" },
      { id: "1-3", text: "Образовательные программы", category: "education" },
      { id: "1-4", text: "Маркетинговые услуги", category: "marketing" },
    ],
  },
  {
    id: "2",
    question: "Какой бюджет вы готовы выделить?",
    type: "single",
    options: [
      { id: "2-1", text: "До 500,000 сум", category: "budget_low" },
      { id: "2-2", text: "500,000 - 1,000,000 сум", category: "budget_medium" },
      { id: "2-3", text: "1,000,000 - 2,000,000 сум", category: "budget_high" },
      { id: "2-4", text: "Более 2,000,000 сум", category: "budget_premium" },
    ],
  },
  {
    id: "3",
    question: "Какие дополнительные услуги вам нужны?",
    type: "multiple",
    options: [
      { id: "3-1", text: "Персональный менеджер", category: "premium" },
      { id: "3-2", text: "Приоритетная поддержка", category: "premium" },
      { id: "3-3", text: "Обучение команды", category: "education" },
      { id: "3-4", text: "Аналитика и отчеты", category: "analytics" },
    ],
  },
  {
    id: "4",
    question: "Как часто вам нужна поддержка?",
    type: "single",
    options: [
      { id: "4-1", text: "Ежедневно", category: "support_daily" },
      { id: "4-2", text: "Несколько раз в неделю", category: "support_weekly" },
      { id: "4-3", text: "По необходимости", category: "support_on_demand" },
      { id: "4-4", text: "Раз в месяц", category: "support_monthly" },
    ],
  },
];

export const mockRecommendations: Recommendation[] = [
  {
    id: "rec-1",
    title: "Премиум пакет услуг",
    description: "Включает все услуги + персональный менеджер + приоритетная поддержка",
    category: "premium",
    price: "2,000,000 сум",
  },
  {
    id: "rec-2",
    title: "Базовый пакет",
    description: "Основные услуги с поддержкой по необходимости",
    category: "basic",
    price: "800,000 сум",
  },
  {
    id: "rec-3",
    title: "Расширенный пакет",
    description: "Расширенный набор услуг с еженедельной поддержкой",
    category: "extended",
    price: "1,500,000 сум",
  },
  {
    id: "rec-4",
    title: "Консультационный пакет",
    description: "Профессиональные консультации по вашим вопросам",
    category: "consulting",
    price: "1,200,000 сум",
  },
  {
    id: "rec-5",
    title: "Образовательный пакет",
    description: "Обучение вашей команды и образовательные материалы",
    category: "education",
    price: "900,000 сум",
  },
];

// Функция для получения рекомендаций на основе ответов
export function getRecommendations(answers: QuizAnswer[]): Recommendation[] {
  const categories = new Set<string>();
  
  answers.forEach((answer) => {
    const question = mockQuizQuestions.find((q) => q.id === answer.questionId);
    if (question) {
      answer.optionIds.forEach((optionId) => {
        const option = question.options.find((o) => o.id === optionId);
        if (option?.category) {
          categories.add(option.category);
        }
      });
    }
  });

  // Фильтруем рекомендации на основе категорий
  const recommended = mockRecommendations.filter((rec) => {
    if (categories.has("premium") || categories.has("budget_premium")) {
      return rec.category === "premium";
    }
    if (categories.has("budget_high")) {
      return rec.category === "extended" || rec.category === "premium";
    }
    if (categories.has("budget_medium")) {
      return rec.category === "extended" || rec.category === "basic";
    }
    if (categories.has("consulting")) {
      return rec.category === "consulting";
    }
    if (categories.has("education")) {
      return rec.category === "education";
    }
    return rec.category === "basic";
  });

  return recommended.length > 0 ? recommended : [mockRecommendations[1]]; // По умолчанию базовый
}
