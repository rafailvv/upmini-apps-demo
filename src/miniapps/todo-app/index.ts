import { TodoList } from './pages/TodoList';
import { TodoStats } from './pages/TodoStats';
import type { MiniappConfig } from '../../types/miniapp';

export const todoAppConfig: MiniappConfig = {
  name: 'todo-app',
  title: 'Todo List',
  description: 'Управление задачами и проектами',
  icon: '📝',
  color: '#4CAF50',
  pages: [
    {
      path: '',
      title: 'Список задач',
      component: TodoList,
    },
    {
      path: 'stats',
      title: 'Статистика',
      component: TodoStats,
    },
  ],
}; 