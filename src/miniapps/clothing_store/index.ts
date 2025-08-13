import { MenuList } from './pages/MenuList';
import { Cart } from './pages/Cart';
import { ItemDetailWrapper } from './pages/ItemDetailWrapper';
import { Favorites } from './pages/Favorites';
import { PastOrders } from './pages/PastOrders';
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

export const clothingStoreAppConfig: MiniappConfig = {
  name: 'clothing_store',
  title: 'Магазин одежды',
  description: 'Каталог и покупки одежды',
  icon: '👗',
  color: '#FF6B35',
  pages: [
    {
      path: '',
      title: 'Каталог',
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
      path: 'past-orders',
      title: 'Прошлые заказы',
      component: PastOrders,
    },
    {
      path: 'item/:itemId',
      title: 'Детали товара',
      component: ItemDetailWrapper,
    },
  ],
};