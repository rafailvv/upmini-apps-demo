import type { SurveyConfig } from '../types/survey';
import { QuestionType } from '../types/survey';

// Конфиг анкетирования (адаптирован под ваши 15 вопросов)
export const SURVEY_CONFIG: SurveyConfig = {
  title: "анкета для custdev Upmini.app",
  subtitle: "займёт 5–7 минут. ответы анонимны, данные — только для анализа продукта",
  brand: {
    name: "Upmini.app",
    logoUrl: "https://dummyimage.com/80x80/000/fff&text=U",
  },
  steps: [
    // I. Квалификация и текущая ситуация
    {
      id: "qualification",
      title: "квалификация и текущая ситуация",
      description: "помогите понять ваш контекст",
      questions: [
        {
          id: "domain",
          type: QuestionType.SINGLE,
          title: "к какой сфере деятельности вы относитесь?",
          options: [
            "здоровье и спорт (тренеры, нутрициологи, wellness-коучи)",
            "образование и развитие (репетиторы, онлайн-школы, авторы курсов)",
            "услуги и бизнес (мастера услуг, консультанты, маркетологи)",
            "творчество и хобби (дизайнеры, фотографы, артисты)",
            "сфера мероприятий (спикеры, организаторы)",
            "другое (укажите)",
          ],
          required: true,
        },
        {
          id: "client_channels",
          type: QuestionType.MULTI,
          title: "где вы чаще общаетесь с клиентами?",
          options: ["telegram", "whatsapp", "instagram", "сайт / crm", "другое"],
          required: true,
        },
        {
          id: "daily_time",
          type: QuestionType.SINGLE,
          title: "сколько времени уходит на организацию и переписку с клиентами в день?",
          options: ["менее 1 часа", "1–2 часа", "3–5 часов", "более 5 часов"],
          required: true,
        },
        {
          id: "current_automation",
          type: QuestionType.MULTI,
          title: "какие инструменты автоматизации сейчас используете для взаимодействия с клиентами?",
          options: [
            "программы для записи (например, calendly)",
            "мини‑приложения или боты для telegram",
            "crm‑системы",
            "собственные сайты / лендинги",
            "таблицы / ручное управление",
            "не использую автоматизацию",
          ],
          required: true,
        },
      ],
    },

    // II. Боль и процессы (Retaining / LTV)
    {
      id: "pain",
      title: "боль и процессы (retaining / ltv)",
      description: "как вы работаете с клиентами после продажи",
      questions: [
        {
          id: "post_sale_process",
          type: QuestionType.LONGTEXT,
          title: "как сейчас организован процесс ведения клиентов после продажи или консультации?",
          placeholder: "опишите шаги, инструменты, кто что делает…",
          required: false,
          maxLength: 800,
        },
        {
          id: "pain_points",
          type: QuestionType.MULTI,
          title: "что чаще всего вызывает сложности? (выберите до 3 вариантов)",
          options: [
            "отправка напоминаний и сообщений вручную",
            "принятие и учёт оплат",
            "отсутствие автоматических рассылок / уведомлений",
            "неудобное расписание или бронирование",
            "много несогласованных инструментов (бот, таблица, сайт и т. д.)",
            "сложно возвращать клиентов / низкий ltv",
          ],
          maxSelect: 3,
          required: true,
        },
        {
          id: "retention_satisfaction",
          type: QuestionType.RATING,
          title: "насколько вы удовлетворены удержанием клиентов после первой покупки? (1–5)",
          required: true,
        },
      ],
    },

    // III. Проверка гипотезы об экосистеме и простоте
    {
      id: "ecosystem",
      title: "экосистема и простота",
      description: "проверка ценности единой системы",
      questions: [
        {
          id: "desync",
          type: QuestionType.SINGLE,
          title: "сталкиваетесь ли вы с разрозненностью инструментов и ручной синхронизацией?",
          options: ["да, постоянно", "иногда", "редко", "нет, всё интегрировано"],
          required: true,
        },
        {
          id: "importance_unified",
          type: QuestionType.SINGLE,
          title: "насколько важно объединить запись, магазин и лояльность в одну экосистему в telegram с единой базой данных?",
          options: [
            "крайне важно — это решило бы ключевые проблемы",
            "важно — улучшило бы эффективность",
            "не особо важно — меня устраивают разрозненные решения",
            "нужен только один, простой инструмент",
          ],
          required: true,
        },
        {
          id: "platform_preference",
          type: QuestionType.SINGLE,
          title: "что вам ближе: универсальная платформа или нишевое решение?",
          options: [
            "универсальная платформа, где можно собрать нужные модули",
            "узкое решение под мою сферу (например, только для тренеров или репетиторов)",
          ],
          required: true,
        },
      ],
    },

    // IV. Готовность платить и мотивация
    {
      id: "pricing",
      title: "готовность платить и мотивация",
      description: "как вы оцениваете ценность",
      questions: [
        {
          id: "value_for_money",
          type: QuestionType.MULTI,
          title: "за что вы готовы платить 1500–2500 ₽ в месяц?",
          options: [
            "экономия времени / меньше рутины",
            "удобство и автоматизация для клиентов",
            "рост продаж",
            "поддержка и обучение",
            "не готов платить",
          ],
          exclusiveOptions: ["не готов платить"],
          required: true,
        },
        {
          id: "must_have",
          type: QuestionType.LONGTEXT,
          title: "что должно быть в сервисе, чтобы вы сказали: 'да, за это стоит платить' и ушли с бесплатных решений?",
          placeholder: "конкретные функции, сценарии, сервисные ожидания…",
          required: false,
          maxLength: 800,
        },
        {
          id: "switching_threshold",
          type: QuestionType.RATING,
          title: "насколько вы готовы мириться с неудобствами в бесплатных инструментах, прежде чем перейти на платный аналог? (1–5)",
          required: true,
        },
      ],
    },

    // V. Проверка партнёрской гипотезы
    {
      id: "partner",
      title: "партнёрская программа",
      description: "готовность рекомендовать",
      questions: [
        {
          id: "referral_attitude",
          type: QuestionType.SINGLE,
          title: "если инструмент реально помогает и за рекомендацию платят, как вы к этому отнеслись бы?",
          options: [
            "с удовольствием рекомендовал бы",
            "возможно, если условия прозрачные",
            "не уверен, не люблю подобные схемы",
            "не стал бы этим заниматься",
          ],
          required: true,
        },
      ],
    },

    // VI. Финальный вопрос
    {
      id: "final",
      title: "финальный вопрос",
      description: "участие в тестировании",
      questions: [
        {
          id: "participation",
          type: QuestionType.SINGLE,
          title: "хотите помочь нам и получить готовое решение по итогам участия?",
          options: ["да, хочу участвовать", "возможно, позже", "нет, спасибо"],
          required: true,
        },
        {
          id: "contact",
          type: QuestionType.TEXT,
          title: "телеграм или почта для связи (по желанию)",
          placeholder: "@username или email",
          required: false,
        },
      ],
    },
  ],
};
