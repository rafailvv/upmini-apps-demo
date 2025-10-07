import Survey from './pages/Survey';
import type { MiniappConfig } from '../../types/miniapp';

export const custDevAppConfig: MiniappConfig = {
  name: 'cust_dev',
  title: 'Анкета CustDev',
  description: 'Анкета для исследования клиентов Upmini.app',
  icon: '📋',
  color: '#3B82F6',
  pages: [
    {
      path: '',
      title: 'Анкета',
      component: Survey,
    },
  ],
};
