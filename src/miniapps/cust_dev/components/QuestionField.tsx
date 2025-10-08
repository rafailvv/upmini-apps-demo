import { Controller } from 'react-hook-form';
import type { Control, FieldErrors } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { QuestionType } from '../types/survey';
import type { SurveyFormData } from '../utils/validation';
import { applyMultiSelection } from '../utils/multiSelection';
import { NpsPicker } from './NpsPicker';
import { RatingPicker } from './RatingPicker';

interface QuestionFieldProps {
  q: any;
  control: Control<SurveyFormData>;
  errors: FieldErrors<SurveyFormData>;
}

export function QuestionField({ q, control, errors }: QuestionFieldProps) {
  const error = errors?.[q.id]?.message as string | undefined;
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [savedUserInput, setSavedUserInput] = useState<string>('');
  
  return (
    <div className="custdev-question-card p-3 border rounded-2xl">
      <label className="text-sm font-medium">
        {q.title}
        {q.required && <span className="ml-1 text-red-500">*</span>}
      </label>
      {q.description && <p className="text-xs opacity-70 mt-1">{q.description}</p>}
      <div className="mt-3">
        <Controller
          name={q.id}
          control={control}
          render={({ field }: any) => {
            // Отслеживаем изменения в field.value для управления полем "Другое"
            useEffect(() => {
              if (q.type === QuestionType.SINGLE) {
                // Показываем поле только если выбрана именно опция "Другое" или "Другое (укажите)"
                const isOtherSelected = field.value && (field.value === 'Другое' || field.value === 'Другое (укажите)');
                setShowOtherInput(isOtherSelected);
              } else if (q.type === QuestionType.MULTI) {
                const currentValues = Array.isArray(field.value) ? field.value : [];
                const hasOther = currentValues.includes('Другое') || currentValues.includes('Другое (укажите)');
                setShowOtherInput(hasOther);
              }
            }, [field.value, q.type, q.options]);
            
            switch (q.type) {
              case QuestionType.SINGLE:
                return (
                  <div className="flex flex-col gap-2">
                    {q.options.map((opt: string) => (
                      <div key={opt} className="custdev-option rounded-xl border">
                        <div className="p-2">
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={q.id}
                              value={opt}
                              checked={field.value === opt}
                              onChange={() => {
                                if (opt.includes('Другое')) {
                                  setShowOtherInput(true);
                                  field.onChange(opt);
                                } else {
                                  setShowOtherInput(false);
                                  field.onChange(opt);
                                }
                              }}
                            />
                            {opt}
                          </label>
                        </div>
                        {opt === 'Другое' && showOtherInput && (
                          <div className="mt-2 -mx-2">
                            <textarea
                              name="other_input"
                              placeholder="Укажите свой вариант"
                              rows={6}
                              className="w-full p-2 border rounded-lg"
                              value={savedUserInput}
                              onChange={(e) => {
                                const userInput = e.target.value;
                                setSavedUserInput(userInput);
                                
                                if (userInput.trim()) {
                                  field.onChange(userInput);
                                } else {
                                  field.onChange('Другое');
                                }
                              }}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              case QuestionType.SELECT:
                return (
                  <select 
                    value={field.value || ""} 
                    onChange={(e) => field.onChange(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="">Выберите вариант</option>
                    {q.options.map((opt: string) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                );
              case QuestionType.MULTI:
                return (
                  <div className="flex flex-col gap-2">
                    {q.options.map((opt: string) => (
                      <div key={opt} className="custdev-option rounded-xl border">
                        <div className="p-2">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={Array.isArray(field.value) ? field.value.includes(opt) : false}
                              onChange={(e) => {
                                const next = applyMultiSelection({
                                  current: Array.isArray(field.value) ? field.value : [],
                                  option: opt,
                                  checked: e.target.checked,
                                  maxSelect: q.maxSelect,
                                  exclusiveOptions: q.exclusiveOptions,
                                });
                                field.onChange(next);
                                
                                // Показываем поле ввода для "Другое"
                                if (opt.includes('Другое')) {
                                  setShowOtherInput(e.target.checked);
                                }
                              }}
                            />
                            {opt}
                          </label>
                        </div>
                        {opt === 'Другое' && showOtherInput && (
                          <div className="mt-2 -mx-2">
                            <textarea
                              name="other_input"
                              placeholder="Укажите свой вариант"
                              rows={6}
                              className="w-full p-2 border rounded-lg"
                              value={savedUserInput}
                              onChange={(e) => {
                                const userInput = e.target.value;
                                setSavedUserInput(userInput);
                                
                                const currentValues = Array.isArray(field.value) ? field.value : [];
                                
                                // Сохраняем все стандартные опции (включая "Другое")
                                const standardOptions = currentValues.filter(v => q.options.includes(v));
                                
                                // Добавляем новый пользовательский ввод, если он не пустой
                                const finalValues = [...standardOptions];
                                if (userInput.trim()) {
                                  finalValues.push(userInput);
                                }
                                
                                field.onChange(finalValues);
                              }}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              case QuestionType.TEXT:
                return (
                  <input
                    type="text"
                    {...field}
                    placeholder={q.placeholder}
                    className="w-full p-2 border rounded-lg"
                  />
                );
              case QuestionType.LONGTEXT:
                return (
                  <div className="space-y-2">
                    <textarea
                      {...field}
                      placeholder={q.placeholder}
                      rows={6}
                      className="w-full p-2 border rounded-lg"
                    />
                    {q.maxLength && (
                      <div className="text-xs opacity-70 text-right">
                        {(field.value?.length || 0)}/{q.maxLength}
                      </div>
                    )}
                  </div>
                );
              case QuestionType.NPS:
                return <NpsPicker value={field.value} onChange={field.onChange} />;
              case QuestionType.RATING:
                return <RatingPicker value={field.value} onChange={field.onChange} />;
              case QuestionType.BOOLEAN:
                return (
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={!!field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                    <span className="text-sm">{field.value ? "Да" : "Нет"}</span>
                  </div>
                );
              default:
                return <div>Неизвестный тип вопроса</div>;
            }
          }}
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
    </div>
  );
}
