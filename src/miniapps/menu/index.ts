import { MenuList } from './pages/MenuList';
import { Cart } from './pages/Cart';
import { ItemDetailWrapper } from './pages/ItemDetailWrapper';
import { Favorites } from './pages/Favorites';
import type { MiniappConfig } from '../../types/miniapp';

export const menuAppConfig: MiniappConfig = {
  name: 'menu',
  title: 'Меню ресторана',
  description: 'Заказ еды и доставка',
  icon: '🍽️',
  color: '#FF6B35',
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