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

// Фиксированный form_id для анкеты CustDev
export const CUSTDEV_FORM_ID = "f7e8d9c0-b1a2-3456-7890-123456789abc";

// Получение данных пользователя из Telegram
export function getTelegramUserData() {
  const tg = (window as any).Telegram?.WebApp;
  if (tg && tg.initDataUnsafe?.user) {
    return {
      user_id: tg.initDataUnsafe.user.id,
      username: tg.initDataUnsafe.user.username || `user_${tg.initDataUnsafe.user.id}`
    };
  }
  
  // Fallback для тестирования вне Telegram
  return {
    user_id: 123456789,
    username: "test_user"
  };
}

// Отправка данных на API
export async function submitToAPI(formData: any) {
  const userData = getTelegramUserData();
  
  const payload = {
    ...formData,
    user_id: userData.user_id,
    username: userData.username,
    submitted_at: new Date().toISOString()
  };
  
  console.log('Отправляем данные на API:', payload);

  try {
    const response = await fetch(`https://test.upmini.app/api/forms/${CUSTDEV_FORM_ID}/responses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Данные успешно отправлены:', result);
    return result;
  } catch (error) {
    console.error('Ошибка при отправке данных:', error);
    throw error;
  }
}
