import { NotesList } from './pages/NotesList';
import { NoteEditor } from './pages/NoteEditor';
import type { MiniappConfig } from '../../types/miniapp';

export const notesAppConfig: MiniappConfig = {
  name: 'notes',
  title: 'Заметки',
  description: 'Создание и управление заметками',
  icon: '📝',
  color: '#9C27B0',
  pages: [
    {
      path: '',
      title: 'Список заметок',
      component: NotesList,
    },
    {
      path: 'editor',
      title: 'Редактор',
      component: NoteEditor,
    },
  ],
}; 