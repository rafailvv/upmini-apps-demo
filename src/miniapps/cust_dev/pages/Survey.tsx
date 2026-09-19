import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SURVEY_CONFIG } from '../utils/surveyConfig';
import { SurveySchema } from '../utils/validation';
import type { SurveyFormData } from '../utils/validation';
import { submitToAPI } from '../utils/storage';
import { runSanityTests } from '../utils/multiSelection';
import { SectionHeader } from '../components/SectionHeader';
import { Pill } from '../components/Pill';
import { QuestionField } from '../components/QuestionField';
import { isTelegramMiniApp, initTelegramMiniApp, hideSurveyCloseButton } from '../../../utils/telegramUtils';
import '../styles.css';

export default function Survey() {
  const [currentStep, setCurrentStep] = useState(0);
  const [startedAt] = useState(() => Date.now());
  const [stepStartedAt, setStepStartedAt] = useState(Date.now());
  const [timings, setTimings] = useState<Record<string, number>>({});
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    // Автоматическое определение темы
    if (typeof window !== 'undefined') {
      // Проверяем системную тему
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? "dark" : "light";
    }
    return "light";
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SurveyFormData>({
    resolver: zodResolver(SurveySchema),
    defaultValues: {},
    mode: "onChange",
  });

  // Telegram WebApp интеграция
  useEffect(() => {
    // Инициализируем Telegram MiniApp
    initTelegramMiniApp();
    
    // Настраиваем кнопку "Закрыть" для страницы Survey
    //setupSurveyCloseButton();
    
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.ready();
      if (isTelegramMiniApp()) tg.expand();
      // Используем тему Telegram, если доступна, иначе оставляем автоматически определенную
      if (tg.colorScheme) {
        const colorScheme = tg.colorScheme === "dark" ? "dark" : "light";
        setTheme(colorScheme);
      }
      
      // Добавляем класс для стилизации в Telegram
      document.body.classList.add('telegram-miniapp');
      
      // Добавляем отступ для хедера в Telegram на мобильных устройствах
      if (isTelegramMiniApp()) {
        const headers = document.querySelectorAll('header');
        headers.forEach(header => {
          (header as HTMLElement).style.marginTop = '100px';
        });
      }
      
    }
    
    // Cleanup функция для скрытия кнопки при размонтировании компонента
    return () => {
      hideSurveyCloseButton();
    };
      
  }, []);

  // Данные не сохраняются при обновлении страницы

  // Кнопка "Назад" в Telegram всегда скрыта

  // Встроенная кнопка Telegram скрыта

  // Простые тесты логики (не влияют на UI, только в консоль)
  useEffect(() => {
    runSanityTests();
  }, []);

  // Слушатель изменения системной темы
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
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
    
    // Кастомная логика для 4-го шага (pricing)
    if (currentStep === 3) {
      const currentPayment = form.getValues('current_payment');
      
      // Определяем какие поля нужно валидировать в зависимости от выбора
      let fieldsToValidate: string[] = ['current_payment'];
      
      if (currentPayment === 'Не плачу, использую только бесплатные решения') {
        // Для бесплатных пользователей
        fieldsToValidate.push('willing_to_pay_more', 'value_for_money', 'must_have', 'switching_threshold');
      } else if (currentPayment && currentPayment !== 'Не плачу, использую только бесплатные решения') {
        // Для платных пользователей
        fieldsToValidate.push('current_solution_missing', 'additional_payment_willingness');
      }
      
      const isValid = await form.trigger(fieldsToValidate as any);
      if (!isValid) return;
    } else {
      // Обычная валидация для остальных шагов
      const fields = step.questions.map((q: any) => q.id as keyof SurveyFormData);
      const isValid = await form.trigger(fields as any);
      if (!isValid) return;
    }

    persistTimingForStep(step.id);
    if (currentStep < totalSteps - 1) {
      setCurrentStep((s) => s + 1);
      // Прокручиваем наверх страницы с задержкой после обновления состояния
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  }

  function handleBack() {
    if (currentStep === 0) {
      // Даже на первом шаге прокручиваем наверх
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setCurrentStep((s) => s - 1);
    // Прокручиваем наверх страницы с небольшой задержкой
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  }

  function buildPayload(values: SurveyFormData) {
    // Собираем пользовательские вводы из localStorage
    const otherInputs: Record<string, string> = {};
    for (const step of SURVEY_CONFIG.steps) {
      for (const q of step.questions) {
        const otherInput = localStorage.getItem(`custdev_other_${q.id}`);
        if (otherInput) {
          otherInputs[q.id] = otherInput;
        }
      }
    }

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
      otherInputs, // Добавляем пользовательские вводы
    };
  }

  async function handleSubmit() {
    if (isSubmitting) return; // Предотвращаем повторную отправку
    
    setIsSubmitting(true);
    const values = form.getValues();
    console.log('Данные формы перед отправкой:', values);
    const payload = buildPayload(values);
    console.log('Полный payload:', payload);

    try {
      // Отправляем данные на API
      await submitToAPI(values);
      
      // Также отправляем полный payload в Telegram если доступно
      const tg = (window as any).Telegram?.WebApp;
      if (tg) {
        tg.sendData?.(JSON.stringify(payload));
        // Не закрываем мини-приложение автоматически
      }

      // Данные не сохраняются, очистка не нужна
      
      // Показываем экран завершения
      setCurrentStep(totalSteps);
      
    } catch (error) {
      console.error('Ошибка при отправке формы:', error);
      
      // В случае ошибки все равно показываем завершение, но с предупреждением
      alert('Произошла ошибка при отправке данных. Попробуйте еще раз.');
      setCurrentStep(totalSteps);
    } finally {
      setIsSubmitting(false);
    }
  }

  const StepView = useMemo(() => steps[currentStep], [steps, currentStep]);

  return (
    <div className={`custdev-survey min-h-screen p-4 sm:p-6 md:p-8 ${theme === "dark" ? "custdev-dark bg-gray-900 text-white" : "bg-gray-50 text-gray-900"} telegram-miniapp`}>
      {/* Header */}
      <header className="max-w-3xl mx-auto flex items-center gap-3 mb-6">
        <img src={SURVEY_CONFIG.brand.logoUrl} alt={SURVEY_CONFIG.brand.name} className="w-16 h-16 rounded-2xl shadow" />
        <div>
          <h1 className="text-2xl font-bold">{SURVEY_CONFIG.title}</h1>
          <p className="text-sm opacity-80">{SURVEY_CONFIG.subtitle}</p>
        </div>
      </header>

      <div className={`max-w-4xl mx-auto rounded-2xl shadow-lg border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Шаг {Math.min(currentStep + 1, totalSteps)} из {totalSteps}</h2>
            <div className="flex items-center gap-2">
              <Pill>Анонимно</Pill>
              <Pill>~5 минут</Pill>
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
              <div className="space-y-4">
                {StepView.questions.map((q: any) => {
                  // Условная логика для 4-го шага (pricing)
                  if (currentStep === 3) { // 4-й шаг (индекс 3)
                    const currentPayment = form.watch('current_payment');
                    
                    // Показываем только первый вопрос, пока не выбран ответ
                    if (!currentPayment) {
                      if (q.id !== 'current_payment') {
                        return null;
                      }
                    }
                    // Если выбрано "Не плачу, использую только бесплатные решения"
                    else if (currentPayment === 'Не плачу, использую только бесплатные решения') {
                      // Показываем вопросы для бесплатных пользователей
                      if (q.id === 'current_solution_missing' || q.id === 'additional_payment_willingness') {
                        return null;
                      }
                    }
                    // Если выбрано что-то другое (платные пользователи)
                    else {
                      // Показываем вопросы для платных пользователей
                      if (q.id === 'willing_to_pay_more' || q.id === 'value_for_money' || q.id === 'must_have' || q.id === 'switching_threshold') {
                        return null;
                      }
                    }
                  }
                  
                  return <QuestionField key={q.id} q={q} control={form.control} errors={form.formState.errors} />;
                })}
              </div>

              {/* Навигация */}
              <div className="flex items-center justify-between mt-8">
                {currentStep > 0 && (
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-1 px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    ← Назад
                  </button>
                )}
                {currentStep === 0 && (
                  <div className="flex-1"></div>
                )}
                {currentStep < totalSteps - 1 ? (
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-1 px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors border border-gray-300"
                  >
                    Далее →
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`flex items-center gap-1 px-6 py-2 rounded-lg custdev-submit-button ${
                      isSubmitting ? 'cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Отправка...
                      </>
                    ) : (
                      <>Отправить</>
                    )}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-6 text-green-600 text-6xl">🎉</div>
              <h3 className="text-2xl font-bold mb-4">Спасибо за прохождение анкеты!</h3>
              <p className="text-lg mb-2">Ваши ответы помогут нам улучшить продукт</p>
            </div>
          )}

        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-3xl mx-auto text-xs opacity-70 mt-8 mb-4">
        <p>
          По всем вопросам можно обращаться{' '}
          <a 
            href="https://t.me/avotaangi" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            сюда
          </a>
          {' '}или на почту info@upmini.app
        </p>
      </footer>
    </div>
  );
}
