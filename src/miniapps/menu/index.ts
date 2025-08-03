import { MenuList } from './pages/MenuList';
import { Cart } from './pages/Cart';
import { ItemDetailWrapper } from './pages/ItemDetailWrapper';
import { Favorites } from './pages/Favorites';
import type { MiniappConfig } from '../../types/miniapp';
import { loadThemeSettings, applyThemeSettings } from './utils/themeLoader';

// Функция для инициализации темы меню
async function initializeMenuTheme() {
  try {
    const themeSettings = await loadThemeSettings();
    applyThemeSettings(themeSettings);
    return themeSettings;
  } catch (error) {
    console.error('Ошибка инициализации темы меню:', error);
    return {
      font: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      accentColor: '#FF6B35'
    };
  }
}

// Инициализируем тему при загрузке модуля
initializeMenuTheme();

export const menuAppConfig: MiniappConfig = {
  name: 'menu',
  title: 'Меню ресторана',
  description: 'Заказ еды и доставка',
  icon: '🍽️',
  color: '#FF6B35', // Базовый цвет, будет переопределен темой
  pages: [
    {
      path: '',
      title: 'Меню',
      component: MenuList,
    },
    {
      path: 'favorites',
      title: 'Избранное',
      component: Favorites,
    },
    {
      path: 'cart',
      title: 'Корзина',
      component: Cart,
    },
    {
      path: 'item/:itemId',
      title: 'Детали блюда',
      component: ItemDetailWrapper,
    },
  ],
}; 