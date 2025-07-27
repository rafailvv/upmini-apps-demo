import { Weather } from './pages/Weather';
import { Settings } from './pages/Settings';
import type { MiniappConfig } from '../../types/miniapp';

export const weatherAppConfig: MiniappConfig = {
  name: 'weather',
  title: 'Погода',
  description: 'Прогноз погоды и метеоданные',
  icon: '🌤️',
  color: '#FF9800',
  pages: [
    {
      path: '',
      title: 'Погода',
      component: Weather,
    },
    {
      path: 'settings',
      title: 'Настройки',
      component: Settings,
    },
  ],
}; 