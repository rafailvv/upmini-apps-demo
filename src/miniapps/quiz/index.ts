import { Quiz } from './QuizApp';
import type { MiniappConfig } from '../../types/miniapp';

export const quizAppConfig: MiniappConfig = {
  name: 'quiz',
  title: 'Квиз',
  description: 'Интерактивный квиз на общие знания',
  icon: '🧠',
  color: '#667eea',
  pages: [
    {
      path: '',
      title: 'Квиз',
      component: Quiz,
    },
  ],
};
