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
        schemaShape[q.id] = q.required 
          ? z.union([z.string().min(1, "Заполните данное поле"), z.undefined()]).refine((val) => val !== undefined && val !== "", "Заполните данное поле")
          : z.union([z.string(), z.undefined()]);
        break;
      case QuestionType.MULTI: {
        let base = q.required 
          ? z.union([z.array(z.string()).min(1, "Заполните данное поле"), z.undefined()]).refine((val) => val !== undefined && val.length > 0, "Заполните данное поле")
          : z.union([z.array(z.string()), z.undefined()]);
        if (q.maxSelect) {
          base = base.refine((arr: string[] | undefined) => !arr || arr.length <= q.maxSelect!, {
            message: "Заполните данное поле",
          });
        }
        schemaShape[q.id] = base;
        break;
      }
      case QuestionType.TEXT:
        schemaShape[q.id] = q.required 
          ? z.string().min(1, "Заполните данное поле") 
          : z.union([z.string(), z.undefined()]);
        break;
      case QuestionType.LONGTEXT: {
        let s: any = q.required 
          ? z.union([z.string().min(1, "Заполните данное поле"), z.undefined()]).refine((val) => val !== undefined && val !== "", "Заполните данное поле")
          : z.union([z.string(), z.undefined()]);
        if (q.maxLength) s = s.refine((v: string | undefined) => !v || v.length <= q.maxLength!, { message: "Заполните данное поле" });
        schemaShape[q.id] = s;
        break;
      }
      case QuestionType.NPS:
        schemaShape[q.id] = q.required 
          ? z.union([z.number().min(0, "Заполните данное поле").max(10), z.undefined()]).refine((val) => val !== undefined, "Заполните данное поле")
          : z.union([z.number().min(0).max(10), z.undefined()]);
        break;
      case QuestionType.RATING:
        schemaShape[q.id] = q.required 
          ? z.union([z.number().min(1, "Заполните данное поле").max(5), z.undefined()]).refine((val) => val !== undefined, "Заполните данное поле")
          : z.union([z.number().min(1).max(5), z.undefined()]);
        break;
      case QuestionType.BOOLEAN:
        schemaShape[q.id] = q.required
          ? z.boolean().refine((v: boolean) => v === true, { message: "Заполните данное поле" })
          : z.union([z.boolean(), z.undefined()]);
        break;
      default:
        break;
    }
  }
}

export const SurveySchema = z.object(schemaShape);
export type SurveyFormData = z.infer<typeof SurveySchema>;
