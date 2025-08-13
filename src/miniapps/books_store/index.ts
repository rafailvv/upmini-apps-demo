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
      accentColor: '#8B4513'
    };
  }
}

// Инициализируем тему при загрузке модуля
initializeMenuTheme();

export const booksStoreAppConfig: MiniappConfig = {
  name: 'books_store',
  title: 'Книжный магазин',
  description: 'Каталог книг и литературных произведений',
  icon: '📚',
  color: '#8B4513',
  pages: [
    {
      path: '',
      title: 'Каталог книг',
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
      title: 'Детали книги',
      component: ItemDetailWrapper,
    },
  ],
};