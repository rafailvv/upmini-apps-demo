import React, { useState } from 'react';
import '../styles.css';

interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  isFavorite: boolean;
}

export const NotesList: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: 1,
      title: 'Идеи для проекта',
      content: 'Создать мини-приложение для Telegram с множественными страницами...',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 день назад
      updatedAt: new Date(Date.now() - 1000 * 60 * 30), // 30 минут назад
      isFavorite: true,
    },
    {
      id: 2,
      title: 'Список покупок',
      content: 'Молоко, хлеб, яйца, овощи, фрукты',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 часа назад
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      isFavorite: false,
    },
    {
      id: 3,
      title: 'Важные встречи',
      content: 'Встреча с клиентом в 15:00\nПрезентация проекта в 17:00',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 дня назад
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 часов назад
      isFavorite: true,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFavorites = !showFavoritesOnly || note.isFavorite;
    return matchesSearch && matchesFavorites;
  });

  const toggleFavorite = (id: number) => {
    setNotes(notes.map(note =>
      note.id === id ? { ...note, isFavorite: !note.isFavorite } : note
    ));
  };

  const deleteNote = (id: number) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes} мин назад`;
    if (hours < 24) return `${hours} ч назад`;
    return `${days} дн назад`;
  };

  return (
    <div className="notes-list">
      <div className="notes-header">
        <h2>Мои заметки</h2>
        <div className="notes-controls">
          <input
            type="text"
            placeholder="Поиск заметок..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`favorites-toggle ${showFavoritesOnly ? 'active' : ''}`}
          >
            ⭐
          </button>
        </div>
      </div>

      <div className="notes-grid">
        {filteredNotes.map((note) => (
          <div key={note.id} className="note-card">
            <div className="note-header">
              <h3 className="note-title">{note.title}</h3>
              <div className="note-actions">
                <button
                  onClick={() => toggleFavorite(note.id)}
                  className={`favorite-btn ${note.isFavorite ? 'active' : ''}`}
                >
                  ⭐
                </button>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="delete-btn"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="note-content">
              {note.content.length > 100
                ? `${note.content.substring(0, 100)}...`
                : note.content}
            </div>
            
            <div className="note-footer">
              <span className="note-date">
                Обновлено {formatDate(note.updatedAt)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <div className="empty-notes">
          <p>Заметки не найдены</p>
          {searchTerm && <p>Попробуйте изменить поисковый запрос</p>}
        </div>
      )}

      <div className="notes-stats">
        <p>Всего заметок: {notes.length}</p>
        <p>Избранных: {notes.filter(n => n.isFavorite).length}</p>
      </div>
    </div>
  );
}; 