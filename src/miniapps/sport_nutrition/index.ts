import { Schedule } from './pages/Schedule';
import { Workouts } from './pages/Workouts';
import { Nutrition } from './pages/Nutrition';
import type { MiniappConfig } from '../../types/miniapp';

export const sportNutritionAppConfig: MiniappConfig = {
  name: 'sport-nutrition',
  title: 'Спорт и питание',
  description: 'Планирование тренировок и питания',
  icon: '🏃‍♂️',
  color: '#007AFF',
  pages: [
    {
      path: '',
      title: 'Моё расписание',
      component: Schedule,
    },
    {
      path: 'workouts',
      title: 'Тренировки',
      component: Workouts,
    },
    {
      path: 'nutrition',
      title: 'Питание',
      component: Nutrition,
    },
  ],
};
