import { z } from "zod";
import { SURVEY_CONFIG } from './surveyConfig';
import { QuestionType } from '../types/survey';

// Схема валидации на основе SURVEY_CONFIG
const schemaShape = {} as Record<string, any>;

for (const step of SURVEY_CONFIG.steps) {
  for (const q of step.questions) {
    switch (q.type) {
      case QuestionType.SINGLE:
      case QuestionType.SELECT:
        schemaShape[q.id] = q.required ? z.string().min(1, "заполните поле") : z.string().optional();
        break;
      case QuestionType.MULTI: {
        let base = q.required ? z.array(z.string()).min(1, "заполните поле") : z.array(z.string()).optional();
        if (q.maxSelect) {
          base = base.refine((arr: string[] | undefined) => !arr || arr.length <= q.maxSelect!, {
            message: `максимум ${q.maxSelect}`,
          });
        }
        schemaShape[q.id] = base;
        break;
      }
      case QuestionType.TEXT:
        schemaShape[q.id] = q.required ? z.string().min(1, "заполните поле") : z.string().optional();
        break;
      case QuestionType.LONGTEXT: {
        let s: any = z.string().optional();
        if (q.required) s = z.string().min(1, "заполните поле");
        if (q.maxLength) s = s.refine((v: string) => !v || v.length <= q.maxLength!, { message: `не более ${q.maxLength} символов` });
        schemaShape[q.id] = s;
        break;
      }
      case QuestionType.NPS:
        schemaShape[q.id] = q.required ? z.number().min(0, "заполните поле").max(10) : z.number().min(0).max(10).optional();
        break;
      case QuestionType.RATING:
        schemaShape[q.id] = q.required ? z.number().min(1, "заполните поле").max(5) : z.number().min(1).max(5).optional();
        break;
      case QuestionType.BOOLEAN:
        schemaShape[q.id] = q.required
          ? z.boolean().refine((v: boolean) => v === true, { message: "нужно согласие" })
          : z.boolean().optional();
        break;
      default:
        break;
    }
  }
}

export const SurveySchema = z.object(schemaShape);
export type SurveyFormData = z.infer<typeof SurveySchema>;
