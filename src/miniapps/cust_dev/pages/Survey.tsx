import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SURVEY_CONFIG } from '../utils/surveyConfig';
import { SurveySchema } from '../utils/validation';
import type { SurveyFormData } from '../utils/validation';
import { restoreFromStorage, clearStorage, downloadJSON } from '../utils/storage';
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

  function handleSubmit() {
    const values = form.getValues();
    const payload = buildPayload(values);

    // В реальном приложении отправьте на ваш API
    // fetch("/api/submit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
    console.log("SUBMIT PAYLOAD", payload);

    try {
      const tg = (window as any).Telegram?.WebApp;
      if (tg) {
        tg.sendData?.(JSON.stringify(payload));
        tg.close?.();
      }
    } catch {}

    downloadJSON("custdev-answers.json", payload);
    clearStorage();
    setCurrentStep(totalSteps); // показать экран завершения
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
                    className="flex items-center gap-1 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    отправить 📄
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-14 h-14 mx-auto mb-4 text-green-600">✓</div>
              <h3 className="text-xl font-semibold mb-2">спасибо! ответы сохранены</h3>
              <p className="opacity-80">файл с результатами выгружен в формате JSON. вы можете закрыть окно</p>
            </div>
          )}

          {/* Доп. панели */}
          <div className="mt-8 flex flex-wrap gap-2 justify-end">
            <button
              onClick={() => {
                const values = form.getValues();
                downloadJSON("custdev-draft.json", { draft: values, step: currentStep });
              }}
              className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              💾 сохранить черновик
            </button>
            <button
              onClick={() => {
                clearStorage();
                form.reset({} as any);
                setCurrentStep(0);
              }}
              className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ✕ сбросить
            </button>
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
