import { Schedule } from './pages/Schedule';
import { Workouts } from './pages/Workouts';
import { Nutrition } from './pages/Nutrition';
import { WorkoutHistory } from './pages/WorkoutHistory';
import { NutritionHistory } from './pages/NutritionHistory';
import { Profile } from './pages/Profile';
import { Health } from './pages/Health';
import { TestHealth } from './pages/TestHealth';
import { SimpleHealth } from './pages/SimpleHealth';
import { MetricsControl } from './pages/MetricsControl';
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
    {
      path: 'workout-history',
      title: 'История тренировок',
      component: WorkoutHistory,
    },
    {
      path: 'nutrition-history',
      title: 'История питания',
      component: NutritionHistory,
    },
    {
      path: 'profile',
      title: 'Личный кабинет',
      component: Profile,
    },
    {
      path: 'health',
      title: 'Здоровье',
      component: Health,
    },
    {
      path: 'test-health',
      title: 'Тест здоровья',
      component: TestHealth,
    },
    {
      path: 'simple-health',
      title: 'Простое здоровье',
      component: SimpleHealth,
    },
    {
      path: 'metrics-control',
      title: 'Метрики контроля',
      component: MetricsControl,
    },
  ],
};
