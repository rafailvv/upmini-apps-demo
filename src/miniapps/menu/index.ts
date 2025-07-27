import { MenuList } from './pages/MenuList';
import { Cart } from './pages/Cart';
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
      path: 'cart',
      title: 'Корзина',
      component: Cart,
    },
  ],
}; 