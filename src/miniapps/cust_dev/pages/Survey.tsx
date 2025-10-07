import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SURVEY_CONFIG } from '../utils/surveyConfig';
import { SurveySchema } from '../utils/validation';
import type { SurveyFormData } from '../utils/validation';
import { restoreFromStorage, clearStorage, submitToAPI } from '../utils/storage';
import { runSanityTests } from '../utils/multiSelection';
import { SectionHeader } from '../components/SectionHeader';
import { Pill } from '../components/Pill';
import { ThemeToggle } from '../components/ThemeToggle';
import { QuestionField } from '../components/QuestionField';
import '../styles.css';

export default function Survey() {
  const [currentStep, setCurrentStep] = useState(0);
  const [startedAt] = useState(() => Date.now());
  const [stepStartedAt, setStepStartedAt] = useState(Date.now());
  const [timings, setTimings] = useState<Record<string, number>>({});
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SurveyFormData>({
    resolver: zodResolver(SurveySchema),
    defaultValues: restoreFromStorage(),
    mode: "onChange",
  });

  // Telegram WebApp интеграция (необязательно)
  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      const colorScheme = tg.colorScheme === "dark" ? "dark" : "light";
      setTheme(colorScheme);
      tg.MainButton?.setParams({ text: "отправить ответы" });
      tg.MainButton?.onClick(() => handleSubmit());
    }
    return () => {
      try {
        (window as any).Telegram?.WebApp?.MainButton?.offClick?.(handleSubmit);
      } catch {}
    };
  }, []);

  // Сохранение в localStorage при изменении
  useEffect(() => {
    const subscription = form.watch((values: any) => {
      localStorage.setItem("custdev_survey_values", JSON.stringify(values));
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Простые тесты логики (не влияют на UI, только в консоль)
  useEffect(() => {
    runSanityTests();
  }, []);

  const steps = SURVEY_CONFIG.steps;
  const totalSteps = steps.length;
  const progress = Math.round(((currentStep + 1) / totalSteps) * 100);

  // учёт времени на шаг
  useEffect(() => {
    setStepStartedAt(Date.now());
  }, [currentStep]);

  function persistTimingForStep(stepId: string) {
    const delta = Date.now() - stepStartedAt;
    setTimings((prev) => ({ ...prev, [stepId]: (prev[stepId] || 0) + delta }));
  }

  async function handleNext() {
    const step = steps[currentStep];
    const fields = step.questions.map((q: any) => q.id as keyof SurveyFormData);
    const isValid = await form.trigger(fields as any);
    if (!isValid) return;

    persistTimingForStep(step.id);
    if (currentStep < totalSteps - 1) setCurrentStep((s) => s + 1);
  }

  function handleBack() {
    if (currentStep === 0) return;
    setCurrentStep((s) => s - 1);
  }

  function buildPayload(values: SurveyFormData) {
    return {
      meta: {
        surveyTitle: SURVEY_CONFIG.title,
        startedAt,
        finishedAt: Date.now(),
        durationMs: Date.now() - startedAt,
        userAgent: navigator.userAgent,
        timings, // по шагам
        theme,
      },
      answers: values,
    };
  }

  async function handleSubmit() {
    if (isSubmitting) return; // Предотвращаем повторную отправку
    
    setIsSubmitting(true);
    const values = form.getValues();
    const payload = buildPayload(values);

    try {
      // Отправляем данные на API
      await submitToAPI(values);
      
      // Также отправляем полный payload в Telegram если доступно
      const tg = (window as any).Telegram?.WebApp;
      if (tg) {
        tg.sendData?.(JSON.stringify(payload));
        tg.close?.();
      }

      // Очищаем localStorage
      clearStorage();
      
      // Показываем экран завершения
      setCurrentStep(totalSteps);
      
    } catch (error) {
      console.error('Ошибка при отправке формы:', error);
      
      // В случае ошибки все равно показываем завершение, но с предупреждением
      alert('Произошла ошибка при отправке данных. Попробуйте еще раз.');
      clearStorage();
      setCurrentStep(totalSteps);
    } finally {
      setIsSubmitting(false);
    }
  }

  const StepView = useMemo(() => steps[currentStep], [steps, currentStep]);

  return (
    <div className={`custdev-survey min-h-screen p-4 sm:p-6 md:p-8 ${theme === "dark" ? "custdev-dark bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      {/* Header */}
      <header className="max-w-3xl mx-auto flex items-center gap-3 mb-6">
        <img src={SURVEY_CONFIG.brand.logoUrl} alt={SURVEY_CONFIG.brand.name} className="w-10 h-10 rounded-2xl shadow" />
        <div>
          <h1 className="text-2xl font-bold">{SURVEY_CONFIG.title}</h1>
          <p className="text-sm opacity-80">{SURVEY_CONFIG.subtitle}</p>
        </div>
      </header>

      <div className={`max-w-3xl mx-auto rounded-2xl shadow-lg border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">шаг {Math.min(currentStep + 1, totalSteps)} из {totalSteps}</h2>
            <div className="flex items-center gap-2">
              <Pill>анонимно</Pill>
              <Pill>~7 минут</Pill>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div 
              className="custdev-progress-bar bg-black h-2 rounded-full" 
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>

          {/* Основной контент шага */}
          {currentStep < totalSteps ? (
            <div>
              <SectionHeader title={StepView.title} description={StepView.description} />
              <div className="space-y-6">
                {StepView.questions.map((q: any) => (
                  <QuestionField key={q.id} q={q} control={form.control} errors={form.formState.errors} />
                ))}
              </div>

              {/* Навигация */}
              <div className="flex items-center justify-between mt-8">
                <button
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className="flex items-center gap-1 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  ← назад
                </button>
                {currentStep < totalSteps - 1 ? (
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    далее →
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`flex items-center gap-1 px-6 py-2 rounded-lg transition-colors ${
                      isSubmitting 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        отправка...
                      </>
                    ) : (
                      <>отправить 📄</>
                    )}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-6 text-green-600 text-6xl">🎉</div>
              <h3 className="text-2xl font-bold mb-4 text-green-600">Спасибо за прохождение анкеты!</h3>
              <p className="text-lg mb-2">Ваши ответы помогут нам улучшить продукт</p>
              <p className="opacity-80">Вы можете закрыть это окно</p>
            </div>
          )}

          {/* Доп. панели */}
          <div className="mt-8 flex flex-wrap gap-2 justify-end">
            <ThemeToggle theme={theme} setTheme={setTheme} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-3xl mx-auto text-xs opacity-70 mt-4">
        <p>по всем вопросам: support@upmini.app</p>
      </footer>
    </div>
  );
}
