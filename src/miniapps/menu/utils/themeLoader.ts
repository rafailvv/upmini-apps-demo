export interface ThemeSettings {
  font: string;
  accentColor: string;
}

export async function loadThemeSettings(): Promise<ThemeSettings> {
  try {
    // Импортируем JSON файл напрямую через Vite
    const themeModule = await import('../data/theme.json');
    const themeSettings: ThemeSettings = themeModule.default;
    return themeSettings;
  } catch (error) {
    console.error('Ошибка загрузки настроек темы:', error);
    // Возвращаем значения по умолчанию
    return {
      font: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      accentColor: '#FF6B35'
    };
  }
}

export function applyThemeSettings(settings: ThemeSettings): void {
  const root = document.documentElement;
  
  // Применяем шрифт
  root.style.setProperty('--menu-font', settings.font);
  
  // Применяем акцентный цвет
  root.style.setProperty('--menu-accent-color', settings.accentColor);
} 