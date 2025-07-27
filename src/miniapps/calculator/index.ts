import { Calculator } from './pages/Calculator';
import { History } from './pages/History';
import type { MiniappConfig } from '../../types/miniapp';

export const calculatorAppConfig: MiniappConfig = {
  name: 'calculator',
  title: 'Калькулятор',
  description: 'Простой и удобный калькулятор',
  icon: '🧮',
  color: '#2196F3',
  pages: [
    {
      path: '',
      title: 'Калькулятор',
      component: Calculator,
    },
    {
      path: 'history',
      title: 'История',
      component: History,
    },
  ],
}; 