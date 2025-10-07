// Типы вопросов
export const QuestionType = {
  SINGLE: "single",
  MULTI: "multi",
  TEXT: "text",
  LONGTEXT: "longtext",
  NPS: "nps",
  RATING: "rating",
  BOOLEAN: "boolean",
  SELECT: "select",
} as const;

export type QuestionTypeKey = keyof typeof QuestionType;

export interface Question {
  id: string;
  type: string;
  title: string;
  options?: string[];
  placeholder?: string;
  required: boolean;
  maxLength?: number;
  maxSelect?: number;
  exclusiveOptions?: string[];
  description?: string;
}

export interface SurveyStep {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
}

export interface SurveyConfig {
  title: string;
  subtitle: string;
  brand: {
    name: string;
    logoUrl: string;
  };
  steps: SurveyStep[];
}

export interface SurveyMeta {
  surveyTitle: string;
  startedAt: number;
  finishedAt: number;
  durationMs: number;
  userAgent: string;
  timings: Record<string, number>;
  theme: "light" | "dark";
}

export interface SurveyPayload {
  meta: SurveyMeta;
  answers: Record<string, any>;
}
