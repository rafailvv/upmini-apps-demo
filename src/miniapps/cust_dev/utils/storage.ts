import type { SurveyFormData } from './validation';

export function restoreFromStorage(): Partial<SurveyFormData> {
  try {
    const raw = localStorage.getItem("custdev_survey_values");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function clearStorage() {
  localStorage.removeItem("custdev_survey_values");
}

export function downloadJSON(filename: string, data: any) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}
