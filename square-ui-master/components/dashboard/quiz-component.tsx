"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  QuizQuestion, 
  QuizAnswer, 
  Recommendation,
  getRecommendations 
} from "@/mock-data/quiz";
import { Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizComponentProps {
  questions: QuizQuestion[];
  onComplete: (recommendations: Recommendation[]) => void;
}

export function QuizComponent({ questions, onComplete }: QuizComponentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const currentAnswer = answers.find((a) => a.questionId === currentQuestion.id);

  const handleAnswerChange = (optionIds: string[]) => {
    const newAnswers = answers.filter((a) => a.questionId !== currentQuestion.id);
    newAnswers.push({ questionId: currentQuestion.id, optionIds });
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      const recs = getRecommendations(answers);
      setRecommendations(recs);
      setShowRecommendations(true);
      onComplete(recs);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  if (showRecommendations) {
    return (
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Sparkles className="size-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Рекомендации для вас</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                На основе ваших ответов мы подобрали подходящие варианты
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="rounded-xl border border-border bg-card p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">{rec.title}</h4>
                    <p className="text-sm text-muted-foreground">{rec.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-foreground">{rec.price}</div>
                    <Button size="sm" className="mt-2">
                      Выбрать
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Викторина</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Ответьте на вопросы, чтобы мы могли подобрать лучшие варианты для вас
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            {currentQuestionIndex + 1} / {questions.length}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-base font-medium mb-4">{currentQuestion.question}</h3>
          
          {currentQuestion.type === "single" ? (
            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <div
                  key={option.id}
                  className={cn(
                    "flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-colors",
                    currentAnswer?.optionIds.includes(option.id)
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/50"
                  )}
                  onClick={() => handleAnswerChange([option.id])}
                >
                  <input
                    type="radio"
                    checked={currentAnswer?.optionIds.includes(option.id) || false}
                    onChange={() => handleAnswerChange([option.id])}
                    className="size-4 rounded-full border-primary text-primary focus:ring-2 focus:ring-primary"
                  />
                  <Label
                    htmlFor={option.id}
                    className="flex-1 cursor-pointer font-normal"
                  >
                    {option.text}
                  </Label>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <div
                  key={option.id}
                  className={cn(
                    "flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-colors",
                    currentAnswer?.optionIds.includes(option.id)
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/50"
                  )}
                  onClick={() => {
                    const currentIds = currentAnswer?.optionIds || [];
                    const newIds = currentIds.includes(option.id)
                      ? currentIds.filter((id) => id !== option.id)
                      : [...currentIds, option.id];
                    handleAnswerChange(newIds);
                  }}
                >
                  <Checkbox
                    checked={currentAnswer?.optionIds.includes(option.id) || false}
                    onCheckedChange={() => {
                      const currentIds = currentAnswer?.optionIds || [];
                      const newIds = currentIds.includes(option.id)
                        ? currentIds.filter((id) => id !== option.id)
                        : [...currentIds, option.id];
                      handleAnswerChange(newIds);
                    }}
                  />
                  <Label className="flex-1 cursor-pointer font-normal">
                    {option.text}
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentQuestionIndex === 0}
          >
            Назад
          </Button>
          <Button
            onClick={handleNext}
            disabled={
              !currentAnswer || 
              currentAnswer.optionIds.length === 0
            }
            className="gap-2"
          >
            {isLastQuestion ? "Завершить" : "Далее"}
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
